import React from 'react';
// import Button from 'giodesign/button';
import format from '../../Range/util/format';
import styled from 'styled-components';
import Gap from '@gio-design/components/lib/gap';
import Icon from '@gio-design/components/lib/icon';
import flattenDateRange from '../../flattenDate';

interface  Props {
  label: string,
  onClick?: () => void,
  className?: string,
  focus: boolean,
  timeRange: string,
  showArrow?: boolean
}

export const Wrapper = styled.button`
  display: inline-block;
  height: 32px;
  line-height: 32px;
  transition: 0.2s;
  padding: 0 9px;
  background-color: #FAFAFA;
  border: 1px solid #F2F2F2;
  cursor: pointer;
  outline: none;
  transition: all 0.3s;
  font-size: 14px;
  &.focus {
    background-color: #3F4F9F;
    color: white;
  }
  &:focus, &:hover {
    border-color: #220968;
  }
`
const Label = (props: Props) => {
  const { startTime, endTime } = flattenDateRange(props.timeRange)
  const startStr = format(startTime)
  const endStr = format(endTime)
  return (
    <Wrapper
      className={`${props.className} ${props.focus ? 'focus' : ''}`}
      onClick={props.onClick}
    >
      {props.label && (<span className='text' title={props.label}>{props.label}</span>)}
      <Gap width={5} />
      {props.timeRange ? startStr === endStr ? startStr : `${startStr} - ${endStr}` : null}
      {props.showArrow ? <Icon className={`icon arrow_down ${props.focus ? 'focus' : ''}`} name='gicon-arrow-down' fill={props.focus ? '#fff' : '#666'} /> : undefined}
    </Wrapper>
  )
};

export default Label
