import React, { ReactNode } from 'react';

import './style.less';

interface Props {
  children: ReactNode,
  size?: string,
  style?: React.CSSProperties
};

const CircularIcon = ({ children, size = '23px', style = {} }: Props): JSX.Element => (
  <span
    className='gio-circular-icon'
    style={{
      width: size,
      height: size,
      lineHeight: size,
      ...style
    }}
  >
    {children}
  </span>
);

export default CircularIcon;
