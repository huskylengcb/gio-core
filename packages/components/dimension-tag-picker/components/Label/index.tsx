import React from 'react';
import Tooltip from 'antd/lib/tooltip';
import Icon from 'giodesign/icon';

const iconStyle = { fill: '#F63434' };

const InvalidTip = (
  <Tooltip title='与已选择的某些事件或指标组合后无意义'>
    <span>
      <Icon name='gicon-explain' svgStyle={iconStyle} />
    </span>
  </Tooltip>
);

const Label = ({
  children,
  isInvalid
}) => isInvalid ? (<span>无效维度 {InvalidTip}</span>) : children;

export default Label;
