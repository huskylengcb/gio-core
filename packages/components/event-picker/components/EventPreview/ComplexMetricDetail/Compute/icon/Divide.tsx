import React from 'react';
import styled from 'styled-components';
import Icon from '@gio-design/icon';

const Divide = () => {
  return (
    <AddWrapper>÷</AddWrapper>
  );
};

export default Divide;

const AddWrapper = styled.div`
  display: inline-block;
  height: 24px;
  width: 32px;
  border-radius: 6px;
  background-color: #ECB013;
  color: white;
  text-align: center;
  vertical-align: middle;
  font-size: 19px;
  user-select: none;
  line-height: 22px;
`
