import React from 'react';
import ValueSelect from '@gio-core/components/value-select';
import Metric from '@gio-core/types/Metric';
import { debounce, difference } from 'lodash';

const http = require('@gio-core/utils/http').default;

// const getDateRangeLabel = require('components/utils/GrDateRangePicker').getDateRangeLabel;

//const dimensionsService = require('store/data/dimensions').default;

interface State {
  keyword: string,
  dimension: string,
  valueOptions: string[],
  isLoading: boolean,
  isTyping: boolean
}

interface Props {
  values: string[],
  dimension: string,
  dimensionName: string,
  valueExclude?: any[],
  mode?: string,
  metrics?: Metric[],
  timeRange?: string,
  userType?: string,
  placeholder?: string,
  style?: React.CSSProperties,
  dimensionsSearchPath?: string;
  onChange: (values: string[]) => void,
  getPopupContainer?: () => HTMLElement,
  valueInclude?: any[]
  showSearch?: boolean
}

const clearValueOptions = (prevState: State): State => ({ ...prevState, valueOptions: [] });

class DimensionValueSelect extends React.PureComponent<Props, State> {
  public static defaultProps = {
    placeholder: '选择维度值',
    style: {}
  }

  public state: State = {
    keyword: '',
    dimension: '',
    valueOptions: [],
    isLoading: false,
    isTyping: true
  }

  private fetchDimensionValue = debounce((dimension: string, keyword: string) => {
    this.setState((prevState: State) => ({ ...prevState, isLoading: true }));
    const { metrics = [], timeRange = 'day:8,1', valueExclude, dimensionsSearchPath = '/dimensions/search' } = this.props;
    http.post(dimensionsSearchPath, { data: { dimension, keyword: keyword || '', metrics, timeRange } }, true)
    //dimensionsService.search(dimension, keyword || '', metrics, timeRange)
      .then((valueOptions: any[]) => {
        valueOptions = difference(valueOptions, valueExclude);
        // State 中的 keyword 用于标记当前 valueOptions 是通过搜索获得
        this.setState((prevState: State) => ({
          ...prevState,
          keyword,
          dimension,
          valueOptions,
          isLoading: false,
          isTyping: false
        }));
      })
      .catch(() => {
        this.setState((prevState: State) => ({
          ...prevState,
          keyword: '',
          valueOptions: ['Error'],
          isLoading: false,
          isTyping: false
        }));
      });
  } , 300);

  public render() {
    const props = this.props;
    const { showSearch =  true } = props;
    const { valueOptions, keyword, isLoading, isTyping } = this.state;
    return (
      <ValueSelect
        showSearch={showSearch}
        options={props.valueInclude && props.valueInclude.length ? props.valueInclude : valueOptions}
        onSearch={this.handleValueSearch}
        onFocus={this.handleValueFocus}
        placeholder={props.placeholder}
        keyword={keyword}
        isLoading={isLoading}
        groupName={props.dimensionName}
        onChange={this.onChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ with: '360px' }}
        style={{ width: '200px', ...props.style }}
        disabled={!props.dimension}
        values={props.values}
        mode={props.mode}
        notFoundContent={isTyping || isLoading ? '正在加载……' : '没有可用维度值'}
        getPopupContainer={props.getPopupContainer}
        freeInputTooltip={this.generateFreeInputTooltip()}
      />
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.dimension !== this.props.dimension) {
      this.setState(clearValueOptions);
      this.fetchSuggestions();
    }
  }

  private onChange = (values: string[]) => {
    // 搜索并选中后，清除关键词显示默认选项列表
    // if (this.state.keyword) {
    //   this.fetchSuggestions('');
    // }
    if (this.props.mode === 'tags' && !(values && values.length)) {
      this.fetchSuggestions('');
    }
    this.props.onChange(Array.isArray(values) ? values : [values]);
  }

  private generateFreeInputTooltip = () => {
    const { timeRange } = this.props;
    return timeRange && `${getDateRangeLabel(timeRange)}没有出现该维度值，您可以输入后在更大时间范围内搜索`;
  }

  private fetchSuggestions = (keyword?: string): void => {
    const { state } = this;
    const dimension = this.props.dimension;

    const shouldFetch = dimension && (
        keyword !== undefined
        || state.dimension !== dimension
        || !state.valueOptions.length
      );

    if (!shouldFetch) { return; }
    this.setState({ isTyping: true });
    this.fetchDimensionValue(dimension, keyword);
  }

  private handleValueSearch = (keyword: string): void => {
    this.fetchSuggestions(keyword);
  }

  private handleValueFocus = (): void => {
    // 首次加载非空数据，点击时获取 options
    const isValueOptionsEmpty = !this.state.valueOptions.length;
    // 用户在使用搜索并选中后，再次点击 valueSelect，重新获取全部 valueOptions
    const shouldRefetchAfterSearch = !!this.state.keyword;

    if (isValueOptionsEmpty || shouldRefetchAfterSearch) {
      this.fetchSuggestions('');
    }
  }
}

export default DimensionValueSelect;
