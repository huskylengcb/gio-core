import React from 'react';
import SelectOption from '../SelectOption';
import Group from '../SelectOption/Group';
import Fold from '../SelectOption/Fold';
import { get } from 'lodash';
//import withGroupedOptions from 'modules/core/components/HOC/withGroupedOptions';

import './style.less';

const List = require('react-virtualized').List;

interface Props {
  options: any[],
  disabledOptions?: any[],
  value: any | any[],
  valueKey?: string,
  renderKey?: string,
  isMultiple?: boolean,
  allowDuplicate?: boolean,
  required?: boolean,
  max?: number,
  width?: number,
  height?: number,
  onSelect?: (value: any, selectedValue?: any | any[], option?: any) => void,
  onDeselect?: (value: any, selectedValue?: any | any[], option?: any) => void,
  onChange?: (value: any) => void,
  getSelected?: (option: any, value: any) => boolean,
  getGroupIcon?: (group: string) => React.ReactNode,
  labelRenderer?: (option: any, isGroup?: boolean) => any
}

interface State {
  value: any | any[]
}

class SelectList extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    disabledOptions: [],
    isMultiple: false,
    width: 280,
    height: 450
  }

  public state: State = {
    value: null
  }

  public render() {
    return (
      <div className='gio-select-list-wrapper'>
        {this.renderList()}
      </div>
    )
  }

  private renderList = () => {
    const { width, height, disabledOptions } = this.props;
    return (
      <List
        value={this.props.value}
        width={width}
        height={height}
        rowCount={this.props.options.length}
        rowHeight={40}
        rowRenderer={this.renderListItem}
        disabledOptions={disabledOptions}
        className={'gio-select-list'}
      />
    )
  }

  private renderListItem = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const option = this.props.options[index];
    // const isGroup = get(option, 'type') === 'groupName';
    const { isMultiple, required, value, valueKey, renderKey, max, disabledOptions, labelRenderer } = this.props;
    const label = labelRenderer ? labelRenderer(option) : get(option, 'name') || option;
    const key = (renderKey || valueKey) ? option[renderKey || valueKey] : option
    const isSelectedAndRequired = this.getSelected(option) && required && (isMultiple ? value.length === 1 : true);
    const isMax = !this.getSelected(option) && isMultiple && value.length >= max;
    const disabled = isSelectedAndRequired || isMax || disabledOptions.indexOf(valueKey ? option[valueKey] : option) > -1;
    const groupIcon = this.props.getGroupIcon ? this.props.getGroupIcon(option.group) : null;
    switch(get(option, 'type')) {
      case 'groupName':
        return (
          <Group
            key={option.name}
            name={option.name}
            option={option}
            style={style}
            icon={groupIcon}
            isSelected={this.getSelected(option)}
            isMultiple={!!this.props.isMultiple}
            labelRenderer={labelRenderer}
          />
        )

      case 'fold':
        return (
          <Fold
            key={option.name}
            name={option.name}
            option={option}
            style={style}
            icon={groupIcon}
            isSelected={this.getSelected(option)}
            isMultiple={!!this.props.isMultiple}
            labelRenderer={labelRenderer}
          />
        )
      
        default:  
        return (
          <SelectOption
            key={key}
            style={style}
            option={option}
            title={!labelRenderer ? label : undefined}
            isSelected={this.getSelected(option)}
            isMultiple={this.props.isMultiple}
            allowDuplicate={this.props.allowDuplicate}
            onSelect={this.handleSelect}
            disabled={disabled}
            hasGroupIcon={!!groupIcon}
            showGroupCheckBox={true}
          >
            {label}
          </SelectOption>
        )
    }
    // return isGroup ? (
    //   <Group
    //     key={option.name}
    //     name={option.name}
    //     option={option}
    //     style={style}
    //     icon={groupIcon}
    //     isSelected={this.getSelected(option)}
    //     isMultiple={!!this.props.isMultiple}
    //     labelRenderer={labelRenderer}
    //   />
    // ) : (
    //   <SelectOption
    //     key={key}
    //     style={style}
    //     option={option}
    //     title={!labelRenderer ? label : undefined}
    //     isSelected={this.getSelected(option)}
    //     isMultiple={this.props.isMultiple}
    //     allowDuplicate={this.props.allowDuplicate}
    //     onSelect={this.handleSelect}
    //     disabled={disabled}
    //     hasGroupIcon={!!groupIcon}
    //     showGroupCheckBox={true}
    //   >
    //     {label}
    //   </SelectOption>
    // );
  }

  private handleSelect = (option: any) => {
    const {
      max,
      isMultiple,
      allowDuplicate,
      onSelect,
      onDeselect,
      onChange
    } = this.props;

    const isMax = isMultiple && this.props.value.length >= max;
    if (isMax) { return; }

    const selectedValue = this.getValue(option);
    const isSelected = this.getSelected(option);
    let value
    if (isSelected && !allowDuplicate) {
      if (onDeselect) { onDeselect(selectedValue, this.props.value, option); }
      value = isMultiple ? this.props.value.filter((v: any) => v !== selectedValue) : null;
    } else {
      if (onSelect) { onSelect(selectedValue, this.props.value, option); }
      value = isMultiple ? [...(this.props.value || []), selectedValue] : selectedValue;
    }
    if (onChange) {
      onChange(value)
    }
  }

  private getValue = (option: any) => {
    const { valueKey } = this.props;
    return valueKey ? option[valueKey] : option;
  }

  private getSelected = (option: any) => {
    const {
      value,
      getSelected,
      isMultiple,
      valueKey
    } = this.props;

    if (getSelected) {
      return getSelected(option, value);
    }
    const target = valueKey ? option[valueKey] : option;

    return Array.isArray(value) ? value && value.indexOf(target) > -1 : value === target;
  }
}

export default SelectList;
//export default withGroupedOptions(SelectList);
