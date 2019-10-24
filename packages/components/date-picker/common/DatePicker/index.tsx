import React from 'react';
import moment from 'moment';
// import DatePickerHeader from './Header'

const Calendar = require('rc-calendar').default ? require('rc-calendar').default : require('rc-calendar');
const CalendarLocaleZh = require('rc-calendar/lib/locale/zh_CN').default ? require('rc-calendar/lib/locale/zh_CN').default : require('rc-calendar/lib/locale/zh_CN');
const CalendarLocaleEn = require('rc-calendar/lib/locale/en_US').default ? require('rc-calendar/lib/locale/en_US').default : require('rc-calendar/lib/locale/en_US');

interface DatePickerProps {
    value: moment.Moment
    onChange: (value: moment.Moment) => void,
    className?: string,
    disabledDate?: (current: moment.Moment) => boolean,
    calendarClassName?: string,
    locale: string,
    type?: 'start' | 'end',
}

const disabledDate = () => (false)

const DatePicker = ({
    value,
    onChange,
    className,
    disabledDate,
    calendarClassName,
    locale,
    type
}: DatePickerProps) => (
    <div className={className || ''}>
        {/* {type && (<DatePickerHeader locale={locale} type={type} value={value.format('YYYY/MM/DD')} />)} */}
        <Calendar
            prefixCls='ant-calendar'
            showDateInput={false}
            showToday={false}
            locale={getCalendarLocale(locale || 'zh')}
            value={value}
            onChange={onChange}
            disabledDate={disabledDate || disabledDate}
            className={calendarClassName || ''}
        />
    </div>
)

const getCalendarLocale = (locale?: string): object => {
    return (locale === 'zh' || locale === 'zh-cn' || locale === 'cn') ? CalendarLocaleZh : CalendarLocaleEn;
}

export default DatePicker;
