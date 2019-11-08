import React from 'react';
import classnames from 'classnames';
import Icon from '@gio-design/icon';

import './trigger.less';

interface Props {
  className?: string;
  title?: string;
}

const Trigger: React.FC<Props> = (props) => {
  const title = props.title || (typeof props.children === 'string' ? props.children : '')
  return (
    <span
      className={classnames(
        'gio-picker-trigger',
        props.className ? props.className : ''
      )}
      title={title}
    >
      <span className='gio-picker-trigger-content'>
        {props.children}
      </span>
      <Icon type='down' />
    </span>
  )
}

export default Trigger;
