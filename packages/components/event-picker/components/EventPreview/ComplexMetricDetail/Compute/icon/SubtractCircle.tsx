import React from 'react';
import styled from 'styled-components';

const SubtractCircle = () => {
  return (
    <Wrapper>-</Wrapper>
  );
};

export default SubtractCircle;

export const Wrapper = styled.div`
  height: 14px;
  width: 14px;
  background-color: #333;
  display: inline-block;
  border-radius: 7px;
  color: white;
  vertical-align: middle;
  line-height: 12px;
  text-align: center;
  margin-right: 5px;
`
