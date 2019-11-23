import React from 'react';
import Select from '@gio-design/components/lib/select';
import difference from 'lodash/difference';
import { Operator, dimensionOP } from '@gio-core/constants/operator';

import './style.less';

interface OperatorSelectProps {
  value: string,
  onChange: (operator: string) => any,
  oprators?: any[],
  operatorExclude?: Operator[],
  allowLike?: boolean,
  [key: string]: any
}

const onOperatorSelectChange = (onChange: (operator: string) => any) =>
  (operator: string) => onChange(operator);

const renderOptions = (options: any[], allowLike) =>
  options.map((option: Operator): any => (
    <Select.Option
      key={option.value}
      value={option.value}
      disabled={!allowLike && /like/.test(option.value)}
    >
      {window.locale === 'zh' ? option.zh : option.en}
    </Select.Option>
  ));

const OperatorSelect = ({
  value,
  onChange,
  operators = dimensionOP,
  operatorExclude = [],
  allowLike = true,
  ...props
}: OperatorSelectProps): JSX.Element => (
  <Select
    className='gio-operator-select'
    type='ghost'
    value={value}
    onChange={onOperatorSelectChange(onChange)}
    optionLabelProp='value'
    showArrow={false}
    dropdownMatchSelectWidth={false}
    style={{ width: '64px'}}
    dropdownStyle={{ width: '200px' }}
    {...props}
  >
    <Select.OptGroup label='选择操作符'>
      {renderOptions(difference(operators, operatorExclude), allowLike)}
    </Select.OptGroup>
  </Select>
);

export default OperatorSelect;
