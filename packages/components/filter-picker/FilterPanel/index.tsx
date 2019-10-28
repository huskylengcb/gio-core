import React from 'react';
import { keyBy } from 'lodash';
import CircularIcon from '@gio-core/components/circular-icon';
import Filter, { defaultFilter } from '@gio-core/types/Filter';
import FilterExpression, { defaultFilterExpression } from '@gio-core/types/FilterExpression';
import Dimension from '@gio-core/types/Dimension';
import Button from '@gio-design/components/lib/button';
import Icon from '@gio-design/icon';
import {
  Operator
} from '@gio-core/constants/operator';

interface FilterPanelProps {
  filter: Filter,
  propertyOptions: any[],
  isPropertyOptionsLoading?: boolean,
  valueOptions?: any[],
  expression?: any,
  maxLength?: number,
  addButtonText?: string,
  onChange: (filter: Filter) => void,
  [key: string]: any,
  operatorExclude?: Operator[],
  valueInclude?: any[],
  // 给某个key添加过滤，如果填写了，只有当key匹配时才会覆盖operatorExclude和valueInclude
  operatorExcludeItem?: {
    operator: Operator[]
    key: string
  },
  valueIncludeItem?: {
    values: any[]
    key: string
  },
  showSearchValueItem?: {
    showSearch: boolean,
    key: string
  }
};

const style: React.CSSProperties = {
  padding: '20px',
  margin: '0 auto',
  maxWidth: '590px',
  textAlign: 'left',
  backgroundColor: 'white',
  maxHeight: 400,
  overflow: 'auto'
};

export const arrayToMap = (dimensions: Dimension[]) => keyBy(dimensions, 'id');

const onExpressionChange = (
  expressions: FilterExpression[],
  index: number,
  filter: Filter,
  onChange: (filter: Filter) => void
) => (expression: FilterExpression) => {
  const exprs = [
    ...expressions.slice(0, index),
    expression,
    ...expressions.slice(index + 1)
  ];
  onChange({ ...filter, exprs });
}

const onExpressionRemove = (
  expressions: FilterExpression[],
  filter: Filter,
  onChange: (filter: Filter) => void
) => (index: number) => {
  const exprs = [
    ...expressions.slice(0, index),
    ...expressions.slice(index + 1)
  ];
  if (!exprs.length) {
    exprs.push(defaultFilterExpression);
  }
  onChange({ ...filter, exprs });
};

const onExpressionAdd = (
  expressions: FilterExpression[],
  filter: Filter,
  onChange: (filter: Filter) => void
) => (e: React.MouseEvent<HTMLElement>) =>
    onChange({ ...filter, exprs: [...expressions, defaultFilterExpression] });

const findUniqueType = (unique: string, expressions: FilterExpression[], propertyOptions: any[]) => {
  if (!unique || !propertyOptions) {
    return [];
  }
  const groupDimension = arrayToMap(propertyOptions);
  // 找到符合唯一的index
  const indexs = expressions.map((item: FilterExpression, index: number) => {
    if (!item.key) {
      return undefined;
    }
    if (!groupDimension[item.key]) {
      return undefined;
    }
    const { type } = groupDimension[item.key];
    if (unique.includes(type)) {
      return { index, type };
    }
  });
  return indexs.filter((item: any) => item !== undefined);
}

const filterPropertyOptions = (index: number, uniqueType: any[], propertyOptions: any) => {
  if (uniqueType.length === 0 || uniqueType.find((item: any) => item.index === index)) {
    return propertyOptions;
  }
  return propertyOptions.filter((option: any) => {
    return !uniqueType.some((item) => item.type === option.type)
  })
}

const FilterPanel = ({
  propertyOptions,
  isPropertyOptionsLoading = false,
  valueOptions,
  expression: Expression,
  filter = defaultFilter,
  filter: { exprs: expressions = [defaultFilterExpression] },
  onChange,
  maxLength = 5,
  addButtonText = '继续添加过滤条件',
  unique,
  placeholder,
  operatorExclude = [],
  valueInclude = [],
  valueExclude = [],
  operatorExcludeItem,
  valueIncludeItem,
  showSearchValueItem,
  ...props
}: FilterPanelProps): JSX.Element => {
  const uniqueType = findUniqueType(unique, expressions, propertyOptions);
  return (
    <div className='gio-filter-panel' style={style}>
      {
        expressions.map((expression: FilterExpression, index: number) => {
          let _operatorExcludeItem = operatorExclude;
          let _valueIncludeItem = valueInclude;
          let showSearch: boolean = true;
          if (operatorExcludeItem && new RegExp(operatorExcludeItem.key).test(expression.key)) {
            _operatorExcludeItem = operatorExcludeItem.operator;
          }
          if (valueIncludeItem && new RegExp(valueIncludeItem.key).test(expression.key)) {
            _valueIncludeItem = valueIncludeItem.values;
          }
          if (showSearchValueItem && new RegExp(showSearchValueItem.key).test(expression.key)) {
            showSearch = !!showSearchValueItem.showSearch
          }
          return (
            <Expression
              key={`gio-expression-${index}`}
              index={index}
              filter={filter}
              placeholder={placeholder}
              propertyOptions={filterPropertyOptions(index, uniqueType, propertyOptions) || []}
              isPropertyOptionsLoading={isPropertyOptionsLoading}
              expression={expression}
              onChange={onExpressionChange(expressions, index, filter, onChange)}
              onRemove={onExpressionRemove(expressions, filter, onChange)}
              extraAttrs={props}
              operatorExclude={_operatorExcludeItem}
              valueInclude={_valueIncludeItem}
              valueExclude={valueExclude}
              showSearch={showSearch}
            />
          );
        })
      }
      <Button
        disabled={expressions.length >= maxLength}
        tooltip={expressions.length >= maxLength && `最多只能添加${maxLength}条`}
        onClick={onExpressionAdd(expressions, filter, onChange)}
      >
        <Icon type='plus-circle' />
        {addButtonText}
      </Button>
    </div>
  );
}

export default FilterPanel;
