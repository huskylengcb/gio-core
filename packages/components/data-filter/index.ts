import React from 'react';
import { get } from 'lodash';

export interface FilterValues {
  [key: string]: any
}

type childrenType = (props: {
  data: any[],
  handleValueChange: any,
  filterValues: FilterValues
}) => JSX.Element

export interface Filters {
  [key: string]: {
    value?: any,
    match?: (item: any, key: string, value: any) => boolean
  }
}

export interface Props {
  data: any,
  filters?: Filters,
  predicate?: (filterValues: FilterValues, item: any, index: number) => boolean
  children: childrenType
}

interface State {
  data: any[],
  filterValues: FilterValues
}

class DataFilter extends React.PureComponent<Props, State> {
  public static defaultProps: Partial<Props> = {
    filters: {}
  }

  constructor(props: Props) {
    super(props);
    const filterValues = this.getDefaultFilterValues(props.filters);
    this.state = {
      data: this.filterData(props.data, filterValues),
      filterValues
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data !== this.props.data) {
      this.setState({ data: this.filterData(nextProps.data) })
    }
  }

  public render() {
    return this.props.children({
      data: this.state.data,
      handleValueChange: this.handleValueChange,
      filterValues: this.state.filterValues
    });
  }

  public handleValueChange = (value: FilterValues) => {
    const filterValues = {
      ...this.state.filterValues,
      ...value
    };
    const data = this.filterData(undefined, filterValues);
    this.setState({ filterValues, data });
  }

  private getDefaultFilterValues = (filters: Filters) =>
    Object.keys(filters).reduce((filterValues: any, key) => ({
      ...filterValues,
      [key]: filters[key].value
    }), {});

  private filterData = (data = this.props.data, filterValues = this.state.filterValues) => {
    let result;
    if (this.props.predicate) {
      result = data.filter((item: any, index: number) =>
        this.props.predicate(filterValues, item, index)
      )
    } else {
      const filterKeys = Object.keys(filterValues);
      return data.filter(
        (item: any) => {
          return filterKeys.every((key: string) => {
            const value = filterValues[key];
            const match = get(this, `props.filters.${key}.match`);
            if (value || match) {
              return match
                ? match(item, key, value)
                : item[key] === value;
            } else {
              return true;
            }
          });
        }
      );
    }
    return result;
  }
}

export default DataFilter;
