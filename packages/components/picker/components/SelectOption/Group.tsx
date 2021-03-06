import React from 'react';
import Checkbox from 'antd/lib/checkbox';
import noop from 'lodash/noop';

interface Props {
  name: string,
  id?: string,
  icon?: React.ReactNode,
  style?: React.CSSProperties,
  isMultiple: boolean,
  isSelected?: boolean,
  indeterminate?: boolean,
  showGroupCheckBox?: boolean
  onSelect?: (option: any) => void,
  option?: any,
  labelRenderer?: (option: any, isGroup?: boolean) => Element
};

export default class Group extends React.PureComponent<Props> {
  public static defaultProps = {
    onSelect: noop,
    style: {}
  }

  public render() {
    const {
      name,
      icon,
      style,
      isMultiple,
      showGroupCheckBox = false,
      isSelected,
      indeterminate,
      option,
      labelRenderer
    } = this.props

    return (
      <div
        className='gio-core gio-select-old-option group'
        style={{ ...style, color: '#222f73' }}
        onClick={this.handleSelect}
      >
        {!isMultiple && icon}
        {isMultiple && showGroupCheckBox && <Checkbox checked={isSelected} indeterminate={indeterminate}/>}
        {labelRenderer ? labelRenderer(option, 'group') : name}
      </div>
    );
  }

  private handleSelect = () => {
    this.props.onSelect(this.props.option);
  }
}
