import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './style.less';

interface Props {
  children: ReactNode,
  size?: string,
  style?: React.CSSProperties
  className?: string
};

const CircularIcon = ({ children, size = '23px', style = {}, className = ''}: Props): JSX.Element => (
  <span
    className={classnames(
              'gio-circular-icon',
              className
            )}
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
