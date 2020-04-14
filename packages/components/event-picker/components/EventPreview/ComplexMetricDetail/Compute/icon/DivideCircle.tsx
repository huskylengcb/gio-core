import React from 'react';
import styled from 'styled-components';
import Icon from '@gio-design/icon';

const DivideCircle = () => {
  return (
    <Wrapper>÷</Wrapper>
  );
};

export default DivideCircle;

const Wrapper = styled.div`
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background-color: white;
  color: black;
  text-align: center;
  vertical-align: middle;
  font-size: 16px;
  user-select: none;
  line-height: 15px;
  border: 1px solid #DCDFED;
`
