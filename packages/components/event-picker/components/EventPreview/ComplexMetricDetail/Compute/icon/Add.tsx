import React from 'react';
import styled from 'styled-components';
import Icon from '@gio-design/icon';

const Add = () => {
  return (
    <AddWrapper>
      <Icon type='plus' style={{margin: 0}}/>
    </AddWrapper>
  );
};

export default Add;

const AddWrapper = styled.div`
  display: inline-block;
  height: 24px;
  line-height: 23px;
  width: 32px;
  border-radius: 6px;
  background-color: #13ECAE;
  color: white;
  text-align: center;
  vertical-align: middle;
`
