import React, { ReactNode } from 'react';
import Dropdown from 'antd/lib/dropdown';
import Icon from '@gio-design/icon';
import Button from '@gio-design/components/lib/button';
import { get, isEqual, noop } from 'lodash';
import FilterPanel from '../FilterPanel';
import Filter, { defaultFilter } from '@gio-core/types/Filter';
import Metric from '@gio-core/types/Metric';
import FilterExpression from '@gio-core/types/FilterExpression';
import DimensionExpression from '../DimensionExpression';
import cloneDeep from 'lodash/cloneDeep';
import Dimension from '@gio-core/types/Dimension';

import {
  Operator
} from '@gio-core/constants/operator';
import './style.less';

interface Props {
  filter: Filter,
  propertyOptions: any[]
  isPropertyOptionsLoading?: boolean,
  inavailablePropertyOptions?: any[],
  title?: string,
  metrics?: Metric[],
  timeRange?: string,
  children?: ((props: any) => JSX.Element) | ReactNode,
  onConfirm: (filter: Filter) => void,
  beforeOpen?: () => void,
  getPopupContainer?: () => HTMLElement
  disabled?: boolean
  onVisibleChange?: (x: boolean) => void
  exclude?: string[]
  unique?: string[]
  operatorExclude?: Operator[]
  valueExclude?: any[],
  dimensionsSearchPath?: string;
}

interface State {
  visible: boolean,
  filter: Filter
}

const emptyExpression: FilterExpression = {
  op: '=',
  key: undefined,
  value: undefined
};

class FilterDropdown extends React.PureComponent<Props, State> {
  public static defaultProps: Partial<Props> = {
    inavailablePropertyOptions: ['tm'],
    beforeOpen: noop,
    operatorExclude: [],
    valueExclude: [],
  }

  public state: State = {
    visible: false,
    filter: defaultFilter,
  }

  public componentDidMount() {
    this.setDefaultFilter(this.props);
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (!isEqual(nextProps.filter, this.props.filter)) {
      this.setDefaultFilter(nextProps);
    }
  }

  public render() {
    const { filter } = this.state;
    const {
      title = '全局过滤（AND）',
      propertyOptions,
      isPropertyOptionsLoading,
      inavailablePropertyOptions,
      metrics,
      timeRange,
      children,
      getPopupContainer,
      unique,
      operatorExclude,
      valueExclude,
    } = this.props;

    const content = typeof children === 'function' ? (children as any)({ filter }) : children;
    const trigger = content || (
      <Button><Icon type='filter' /></Button>
    );

    return this.props.disabled ? trigger as JSX.Element : (
      <Dropdown
        trigger={['click']}
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        overlay={(
          <div className='gio-filter-dropdown'>
            <h1 className='gio-filter-dropdown__title'>{title}</h1>
            <FilterPanel
              expression={DimensionExpression}
              filter={filter}
              propertyOptions={this.filterPropertyOptionsByExclude(propertyOptions.filter((option: any) => inavailablePropertyOptions.indexOf(option.id) < 0))}
              isPropertyOptionsLoading={isPropertyOptionsLoading}
              metrics={metrics}
              timeRange={timeRange}
              onChange={this.setFilter}
              unique={unique}
              operatorExclude={operatorExclude}
              valueExclude={valueExclude}
              dimensionsSearchPath={this.props.dimensionsSearchPath}
            />
            <div className='gio-filter-dropdown__footer'>
              <Button onClick={this.handleCancel}>取消</Button>
              <Button type='primary' onClick={this.handleConfirm}>保存</Button>
            </div>
          </div>
        )}
        getPopupContainer={getPopupContainer}
      >
        {trigger}
      </Dropdown>
    );
  }

  private setDefaultFilter(props: Props) {
    const filter = this.getFilter(props.filter);
    this.setState((prevState: State) => ({ ...prevState, filter }));
  }

  private getFilter = (filter: Filter) => {
    const exprsLength = get(filter, 'exprs.length');
    if (!exprsLength) {
      return defaultFilter;
    }
    if (exprsLength > 0 && exprsLength < 5) {
      const clonedFilter = cloneDeep(filter);
      clonedFilter.exprs.push(emptyExpression);
      return clonedFilter;
    }
    return filter;
  }

  private handleConfirm = () => {
    this.handleVisibleChange(false);
    const { filter: oldFilter } = this.state;
    const exprs = (get(oldFilter, 'exprs', []) as any[]).filter((e: FilterExpression) => e.key && e.value);
    const filter = exprs.length ? { ...oldFilter, exprs } : null;
    this.setState((prevState: State) => ({
      ...prevState,
      filter: filter || defaultFilter
    }), () => {
      this.props.onConfirm(filter);
    })
  }

  private handleCancel = () => {
    this.handleVisibleChange(false);
    const filter = this.getFilter(this.props.filter);
    this.setState((prevState: State) => ({
      ...prevState,
      filter,
      visible: false
    }));
  }

  private setFilter = (filter: Filter) => {
    this.setState((prevState: State) => ({
      ...prevState, filter
    }));
  }

  private handleVisibleChange = (visible: boolean) => {
    if (this.props.onVisibleChange) {
      this.props.onVisibleChange(visible);
    }
    if (visible) {
      this.props.beforeOpen();
      this.setDefaultFilter(this.props);
    }
    this.setState((prevState: State) => ({
      ...prevState, visible
    }));
  }

  private filterPropertyOptionsByExclude = (dimensions: Dimension[]) => {
    if (!dimensions) {
      return dimensions;
    }
    const { exclude } = this.props;
    if (exclude) {
      return dimensions.filter((d: Dimension) => !exclude.includes(d.type));
    }
    return dimensions;
  }
}

export default FilterDropdown;
