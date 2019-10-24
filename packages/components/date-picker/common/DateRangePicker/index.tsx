import React, { useState, useEffect } from 'react';
import moment from 'moment';

import CalendarLocaleZh from 'rc-calendar/lib/locale/zh_CN';
import CalendarLocaleEn from 'rc-calendar/lib/locale/en_US'
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';

interface DatePickerProps {
  value: moment.Moment[],
  onChange: (value: moment.Moment[]) => void,
  className?: string,
  disabledDate?: (current: moment.Moment) => boolean,
  calendarClassName?: string,
  locale: string,
  type?: 'start' | 'end',
}

const formatStr = 'YYYY/MM/DD';
const isSame = (a: moment.Moment, b: moment.Moment, granularity: moment.unitOfTime.StartOf = 'month') => (a && b) ? a.isSame(b, granularity) : false
const diffInnerValue = ([left, right]: moment.Moment[]) => {
  return isSame(left, right) ? [left.clone().subtract(1, 'month'), left] : [left, right]}

const DateRangePicker = ({
  value,
  onChange,
  className = '',
  disabledDate = () => (false),
  calendarClassName = '',
  locale = 'zh',
  type
}: DatePickerProps) => {

  const [innerValue, setInnerValue] = useState(diffInnerValue(value))
  const onValueChange = (date: moment.Moment[], mode) => setInnerValue(diffInnerValue(date))
  useEffect(() => {
    if (value[0] && value[1]) {
      if (value.some((m) => !isSame(m, innerValue[0]) && !isSame(m, innerValue[1]))) {
        setInnerValue(diffInnerValue(value))
      }
    }
  }, [value])

  return (
    <div className={className}>
      <RangeCalendar
        prefixCls='ant-calendar'
        dateInputPlaceholder={['请选择开始时间', '请选择结束时间']}
        selectedValue={value}
        value={innerValue}
        showClear={true}
        format={formatStr}
        onChange={onChange}
        showDateInput={false}
        showToday={false}
        locale={getCalendarLocale(locale)}
        disabledDate={disabledDate}
        className={calendarClassName}
        onValueChange={onValueChange}
        dateRender={(current, value) => {
          return (disabledDate(value) || isSame(current, value, 'month')) ? (
            <div className='ant-calendar-date' >
              {parseInt(current.format('DD'), 10)}
            </div>
          ) : undefined
        }}
      />
    </div>
  )
}

const getCalendarLocale = (locale?: string): object => {
  return (locale === 'zh' || locale === 'zh-cn' || locale === 'cn') ? CalendarLocaleZh : CalendarLocaleEn;
}

const formats = (values) => values.map((v) => v && v.format(formatStr))

export default DateRangePicker;
