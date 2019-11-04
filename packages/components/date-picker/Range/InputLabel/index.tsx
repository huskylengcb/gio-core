import React from 'react';

interface InputLabelProps {
  type?: 'normal' | 'now' | 'compare'
}

const WrapperStyle = {
  display: 'inline-block',
  padding: '10px 0 6px 10px',
  color: '#3F4F9F',
  'font-weight': 500,
}
const InputLabel = ({ type = 'normal'}: InputLabelProps) => {
  return (
    <span style={WrapperStyle}>
      {getLabelByType(type)}：
    </span>
  )
}

const getLabelByType = (type: InputLabelProps['type']) => {
  switch (type) {
    case 'now':
      return '本周期'
    case 'compare':
      return '上周期'
    case 'normal':
    default:
      return '时间范围'
  }
}

export default InputLabel
