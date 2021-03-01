import React, { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import './index.less';
import CompareLabel from './Label';
import RangeDecorator, { RangeDecoratorProps } from '../Range/RangeDecorator';
import SingleDatePicker from '../Range/index'
import Gap from '@gio-design-old/components/lib/gap';
import flattenDateRange from '../flattenDate';

export interface CompareDatePickerProps {
  value: string[],
  onChange?: (value: string[]) => void
}

const compareLabelRender = (timeRange: string, prefix: string) =>
  ({onClick, className, focus, label}) => (
    <CompareLabel
      label={prefix}
      onClick={onClick}
      className={className}
      focus={focus}
      timeRange={timeRange}
    />
  )

const commonLabelRender = (type: 'relative' | 'compare') =>
({onClick, className, focus, label}) => {
  switch (type) {
    case 'compare':
      return (
        <div>
          <CompareLabel
            label={'本周期：'}
            onClick={onClick}
            className={className}
            focus={true}
            timeRange={null}
          />
          <Gap width={7}/>
          VS
          <Gap width={7}/>
          <CompareLabel
            label={'上周期：'}
            onClick={onClick}
            className={className}
            focus={false}
            timeRange={null}
          />
        </div>
      )
    case 'relative':
    default:
      return (
        <CompareLabel
          label={label}
          onClick={onClick}
          className={className}
          focus={focus}
          timeRange={null}
          showArrow={true}
        />
      )
    }
}

const getDiffDays = (startMoment: moment.Moment, endMoment: moment.Moment) => endMoment.diff(startMoment, 'day').valueOf()

const calcAbsCompareTimeRange = (start: number, end: number) => {
  const startMoment = moment(start)
  const diffDays = getDiffDays(startMoment, moment(end))
  return `abs:${startMoment.clone().subtract(diffDays, 'day').subtract(1, 'd').startOf('d').valueOf()},${startMoment.clone().subtract(1, 'd').startOf('d').valueOf()}`
}

const getDiffDaysByTimeRange = (timeRange: string) => {
  const { type, startTime, endTime } = flattenDateRange(timeRange)
  const startMoment = moment(startTime)
  const endMoment = moment(endTime)
  return getDiffDays(startMoment, endMoment)
}

const defaultValidate = { showError: false, errorMsg: '' };

const CompareDatePicker = ({ onChange, value: [currentTimeRange, compareTimeRange], ...props}: CompareDatePickerProps & RangeDecoratorProps) => {
  const onDatePickerChange = (tag: 'current' | 'last') =>
    (value: string, start: moment.Moment, end: moment.Moment) => {
      const { type, startTime, endTime } = flattenDateRange(value)
      if (type === 'relative') {
        onChange([value, value])
        return
      }
      if (tag === 'current') {
        onChange([value, calcAbsCompareTimeRange(startTime, endTime)])
        return
      }

      const values = tag === 'last' ? [currentTimeRange, value] : [currentTimeRange, compareTimeRange]
      onChange(values)
  }

  const [leftVisible, setLeftVisible] = useState(false)
  const [rightVisible, setRightVisible] = useState(false)
  const [relativeLabelType, setRelativeLabelType] = useState<'relative' | 'compare'>('relative')

  const { type, startTime, endTime } = flattenDateRange(currentTimeRange)

  useEffect(() => {
    if (relativeLabelType !== 'relative') {
      setRelativeLabelType('relative')
    }
  }, [currentTimeRange])

  if (type === 'relative') {
    const relativeTimeValidate = (start: moment.Moment, end: moment.Moment) => {
      if (!end && relativeLabelType !== 'compare' ) {
        setRelativeLabelType('compare')
      }
      return defaultValidate
    }

    const onRelativePickerVisibleChange = (v) => {
      if (!v) { setRelativeLabelType('relative') }
      setLeftVisible(v)
    }

    return  (
      <SingleDatePicker
        labelComponent={commonLabelRender(relativeLabelType)}
        onChange={onDatePickerChange('current')}
        value={currentTimeRange}
        visible={leftVisible}
        onVisibleChange={onRelativePickerVisibleChange}
        validate={relativeTimeValidate}
        {...props}
      />
    )
  }

  const rightTimeValidate = (start: moment.Moment, end: moment.Moment) => {
    if (start && end) {
      if (getDiffDaysByTimeRange(currentTimeRange) !== end.diff(start, 'd').valueOf()) {
        return { showError: true, errorMsg: '已超出时间范围，对比的时间天数要相同'}
      }
    }
    return defaultValidate
  }

  return (
    <div className={`gio-date-picker-compare ${props.className ? props.className : ''}`}>
      <SingleDatePicker
        labelComponent={compareLabelRender(currentTimeRange, '本周期：')}
        onChange={onDatePickerChange('current')}
        value={currentTimeRange}
        visible={leftVisible}
        onVisibleChange={(v) => setLeftVisible(v)}
        {...props}
      />
      <Gap width={7}/>
      {
        compareTimeRange ?
          <>
            VS
            <Gap width={7}/>
            <SingleDatePicker
              labelComponent={compareLabelRender(compareTimeRange, '上周期：')}
              onChange={onDatePickerChange('last')}
              value={compareTimeRange}
              visible={rightVisible}
              onVisibleChange={(v) => setRightVisible(v)}
              validate={rightTimeValidate}
              {...props}
            />
          </>
        : compareLabelRender(compareTimeRange, '上周期：')
      }
    </div>
  )
}

export default CompareDatePicker
