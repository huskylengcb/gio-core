import React from 'react';
import Input from '@gio-design-old/components/lib/input';
import Spin from '@gio-design-old/components/lib/spin';
import SelectList from '../SelectList';
import isContain from '@gio-core/utils/pinyinHelper';
import SelectListGroup from '../SelectList/SelectGroup';
import { get, groupBy } from 'lodash';

const SearchInput = Input.Search;

import './style.less';

export interface Props {
  value: any,
  onChange: (value: any) => void,
  options: any[],
  disabledOptions?: any[],
  valueKey?: string,
  renderKey?: string,
  isMultiple?: boolean,
  allowDuplicate?: boolean,
  max?: number,
  width?: number,
  height?: number,
  isLoading?: boolean,
  required?: boolean,
  showSearch?: boolean,
  searchableFields?: string[],
  searchPlaceholder?: string,
  emptyPlaceholder?: React.ReactNode,
  onSearch?: (keyword: string) => void,
  renderFetchButton?: () => React.ReactNode,
  getGroupIcon?: (group: string) => React.ReactNode,
  onSelect?: (value: any, selectedValue: any, option: any) => void,
  onDeselect?: (value: any, selectedValue: any, option: any) => void,
  labelRenderer?: (option: any, isGroup?: boolean) => any,
  showCheckAllBox?: boolean
}

interface State {
  options: any[],
  value: string | string[],
  keyword: string
}

class SelectCore extends React.Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    showSearch: true,
    searchableFields: ['name'],
    valueKey: 'id',
    isMultiple: false,
    isLoading: false,
    required: false,
    height: 450,
    emptyPlaceholder: '没有找到相关结果'
  }
  public state: State = {
    options: [],
    value: null,
    keyword: ''
  }

  public componentDidMount() {
    this.setState({
      value: this.props.value,
      options: this.filterOptions(this.state.keyword)
    });
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({
      value: nextProps.value,
      options: this.filterOptions(this.state.keyword, nextProps)
    });
  }

  public render() {
    const {
      isLoading,
      showSearch,
      height,
      width,
      searchPlaceholder,
      renderFetchButton
    } = this.props;
    return (
      <div className='gio-select-core'>
        {
          showSearch && (
            <div className='gio-select-core-header'>
              <SearchInput
                width={width ?  `${width - 20}px` : (renderFetchButton ? '215px' : '260px')}
                placeholder={searchPlaceholder}
                onSearch={this.handleSearch}
                allowRedundant={true}
                quickMode={true}
              />
              {renderFetchButton && renderFetchButton()}
            </div>
          )
        }
        {this.renderList()}
        {
          isLoading ? (
            <div className='loading-wrapper'>
              <Spin />
            </div>
          ) : null
        }
      </div>
    );
  }

  private handleSelect = (value: any) => {
    this.setState({ value });
    this.props.onChange(value);
  }

  private handleSearch = (keyword: string) => {
    if (this.props.onSearch) {
      this.props.onSearch(keyword);
      this.setState({ keyword });
    } else {
      this.setState({
        keyword,
        options: this.filterOptions(keyword)
      });
    }
  }

  private filterOptions = (keyword: string, props: Props = this.props) => {
    const { options, searchableFields } = props;
    if (!keyword) {
      return options;
    }
    if (!this.props.valueKey) {
      return options.filter((option: any) => isContain(option, keyword));
    }
    return options.filter((option: any) => {
      if (searchableFields.length) {
        return searchableFields.some((field: string) => isContain(option[field], keyword));
      }
      return isContain(option, keyword)
    })
  }

  private renderList = () => {
    const {
      disabledOptions,
      valueKey,
      renderKey,
      isMultiple,
      allowDuplicate,
      required,
      max,
      width,
      height,
      getGroupIcon,
      onSelect,
      onDeselect,
      emptyPlaceholder,
      labelRenderer,
      showCheckAllBox
    } = this.props;
    if (this.state.options && this.state.options.length) {
      if (showCheckAllBox) {
        return (
          <SelectListGroup
            options={this.state.options}
            disabledOptions={disabledOptions}
            value={this.state.value}
            valueKey={valueKey}
            isMultiple={isMultiple}
            required={required}
            max={max}
            width={width}
            height={height}
            onSelect={onSelect}
            onDeselect={onDeselect}
            onChange={this.handleSelect}
            getGroupIcon={getGroupIcon}
          />
        )
      } else {
        return (
          <SelectList
            options={getGroupedOptions(this.state.options)}
            disabledOptions={disabledOptions}
            value={this.state.value}
            valueKey={valueKey}
            renderKey={renderKey}
            isMultiple={isMultiple}
            allowDuplicate={allowDuplicate}
            required={required}
            max={max}
            width={width}
            height={height}
            onSelect={onSelect}
            onDeselect={onDeselect}
            onChange={this.handleSelect}
            getGroupIcon={getGroupIcon}
            labelRenderer={labelRenderer}
          />
        )
      }
    }

    return (
      <div style={{ padding: '50% 10px 0', textAlign: 'center', width, height }}>
        {!this.props.isLoading && emptyPlaceholder}
      </div>
    )
  }
}

export default SelectCore;

const getGroupedOptions = (options: any[]) => {
  if (!options.some((option: any) => option && option.groupName)) {
    return options;
  }
  const groupedOptions = groupBy(options, 'groupName');
  return Object.keys(groupedOptions).reduce((opts: any[], groupKey: string) => {
    const group = get(groupedOptions, `${groupKey}.0.group`);
    const groupId = get(groupedOptions, `${groupKey}.0.groupId`);
    return opts.concat([
      {
        id: groupId || groupKey,
        name: groupKey,
        type: 'groupName',
        group
      },
      ...groupedOptions[groupKey]
    ]);
  }, []);
}