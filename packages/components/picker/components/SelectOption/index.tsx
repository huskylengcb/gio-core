import React from 'react';
import classnames from 'classnames';
import Checkbox from 'antd/lib/checkbox';
import Icon from '@gio-design/icon';

import './style.less';

interface Props {
  option: any,
  style: React.CSSProperties,
  title?: string,
  isSelected?: boolean,
  disabled?: boolean,
  className?: string,
  isMultiple?: boolean,
  allowDuplicate?: boolean,
  hasGroupIcon?: boolean,
  onSelect?: (option: any) => void,
  showGroupCheckBox?: boolean
}

export default class SelectOption extends React.PureComponent<Props> {
  public render() {
    const {
      isSelected = false,
      className = '',
      isMultiple = false,
      allowDuplicate = false,
      disabled = false,
      style,
      hasGroupIcon,
      showGroupCheckBox
    } = this.props;

    return (
      <div
        className={classnames('gio-core gio-select-option', className, {
          multiple: isMultiple,
          selected: isSelected,
          indented: showGroupCheckBox && hasGroupIcon,
          disabled
        })}
        style={style}
        onClick={disabled ? undefined : this.handleSelect}
        title={this.props.title}
      >
        {showGroupCheckBox && <div style={{ width: 25 }} />}
        {(isMultiple && !allowDuplicate) && <Checkbox checked={isSelected} />}
        {this.props.children}
        {(!isMultiple || allowDuplicate) && isSelected && <Icon type='check' color='#F48267' />}
      </div>
    )
  }

  private handleSelect = () => {
    this.props.onSelect(this.props.option);
  }
}
