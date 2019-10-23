import React from 'react';
import noop from 'lodash/noop';
import SelectList from '../SelectList/SelectGroup';
import get from 'lodash/get'
import isEqual from 'lodash/isEqual';
import Input from '@gio-design/components/lib/input';

const isContain = require('@gio-core/utils/pinyinHelper').default;

const AntTabs = require('antd/lib/tabs');
const AntTabPane = AntTabs.TabPane;
const SearchInput = Input.Search;

const loadingWrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%'
};

interface ValueType {
  [key: string]: string[]
}

export interface TabOption {
  tabKey: string,
  name: string,
  options: any[],
  placeholder: string
}

export interface Props {
  value: any,
  onChange: (value: any) => void,
  tabOptions?: TabOption[],
  disabledOptions?: any[],
  valueKey?: string,
  isMultiple?: boolean,
  max?: number,
  width?: number,
  height?: number,
  isLoading?: boolean,
  required?: boolean,
  showSearch?: boolean,
  searchableFields?: string[],
  searchPlaceholder?: string,
  emptyPlaceholder?: React.ReactNode
  onSearch?: (keyword: string) => void,
  renderFetchButton?: () => React.ReactNode,
  getGroupIcon?: (group: string) => React.ReactNode,
  onSelect?: (value: any, selectedValue: any) => void,
  onDeselect?: (value: any, selectedValue: any) => void
  handleChange?: (value: ValueType) => void
  className?: string,
  handleTabChange?: (tabKey: string) => void,
  tabKey?: string
}

interface State {
  value: {[key: string]: any},
  keyword: string,
  tabKey?: string,
  tabOptions?: TabOption[],
}

export default class Tabs extends React.Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    handleChange: noop,
    showSearch: true,
    searchableFields: ['name'],
    valueKey: 'id',
    isMultiple: false,
    isLoading: false,
    required: false,
    height: 450,
    emptyPlaceholder: '没有找到相关结果',
    handleTabChange: noop,
    width: 280
  }

  public state: State = {
    tabOptions: [],
    value: null,
    keyword: '',
    tabKey: null,
  }

  private loading = (<div style={{ ...loadingWrapperStyle, height: this.props.height }}><div className='loading-gif' /></div>)

  public componentDidMount() {
    this.setState({
      value: this.props.value,
      tabOptions: this.filterTabOptions(this.state.keyword),
      tabKey: this.props.tabKey || this.getFirstTabKey(this.props.tabOptions)
    });
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({
      tabOptions: this.filterTabOptions(this.state.keyword, nextProps),
      value: isEqual(this.props.value, nextProps.value) ? this.state.value : nextProps.value
    });
  }

  public render() {
    return (
      <div className='gio-select-core'>
        {this.renderSearch()}
        {this.renderTab()}
      </div>
    )
  }

  private renderSearch = () => {
    const {
      showSearch,
      renderFetchButton,
      width
    } = this.props;
    const { tabOptions, tabKey } = this.state
    const nowTabOption = tabOptions.find((tabOption) => tabOption.tabKey === tabKey)
    return  showSearch && (
      <div className='gio-select-core-header'>
        <SearchInput
          width={renderFetchButton ? `${width - 65}px`  :  `${width - 20}px`}
          placeholder={get(nowTabOption, 'placeholder')}
          onSearch={this.handleSearch}
          allowRedundant={true}
          quickMode={true}
        />
        {renderFetchButton && renderFetchButton()}
      </div>
    )
  }

  private renderTab = () => {
    const { isLoading } = this.props;
    const { tabOptions } = this.state

    return tabOptions.length > 0 && (
      <div style={{ width: this.props.width || loadingWrapperStyle.width}}>
        <AntTabs onChange={this.handleTabChange} activeKey={this.state.tabKey}>
          {
            tabOptions.map(({ name, tabKey, options }: TabOption) => {
              return (
                <AntTabPane tab={name} key={tabKey}>
                  {!isLoading ? this.renderSelect(options, tabKey) : this.loading}
                </AntTabPane>
              )
            })}
        </AntTabs>
      </div>
    )
  }

  private handleSearch = (keyword: string) => {
    if (this.props.onSearch) {
      this.props.onSearch(keyword);
      this.setState({ keyword });
    } else {
      this.setState({
        keyword,
        tabOptions: this.filterTabOptions(keyword)
      });
    }
  }

  private filterTabOptions = (keyword: string, props: Props = this.props) => {
    const { tabOptions } = props;
    if (!keyword) {
      return tabOptions;
    }
    return tabOptions.map((tabOption) =>
       ({...tabOption, options: this.filterOptions(keyword, props, tabOption.options)})
    )
  }

  private filterOptions = (keyword: string, props: Props = this.props, options: any[]) => {
    const { tabOptions, searchableFields, valueKey } = props;
    if (!keyword) {
      return tabOptions;
    }

    if (!valueKey) {
      return options.filter((option: any) => isContain(option, keyword));
    }
    return options.filter((option: any) => {
      if (searchableFields.length) {
        return searchableFields.some((field: string) => isContain(option[field], keyword));
      }
      return isContain(option, keyword)
    })
  }

  private handleTabChange = (tabKey: any) => {
    this.setState({tabKey})
    this.props.handleTabChange(tabKey)
  }

  private getFirstTabKey = (tabOptions: TabOption[]) => get(tabOptions, '[0].tabKey')

  private handleSelect = (tabKey: string) => {

    return (selectValue: any) => {
      const value = {
        ...this.state.value,
        [tabKey]: selectValue
      }
      this.setState({ value });
      this.props.onChange(value);
    }
  }

  private renderSelect = (options: any[] = [], tabKey: string) => {
    const {
      disabledOptions,
      valueKey,
      isMultiple,
      required,
      max,
      width,
      height,
      getGroupIcon,
      onSelect,
      onDeselect,
      emptyPlaceholder
    } = this.props;

    const { value } = this.state
    return options.length > 0 ? (
      <SelectList
        options={options}
        disabledOptions={disabledOptions}
        value={value[tabKey]}
        valueKey={valueKey}
        isMultiple={isMultiple}
        required={required}
        max={max}
        width={width}
        height={height}
        onSelect={onSelect}
        onDeselect={onDeselect}
        onChange={this.handleSelect(tabKey)}
        getGroupIcon={getGroupIcon}
      />
    ) : (<Empty emptyPlaceholder={emptyPlaceholder} height={height} />)
  }
}

const Empty = (props: {height: number, emptyPlaceholder: React.ReactNode}) => {
  return (
    <div
      style={{
        padding: '50% 10px 0',
        textAlign: 'center',
        height: props.height
      }}
    >
      {props.emptyPlaceholder}
    </div>
  )
}
