import React from 'react';
import styled from 'styled-components';
import Icon from '@gio-design/icon';

const Subtract = () => {
  return (
    <AddWrapper>
      <Innner />
    </AddWrapper>
  );
};

export default Subtract;

const AddWrapper = styled.div`
  display: inline-block;
  height: 24px;
  /* line-height: 23px; */
  width: 32px;
  border-radius: 6px;
  background-color: #13ECAE;
  color: white;
  text-align: center;
  vertical-align: middle;
`

const Innner = styled.div`
  color: white;
  display: inline-block;
  height: 1px;
  width: 12px;
  border-radius: 0.5px;
  background-color: #FFFFFF;
  margin: 2px 0;
`
