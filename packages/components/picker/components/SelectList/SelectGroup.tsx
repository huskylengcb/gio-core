import React from 'react';
import SelectOption from '../SelectOption';
import Group from '../SelectOption/Group';
import _, { get } from 'lodash';
import withGroupedOptions from './withGroupedOptions';

import './style.less';

const List = require('react-virtualized').List;

export interface Option {
  [key: string]: any,
  groupName: string,
  groupId: string,
  id: string,
  name: string
}

export interface GroupOption {
  groupName: string, groupId: string, options: Option[]
}

interface Props {
  options: any[],
  disabledOptions?: any[],
  value: any | any[],
  valueKey?: string,
  isMultiple?: boolean,
  required?: boolean,
  max?: number,
  width?: number,
  height?: number,
  onSelect?: (value: any, values?: any | any[], option?: any) => void,
  onDeselect?: (value: any, values?: any | any[], option?: any) => void,
  onChange?: (value: any) => void,
  getSelected?: (option: any, value: any) => boolean,
  getGroupIcon?: (group: string) => React.ReactNode,
  groups: GroupOption[],
  originalOptions: any[]
}

interface State {
  value: any | any[]
}

class SelectList extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    disabledOptions: [],
    isMultiple: false,
    width: 280,
    height: 450,
    max: Infinity
  }

  public state: State = {
    value: null
  }

  public render() {

    return (
      <div className='gio-select-list-wrapper' >
        {this.renderList()}
      </div>
    )
  }

  private renderList = () => {
    const { value, width, height, disabledOptions } = this.props;
    const rowCount = this.getRowCount()

    return (
      <List
        value={value}
        width={width}
        height={height}
        rowCount={rowCount}
        rowHeight={40}
        rowRenderer={this.renderListItem}
        disabledOptions={disabledOptions}
        className={'gio-select-list'}
      />
    )
  }

  private getRowCount = () => {
    const { originalOptions, options, groups, isMultiple } = this.props;

    const showGroupCheckBox = Object.keys(groups).length > 1
    let count = options.length
    if (isMultiple) {
      if (showGroupCheckBox) {
        count = options.length + 1 // 有全选
      } else {
        count = options.length
      }
    } else if(!showGroupCheckBox)  {
      count = originalOptions.length // 无group栏渲染
    }

    return count
  }

  private renderCheckAllButton = (style: React.CSSProperties ) => {
    const { value, originalOptions } = this.props
    return originalOptions.length > 0 && (
      <div style={{ ...style }} key='check-all'>
        <Group
          name={`全选（${this.props.originalOptions.length}个）`}
          icon={null}
          isSelected={originalOptions.length === value.length}
          isMultiple={this.props.isMultiple}
          showGroupCheckBox={true}
          indeterminate={value.length > 0 && value.length !== originalOptions.length}
          onSelect={this.handleCheckAllButtonClick}
          style={{ padding: '0 15px' }}
        />
        <div style={{ margin: '0 15px', borderBottom: '1px solid #E2E2E2' }} />
      </div>
    )
  }

  private renderListItem = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const { isMultiple, required, value, valueKey, max, disabledOptions = [], groups, originalOptions, options } = this.props;
    let showGroupCheckBox = Object.keys(groups).length > 1
    let option = options[index] // default
    if (isMultiple) {
      // render multiple rowrender
      if (index === 0) {
        // render top choose all while single select have not
        return this.renderCheckAllButton(style)
      }
      if (showGroupCheckBox) {
        option = options[index - 1]
      } else {
        option = originalOptions[index - 1]
      }
    } else {
      // render single select rowrender
      if (showGroupCheckBox) {
        option = options[index]
      } else {
        option = originalOptions[index]
      }
    }

    const isGroup = get(option, 'type') === 'groupName';
    const label = get(option, 'name') || option;
    const key = valueKey ? option[valueKey]: option
    const isSelectedAndRequired = this.getSelected(option) && required && (isMultiple ? value.length === 1 : true);
    const isMax = !this.getSelected(option) && isMultiple && value.length >= max;
    const disabled = isSelectedAndRequired || isMax || disabledOptions.indexOf(key) > -1;
    const groupIcon = this.props.getGroupIcon ? this.props.getGroupIcon(option.group) : null;

    if (isGroup) {
      const {isSelected, indeterminate} = this.getGroupSelected(option)
      return showGroupCheckBox && (
        <Group
          name={option.name}
          style={style}
          icon={groupIcon}
          isSelected={isSelected}
          isMultiple={!!this.props.isMultiple}
          showGroupCheckBox={showGroupCheckBox}
          indeterminate={indeterminate}
          onSelect={this.handleGroupSelect}
          option={option}
          key={key}
        />
      )
    } else {
      return (
        <SelectOption
          key={key}
          style={style}
          option={option}
          title={label}
          isSelected={this.getSelected(option)}
          isMultiple={this.props.isMultiple}
          onSelect={this.handleSelect}
          disabled={disabled}
          hasGroupIcon={!!groupIcon}
          showGroupCheckBox={showGroupCheckBox}
        >
          {label}
        </SelectOption>
      );
    }
  }

  private handleSelect = (option: Option) => {
    const {
      isMultiple,
      onSelect,
      onDeselect,
      onChange
    } = this.props;
    const selectedValue = this.getValue(option);
    const isSelected = this.getSelected(option);
    let value
    if (isSelected) {
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

  private handleGroupSelect = (option: any) => {
    const {
      isMultiple,
      onSelect,
      onDeselect,
      onChange
    } = this.props;
    const selectedValue = this.getValue(option);
    const {isSelected, indeterminate} = this.getGroupSelected(option)
    const valueCollection = this.getValueCollection(selectedValue)

    let value
    if (isSelected) {
      if (onDeselect) { onDeselect(selectedValue, this.props.value); }
      value = isMultiple ? this.props.value.filter((v: any) => valueCollection.indexOf(v) === -1) : null;
    } else {
      if (onSelect) { onSelect(selectedValue, this.props.value); }
      value = isMultiple ? _.uniq([...(this.props.value || []), ...valueCollection]) : selectedValue;
    }
    if (onChange) {
      onChange(value)
    }
  }

  private handleCheckAllButtonClick = () => {
    const propsValue = this.props.value
    const groupValues = this.getAllValuesCollention()

    let value
    if (propsValue.length === groupValues.length) {
      value = []
    } else {
      value = groupValues
    }
    if (this.props.onChange) {
      this.props.onChange(value)
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
    } = this.props;
    if (getSelected) {
      return getSelected(option, value);
    }
    const target = this.getValue(option);

    return Array.isArray(value) ? value && value.indexOf(target) > -1 : value === target;
  }

  private getGroupSelected = (option: any) => {
    const { value, isMultiple } = this.props;
    const target = this.getValue(option);
    const valueCollection = this.getValueCollection(target)
    const filterValues = value.filter((v: any) => valueCollection.indexOf(v) > -1)
    const isSelected = isMultiple ? value && filterValues.length >= valueCollection.length : value === target;
    const indeterminate = filterValues.length > 0 && filterValues.length < valueCollection.length

    return { isSelected, indeterminate }
  }

  private getValueCollection = (target: string) =>  {
    const { groups, valueKey} = this.props
    return _
      .chain(groups)
      .find((group) => group.groupId === target)
      .get('options')
      .map((option) => option[valueKey])
      .value()
  }

  private getAllValuesCollention = () => {
    const { originalOptions, valueKey} = this.props
    return _
      .chain(originalOptions)
      .map((option) => (option[valueKey] || option))
      .value()
  }
}

const getOptions = (options: any[]) => _
  .chain(options)
  .groupBy((option) => option.groupId)
  .toPairs()
  .map(([groupId, options]) => ({ groupId, options, groupName: _.get(options, '0.groupName')}))
  .value()

// export default SelectList;
export default withGroupedOptions(SelectList, getOptions);
