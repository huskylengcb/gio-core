import { Moment } from 'moment';
import flattenDateRange from '../../flattenDate';

const moment = require('moment');

const map: {
    [key: string]: any
} = Object.freeze({
    today: {
        range: 'day:1,0',
        cn: '今天',
        en: 'Today',
        tooltip: ''
    },
    yesterday: {
        range: 'day:2,1',
        cn: '昨天',
        en: 'Yesterday',
        tooltip: ''
    },
    this_week: {
        range: 'week:1,0',
        cn: '本周',
        en: 'This Week',
        tooltip: ''
    },
    last_week: {
        range: 'week:prev',
        cn: '上周',
        en: 'Last Week',
        tooltip: ''
    },
    this_month: {
        range: 'month:1,0',
        cn: '本月',
        en: 'This Month',
        tooltip: ''
    },
    last_month: {
        range: 'month:prev',
        cn: '上月',
        en: 'Last Month',
        tooltip: ''
    },
    this_year: {
        range: 'year:1,0',
        cn: '今年',
        en: 'This Year',
        tooltip: ''
    },
    last_year: {
        range: 'year:prev',
        cn: '去年',
        en: 'Last Year',
        tooltip: ''
    },
    last_7_day: {
        range: 'day:8,1',
        cn: '过去7天',
        en: 'Last 7 Days',
        tooltip: ''
    },
    last_14_day: {
        range: 'day:15,1',
        cn: '过去14天',
        en: 'Last 14 Days',
        tooltip: ''
    },
    last_30_day: {
        range: 'day:31,1',
        cn: '过去30天',
        en: 'Last 30 Days',
        tooltip: ''
    },
    last_90_day: {
        range: 'day:91,1',
        cn: '过去90天',
        en: 'Last 90 Days',
        tooltip: ''
    },
    last_180_day: {
        range: 'day:181,1',
        cn: '过去180天',
        en: 'Last 180 Days',
        tooltip: ''
    },
    last_365_day: {
        range: 'day:366,1',
        cn: '过去365天',
        en: 'Last 365 Days',
        tooltip: ''
    },
    since: {
        range: 'since',
        cn: '开始至今',
        en: 'up to now',
        tooltip: '从您选择的开始时间起，持续统计数据'
    },
    last_cycle: {
        range: 'auto',
        cn: '上一周期',
        en: 'up to now',
        tooltip: '从您选择的开始时间起，持续统计数据'
    }
});

/**
 * 今天
 */
const todayRange = map.today.range

/**
 * 获取全部range对应的value
 * @returns { object }
 */
const getAllRanges = (): {
    [key: string]: string
} => {
    const ranges: {
        [key: string]: string
    } = {};
    const keys = Object.keys(map);
    keys.forEach((key) => {
        if (key !== 'last_cycle') {
            ranges[key] = map[key].range
        }
    })
    return ranges
}

/**
 * 根据range获取key
 * @param { string }
 * @return { string }
 */
const getKeyFromRange = (range: string): string => {
    if (!range) {
        return ''
    }
    const keys = Object.keys(map)
    let result = ''
    keys.forEach((key) => {
        if (map[key].range === range) {
            result = key
        }
    })
    return result
}

/**
 * 根据range获取tooltip
 * @param {string}
 * @returns { string }
 */
const getTooltipFromKey = (key: string): string => {
    return map[key] ? map[key].tooltip : ''
}

/**
 * 获取range的value
 * @param { string }
 * @returns { string }
 */
const getRangeFromKey = (key: string): string => map[key] ? map[key].range || todayRange : todayRange

/**
 * 格式化range
 * @param { string } range
 * @returns { object }
 * @returns { string } type
 * @returns { number[] } dateRange
 */
const formatRange = (range: string): {
    type: string,
    dateRange: number[]
} => {
    if (!/^[a-zA-Z]+\:((\d+\,\d+)|((prev)?))/.test(range)) {
        return
    }
    const rangeArray = range.split(':')
    const type = rangeArray[0]
    let dateRange = []
    if (rangeArray[1] === 'prev') {
        dateRange = [2, 1]
    } else {
        dateRange = rangeArray[1].split(',').map((v) => parseInt(v, 10))
    }
    return { type, dateRange }
}

/**
 * 获取range的Moment
 * @param { string }
 * @returns { Moment[] }
 */
const getMomentsFromRange = (range: string): Moment[] => {
    const formatedRange = flattenDateRange(range);
    if (!formatedRange) {
        return []
    }

    return [moment(formatedRange.startTime), moment(formatedRange.endTime)]
}

/**
 * 根据iclude获取ranges
 * @param { string[] }
 * @returns { string[] }
 */
const getIcludeRanges = (includes: string[]): {
    [key: string]: string
} => {
    const ranges: {
        [key: string]: string
    } = {}
    includes.forEach((key) => {
        const rangeInfo = map[key]
        if (rangeInfo) {
            ranges[key] = rangeInfo.range
        }
    });
    return ranges
}

/**
 * 通过range获取range
 * @param { string }
 * @returns { string }
 */
// const getRangeFromValue = (range: string): string => {
//     const ranges = getAllRanges();
//     const keys = Object.keys(ranges);
//     return keys.find((key) => (range === ranges[key])) || ''
// }

/**
 * 国际化
 * @param { string }
 * @returns { string }
 */
const i18nRange = (range: string, locale?: 'cn' | 'en'): string => {
    if (/^since\:\d+/.test(range)) {
        const date = moment(parseInt(range.replace('since:', ''), 10)).format('YYYY/MM/DD');
        if (locale === 'en') {
            return `Since ${date}`
        }
        return `${date} - 至今`
    }
    if (/^abs\:\d+\,\d+/.test(range)) {
        const ranges = range.replace('abs:', '').split(',').map((v) => parseInt(v, 10))
        return `${moment(ranges[0]).format('YYYY/MM/DD')} - ${moment(ranges[1]).format('YYYY/MM/DD')}`
    }
    return getText(getKeyFromRange(range), locale) || range
}

const getText = (key: string, locale: 'cn' | 'en' = 'cn'): string => {
    if (!map[key]) {
        return ''
    }
    return locale === 'cn' ? map[key].cn : map[key].en
}

export default map;

export {
    getAllRanges,
    getTooltipFromKey,
    getKeyFromRange,
    formatRange,
    getMomentsFromRange,
    getRangeFromKey,
    getIcludeRanges,
    // getRangeFromValue,
    i18nRange,
    getText
};
