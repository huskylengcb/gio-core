import React from 'react';
// import Button from 'giodesign/button';
import format from '../../Range/util/format';
import Gap from '@gio-design/components/lib/gap';
import Icon from '@gio-design/components/lib/icon';
import flattenDateRange from '../../flattenDate';
import './index.less'
interface  Props {
  label: string,
  onClick?: () => void,
  className?: string,
  focus: boolean,
  timeRange: string,
  showArrow?: boolean
}

const Label = (props: Props) => {
  const { startTime, endTime } = flattenDateRange(props.timeRange)
  const startStr = format(startTime)
  const endStr = format(endTime)
  return (
    <div
      className={`compare-date-picker-label-wrapper ${props.className} ${props.focus ? 'focus' : ''}`}
      onClick={props.onClick}
    >
      {props.label && (<span className='text' title={props.label}>{props.label}</span>)}
      <Gap width={5} />
      {props.timeRange ? startStr === endStr ? startStr : `${startStr} - ${endStr}` : null}
      {props.showArrow ? <Icon className={`icon arrow_down ${props.focus ? 'focus' : ''}`} name='gicon-arrow-down' fill={props.focus ? '#fff' : '#666'} /> : undefined}
    </div>
  )
};

export default Label
