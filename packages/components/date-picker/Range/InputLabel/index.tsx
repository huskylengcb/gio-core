import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  display: inline-block;
  padding: 10px 0 6px 10px;
  color: #3F4F9F;
  font-weight: 500;
`

interface InputLabelProps {
  type?: 'normal' | 'now' | 'compare'
}

const InputLabel = ({ type = 'normal'}: InputLabelProps) => {
  return (
    <Wrapper>
      {getLabelByType(type)}：
    </Wrapper>
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
