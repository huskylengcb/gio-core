import React from 'react';
import Expression from '../Expression';
import OperatorSelect from './OperationSelect';
import DimensionValueSelect from './DimensionValueSelect';
import DimensionSelect from './DimensionSelect';
import FilterExpression from '@gio-core/types/FilterExpression';
import Filter from '@gio-core/types/Filter';
import {
  Operator
} from '@gio-core/constants/operator';
import './index.less'
interface Props {
  index: number,
  filter: Filter,
  expression: FilterExpression
  property: string,
  propertyName: string,
  propertyOptions: any[],
  isPropertyOptionsLoading: boolean,
  onPropertySelectChange: (property: string) => void,
  operator: string,
  onOperatorSelectChange: (operator: string) => void,
  values: string[],
  ValueSelectMode: 'tags' | 'multiple',
  onValueSelectChange: (values: string[]) => void,
  onChange: (expression: FilterExpression) => void,
  getPopupContainer: () => HTMLElement,
  operatorExclude?: Operator[],
  valueInclude?: any[],
  valueExclude?: any[],
  showSearch?: boolean,
  dimensionsSearchPath?: string;
  [key: string]: any,
}

const render = ({
  index,
  filter,
  property,
  propertyName,
  propertyOptions,
  isPropertyOptionsLoading,
  onPropertySelectChange,
  operator,
  onOperatorSelectChange,
  values,
  valueSelectMode,
  onValueSelectChange,
  getPopupContainer,
  extraAttrs,
  placeholder,
  operatorExclude = [],
  valueInclude = [],
  valueExclude = [],
  showSearch = true,
  dimensionsSearchPath,
  type,
  valueType,
}: Props): JSX.Element[] => ([(
  <DimensionSelect
    key='gio-expression-dimension-select'
    value={property}
    placeholder={placeholder}
    dimensions={propertyOptions.filter((option: any) => {
      const inavailableOptions = filter.exprs ? filter.exprs.map((expr: any) => expr.key) : [];
      return option.id === property || inavailableOptions.indexOf(option.id) === -1 && !(/like/.test(operator) && option.id === 'cs1');
    })}
    isLoading={isPropertyOptionsLoading}
    onChange={onPropertySelectChange}
    getPopupContainer={getPopupContainer}
  />
), (
  <OperatorSelect
    key={'gio-expression-operator-select'}
    value={operator}
    onChange={onOperatorSelectChange}
    getPopupContainer={getPopupContainer}
    operatorExclude={operatorExclude}
    allowLike={property !== 'cs1'}
    type={type}
    valueType={valueType}
  />
), (
  <DimensionValueSelect
    key={'gio-expression-dimension-value-select'}
    dimension={property}
    dimensionName={propertyName}
    values={values}
    valueExclude={valueExclude}
    mode={valueSelectMode}
    onChange={onValueSelectChange}
    getPopupContainer={getPopupContainer}
    metrics={extraAttrs.metrics}
    timeRange={extraAttrs.timeRange}
    valueInclude={valueInclude}
    showSearch={showSearch}
    dimensionsSearchPath={dimensionsSearchPath}
    type={type}
    valueType={valueType}
    operator={operator}
  />
)]);

const DimensionExpression = (props: Props): JSX.Element => (
  <Expression {...props} render={render} />
);

export default DimensionExpression;
