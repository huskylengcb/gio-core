import React from 'react';
import ValueSelect from '@gio-core/components/value-select';
import Metric from '@gio-core/types/Metric';
import Input from '@gio-design/components/lib/input';
import Select from '@gio-design/components/lib/select';
import Gap from '@gio-design/components/lib/gap';
import DatePicker from '@gio-design/components/lib/date-picker';
import { debounce, difference, isNil, isEmpty, isEqual } from 'lodash';
import DateRangePicker from '@gio-core/components/date-picker';
import styled from 'styled-components';
import moment from 'moment';
import { utils } from 'giochart'
const InputNumber = Input.InputNumber;
import { i18nRange } from '../../../date-picker/Range/util/shortcutRange'

const http = require('@gio-core/utils/http').default;

// const getDateRangeLabel = require('components/utils/GrDateRangePicker').getDateRangeLabel;

//const dimensionsService = require('store/data/dimensions').default;
const Wrapper = styled.div`
  display: inline-block;
`
interface State {
  keyword: string,
  dimension: string,
  valueOptions: string[],
  isLoading: boolean,
  isTyping: boolean,
  isError: boolean
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
  disabled?: boolean
  type?: string
  valueType?: string
  operator: string
}

const clearValueOptions = (prevState: State): State => ({ ...prevState, valueOptions: [] });
const getRelativeNowValues = (value: string = 'relativeTime:-1,0'): {
  base: 'before' | 'after',
  value: number,
  compute: 'in' | 'on' | 'off'
} => {
  const values = (value.slice('relativeTime:'.length) || '')
    .split(',').map((v: string) => Number(v));
  let results: {
    base: 'before' | 'after',
    value: number,
    compute: 'in' | 'on' | 'off'
  }
  if (values.length === 1) {
    results = values[0] < 0 ? {
      base: 'before',
      value: Math.abs(values[0]),
      compute: 'on'
    } : {
        base: 'after',
        value: Math.abs(values[0]),
        compute: 'off'
      }
  } else {
    results = values[0] < 0 ? {
      base: 'before',
      value: Math.abs(values[0]),
      compute: 'in'
    } : {
        base: 'after',
        value: Math.abs(values[1]),
        compute: 'in'
      }
  }
  return results;
}
const getRelativeBetweenValues = (value: string = 'relativeTime:-1,1'): {
  base: 'before' | 'after',
  value: [number, number]
} => {
  const values = (value.slice('relativeTime:'.length) || '')
    .split(',').map((v: string) => Number(v));
  let results: {
    base: 'before' | 'after',
    value: [number, number]
  } = {} as any;
  results.value = [Math.abs(values[0]), Math.abs(values[1])];
  results.base = values[0] < 0 ? 'before' : 'after';
  return results;
}
class DimensionValueSelect extends React.PureComponent<Props, State> {
  public static defaultProps = {
    placeholder: '维度值',
    style: {}
  }

  public state: State = {
    keyword: '',
    dimension: '',
    valueOptions: [],
    isLoading: false,
    isTyping: true,
    isError: false
  }
  componentDidMount() {
    this.getDefaultValues()
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.values) || !isEqual(nextProps.values, this.props.values)) {
      this.getDefaultValues(nextProps)
    }
  }

  getDefaultValues(props = this.props) {
    const { values, operator, valueType, dimension } = props;
    if (isEmpty(values) && dimension && valueType !== 'string') {
      if (valueType === 'date') {
        let values: string[] = [];
        if (operator === 'between') {
          values = ['abs:' + moment().startOf('day') + ',' + moment().endOf('day')]
        } else if (operator === 'relativeNow') {
          values = ['relativeTime:-1,0']
        } else if (operator === 'relativeBetween') {
          values = ['relativeTime:-1,-1']
        } else {
          values = [new Date().getTime() + '']
        }
        this.handleChange(values)
      }
    }
  }

  private fetchDimensionValue = debounce((dimension: string, keyword: string) => {
    this.setState((prevState: State) => ({ ...prevState, isLoading: true }));
    const { metrics = [], timeRange = 'day:8,1', valueExclude, dimensionsSearchPath = `/projects/${window.project?.id}/dimensions/search` } = this.props;
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
          isTyping: false,
          isError: false
        }));
      })
      .catch(() => {
        this.setState((prevState: State) => ({
          ...prevState,
          keyword: '',
          valueOptions: [],
          isLoading: false,
          isTyping: false,
          isError: true
        }));
      });
  } , 300);
  handleChange = (value) => {
    this.onChange(value)
  }
  handleDateChange = (moment: string) => this.handleChange([moment.valueOf() + '']);
  handleRelativeNowValueChange = (type: 'timeCompareBase' | 'timeCompareValue' | 'timeCompareCompute') => (val: any) => {
    if (type === 'timeCompareValue' && !val) return;
    let values;
    const timeCompareValues = getRelativeNowValues(this.props.values[0]);
    switch (type) {
      case 'timeCompareBase':
        if (val === 'before') {
          values = timeCompareValues.compute === 'in' ? [`${-timeCompareValues.value},0`] : [`${-timeCompareValues.value}`]
        } else {
          values = timeCompareValues.compute === 'in' ? [`0,${timeCompareValues.value}`] : [`${timeCompareValues.value}`]
        }
        break;
      case 'timeCompareValue':
        if (isNaN(val) || val < 0) {
          val = 1;
        }
        if (timeCompareValues.base === 'before') {
          values = timeCompareValues.compute === 'in' ? [`${-val},0`] : [`${-val}`]
        } else {
          values = timeCompareValues.compute === 'in' ? [`0,${val}`] : [`${val}`]
        }
        break;
      case 'timeCompareCompute':
        if (timeCompareValues.base === 'before') {
          values = val === 'in' ? [`${-timeCompareValues.value},0`] : [`${-timeCompareValues.value}`]
        } else {
          values = val === 'in' ? [`0,${timeCompareValues.value}`] : [`${timeCompareValues.value}`]
        }
        break;
      default:
        values = ['-1,0']
    }
    values = ['relativeTime:' + values[0]]
    this.handleChange(values)
  }
  handleRelativeBetweenValueChange = (type: 'timeCompareBase' | 'timeCompareValue1' | 'timeCompareValue2') => (val: any) => {
    if ((type === 'timeCompareValue1' || type === 'timeCompareValue2') && !val) return;
    let values;
    const { base, value: compareValue } = getRelativeBetweenValues(this.props.values[0]);
    switch (type) {
      case 'timeCompareBase':
        values = val === 'before' ? [`${-compareValue[0]},${-compareValue[1]}`] : [`${compareValue[0]},${compareValue[1]}`];
        break;
      case 'timeCompareValue1':
        if (isNaN(val) || val < 0) {
          val = 1;
        }
        values = base === 'before' ? [`${-val},${-compareValue[1]}`] : [`${val},${compareValue[1]}`]
        break;
      case 'timeCompareValue2':
        if (isNaN(val) || val < 0) {
          val = 1;
        }
        values = base === 'before' ? [`${-compareValue[0]},${-val}`] : [`${compareValue[0]},${val}`]
        break;
      default:
        values = ['-1,1']
    }
    values = ['relativeTime:' + values[0]]
    this.handleChange(values)
  }
  handleInputChange = (idx) => (value) => {
    const tmp = this.props.values;
    tmp[idx] = value
    this.handleChange(tmp);
  }
  handleValueChange = (value) => {
    if (isNil(value)) {
      this.handleChange(['1']);
      return;
    }
    this.handleChange([`${value}`]);
  }
  public render() {
    const props = this.props;
    const { showSearch = true, type, valueType, operator, values } = props;
    const { valueOptions, keyword, isLoading, isTyping, isError } = this.state;
    const disabled = !props.dimension;
    if (operator === 'isNaN' || operator === 'isNotNaN') {
      return null;
    }
    if (type === 'usr' && valueType !== 'string') {
      if (valueType === 'int' || valueType === 'double') {
        if (operator === 'between') {
          return (
            <Wrapper>
              <InputNumber
                className='single-number-input'
                style={{ width: '80px', height: '40px' }}
                defaultValue={values[0]}
                value={values[0]}
                onChange={this.handleInputChange(0)}
                disabled={!props.dimension}
              />
              <Gap width={8} />
              <span>与</span>
              <Gap width={8} />
              <InputNumber
                className='single-number-input'
                style={{ width: '80px', height: '40px' }}
                defaultValue={values[1]}
                value={values[1]}
                onChange={this.handleInputChange(1)}
                disabled={!props.dimension}
              />
            </Wrapper>
          )
        }
        return (
          <Wrapper>
            <InputNumber
              className='single-number-input'
              style={{ width: '100px', height: '40px' }}
              defaultValue={values[0]}
              value={values[0]}
              onChange={this.handleValueChange}
              disabled={!props.dimension}
            />
          </Wrapper>
        );
      } else if (valueType === 'date') {
        const [value] = values;
        if (operator === 'between') {
          const timeRange = Number(value) > 0
            ? 'abs:' + moment(Number(value)).startOf('day') + ',' + moment(Number(value)).endOf('day')
            : value
          return (
            <DateRangePicker.Range
              disabled={disabled}
              maxDate={moment().endOf('day').valueOf()}
              value={timeRange}
              onChange={this.handleDateChange}
              supportRelativeRange={false}
              shortcutIncludes={['yesterday', 'last_7_day', 'last_14_day', 'last_30_day', 'last_90_day', 'last_180_day']}
            />
          )
        }
        if (operator === 'relativeNow') {
          const timeCompareValues = getRelativeNowValues(value);
          return (
            <>
              <Gap width={8} />
              <span>在</span>
              <Gap width={8} />
              <Select style={{ width: 80 }} value={timeCompareValues.base} onChange={this.handleRelativeNowValueChange('timeCompareBase')}>
                <Select.Option value='before'>过去</Select.Option>
                <Select.Option value='after'>未来</Select.Option>
              </Select>
              <br />
              <InputNumber
                className='single-number-input'
                min={1}
                style={{ width: '100px', height: '32px' }}
                defaultValue={timeCompareValues.value}
                value={timeCompareValues.value}
                onChange={this.handleRelativeNowValueChange('timeCompareValue')}
                disabled={disabled}
              />
              <Gap width={8} />
              <span>天</span>
              <Gap width={8} />
              <Select
                style={{ width: 80 }}
                value={timeCompareValues.compute}
                onChange={this.handleRelativeNowValueChange('timeCompareCompute')}
              >
                <Select.Option value='in'>之内</Select.Option>
                {
                  timeCompareValues.base === 'before' ? (
                    <Select.Option value='on'>之前</Select.Option>
                  ) : (
                      <Select.Option value='off'>之后</Select.Option>
                    )
                }
              </Select>
            </>
          )
        }
        if (operator === 'relativeBetween') {
          const timeCompareValues = getRelativeBetweenValues(value);
          return (
            <>
              <Gap width={8} />
              <span>在</span>
              <Gap width={8} />
              <Select style={{ width: 80 }} value={timeCompareValues.base} onChange={this.handleRelativeBetweenValueChange('timeCompareBase')}>
                <Select.Option value='before'>过去</Select.Option>
                <Select.Option value='after'>未来</Select.Option>
              </Select>
              <br />
              <InputNumber
                className='single-number-input'
                min={1}
                style={{ width: '100px', height: '32px' }}
                defaultValue={timeCompareValues.value[0]}
                value={timeCompareValues.value[0]}
                onChange={this.handleRelativeBetweenValueChange('timeCompareValue1')}
                disabled={disabled}
              />
              <Gap width={8} />
              <span>天</span>
              <span>至</span>
              <Gap width={8} />
              <Select style={{ width: 80 }} value={timeCompareValues.base} onChange={this.handleRelativeBetweenValueChange('timeCompareBase')}>
                <Select.Option value='before'>过去</Select.Option>
                <Select.Option value='after'>未来</Select.Option>
              </Select>
              <Gap width={8} />
              <InputNumber
                className='single-number-input'
                min={1}
                style={{ width: '100px', height: '32px' }}
                defaultValue={timeCompareValues.value[1]}
                value={timeCompareValues.value[1]}
                onChange={this.handleRelativeBetweenValueChange('timeCompareValue2')}
                disabled={disabled}
              />
              <Gap width={8} />
              <span>天之内</span>
            </>
          )
        }
        const time = Number(value) > 0 ? Number(value) : utils.flattenDate(value || 'day:1,0').startTime
        return (
          <DatePicker
            value={moment(time)}
            onChange={this.handleDateChange}
            disabled={disabled}
          />
        );
      }
    }
    return (
      <ValueSelect
        showSearch={showSearch}
        options={props.valueInclude && props.valueInclude.length ? props.valueInclude : valueOptions}
        onSearch={this.handleValueSearch}
        onFocus={this.handleValueFocus}
        placeholder={`选择${props.placeholder}`}
        keyword={keyword}
        isLoading={isLoading}
        groupName={props.dimensionName}
        onChange={this.onChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ with: '360px' }}
        style={{ width: '200px', ...props.style }}
        disabled={props.hasOwnProperty('disabled') ? props.disabled : !props.dimension}
        values={props.values}
        mode={props.mode}
        notFoundContent={isTyping || isLoading ? '正在加载……' : isError ? '加载失败' : `没有可用${props.placeholder}`}
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
    return timeRange && `${i18nRange(timeRange)}没有出现该${this.props.placeholder}，您可以输入后在更大时间范围内搜索`;
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
