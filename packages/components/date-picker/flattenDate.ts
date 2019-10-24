import moment from 'moment';

export interface FlattenDateRange {
  type: string,
  startTime: number,
  endTime: number
}

export default function flattenDateRange(range: string | FlattenDateRange): FlattenDateRange {
  let dateRange = {
    type: undefined,
    startTime: undefined,
    endTime: undefined
  };
  if (!range) {
    return {
      type: 'relative',
      startTime: moment().subtract(7, 'day').startOf('day').valueOf(),
      endTime: moment().subtract(1, 'day').endOf('day').valueOf()
    }
  }

  if (typeof range === 'object') {
    range.type = 'absolute';
    return range;
  }

  if (!range || range.trim() === '') {
    return {
      type: 'absolute',
      startTime: moment().startOf('day').valueOf(),
      endTime: moment().endOf('day').valueOf()
    };
  }

  // 这里对解析本月、本周和今年,暴力一点
  if (range.trim() === 'week:1,0') {
    return {
      type: 'relative',
      startTime: moment().subtract(1, 'day').startOf('isoWeek').valueOf(),
      endTime: moment().subtract(1, 'day').endOf('day').valueOf()
    }
  }

  if (range.trim() === 'month:1,0') {
    return {
      type: 'relative',
      startTime: moment().subtract(1, 'day').startOf('month').valueOf(),
      endTime: moment().subtract(1, 'day').endOf('day').valueOf()
    }
  }

  if (range.trim() === 'year:1,0') {
    return {
      type: 'relative',
      startTime: moment().subtract(1, 'day').startOf('year').valueOf(),
      endTime: moment().subtract(1, 'day').endOf('day').valueOf()
    }

  }
  // 暴力处理
  if (range.trim().match('since')) {
    const startTimeRange = range.split(':')[1];
    return {
      type: 'relative',
      startTime: parseInt(startTimeRange, 10),
      endTime: moment().endOf('day').valueOf()
    };
  }
  // end

  // 和本月本周一样采用了暴力处理，（去年，上月，上周）
  if (range.trim().match('prev')) {
    const relativeTimeRange = range.split(':')[0] as (moment.unitOfTime.DurationConstructor);
    let timeRange = relativeTimeRange as moment.unitOfTime.StartOf;
    if (timeRange === 'week') {
      timeRange = 'isoWeek'
    }
    return {
      type: 'relative',
      startTime: moment().subtract(1, relativeTimeRange).startOf(timeRange).valueOf(),
      endTime: moment().subtract(1, relativeTimeRange).endOf(timeRange).valueOf()
    }
  }
  // end

  if (range.indexOf('abs') !== -1) {
    const timestampArr = range.substr(range.indexOf(':') + 1).split(',');
    dateRange = {
      type: 'absolute',
      startTime: parseInt(timestampArr[0], 10),
      endTime: parseInt(timestampArr[1], 10),
    }
  } else {
    const dayArr = range.substr(range.indexOf(':') + 1).split(',');
    dateRange = {
      type: 'relative',
      startTime: moment().subtract(parseInt(dayArr[0], 10) - 1, 'days').startOf('day').valueOf(),
      endTime: moment().subtract(parseInt(dayArr[1], 10), 'days').endOf('day').valueOf()
    };
  }

  return dateRange;
}
