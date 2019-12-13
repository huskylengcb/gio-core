import React from 'react';
import Icon from '@gio-design/icon';
import CircularIcon from '@gio-core/components/circular-icon';
import './style.less';

export interface AvatarProps {
  avatar?: string
  name?: string
  size?: number,
  style?: React.CSSProperties
  className?: string
}

const Avatar = (props: AvatarProps) => {
  const { avatar, name, size = 24, style, className } = props;
  const renderContent = () => {
    if (avatar) {
      return <img src={avatar} alt={`avatar${name ? name : 'anony'}`}/>
    } else if (name) {
      return <span className='avatar-name' style={{fontSize: size * 0.6 + 'px', lineHeight: size + 'px'}}>{renderUserName(name)}</span>
    } else {
      return <Icon style={{width: '60%', height: '60%'}} type='user' color='#FFF'/>
    }
  }
  return (
    <CircularIcon className={className || 'avatar-wrapper'} size={size + 'px'} style={style}>{renderContent()}</CircularIcon>
  )
}

export const renderUserName = (username) => {
  username = username.trim();

  if (username.match(/^[a-zA-Z0-9\- ]+$/)) {
    // 字母数字开头的用户名
    if (username.indexOf(' ') !== -1) {
      let parts = username.split(' ');
      username = `${parts[0][0]}${parts[1][0]}`;
    } else {
      username = username.substring(0, 2);
    }
  } else {
    // 其他字符开头的用户名
    username = username[username.length - 1];
  }

  return username;
}

export default Avatar
