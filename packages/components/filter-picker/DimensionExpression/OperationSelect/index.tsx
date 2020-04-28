import React from 'react';
import Select from '@gio-design/components/lib/select';
import { OperationSelects, IntOperationSelects, DateOperationSelects, StringOperationSelections } from './config';
import './index.less';

const Option = Select.Option;

export const selectStyle = {
  width: '120px',
  border: '1px solid #DCDFED',
  borderRadius: '4px',
  boxSizing: 'border-box',
  height: '40px'
}

interface Props {
  value: string;
  valueType: string;
  onChange: any;
  getPopupContainer: any;
  key: any;
  type: any
  [key: string]: any
}


const OperationSelect = (props: Props) => {
  const {
    value,
    valueType,
    onChange,
    getPopupContainer,
    key,
    type
  } = props;

  const renderOptions = (options: any) => (
    <Select
      key={key}
      style={selectStyle}
      value={value}
      onSelect={onChange}
      dropdownMatchSelectWidth={false}
      getPopupContainer={getPopupContainer}
      type='ghost'
    >
      {options.map((e: any) => {
        return (
          <Option key={e.key} value={e.key}>{e.name}</Option>
        )
      })
      }
    </Select>
  )
  switch (type) {
    case 'usr':
      if (valueType === 'int' || valueType === 'double') {
        return renderOptions(IntOperationSelects)
      }
      if (valueType === 'date') {
        return renderOptions(DateOperationSelects)
      }
      return renderOptions(StringOperationSelections)
    default:
      return renderOptions(StringOperationSelections)
  }
}

export default OperationSelect;
