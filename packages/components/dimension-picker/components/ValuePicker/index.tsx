import React, { useCallback, useState, useEffect } from 'react';
import SelectCore from '../../../picker/components/SelectCore';
import Metric from '@gio-core/types/Metric';
import Button from '@gio-design-old/components/lib/button';
import Gap from '@gio-design-old/components/lib/gap';

import './style.less';

export interface Props {
  dimension: string,
  value: any,
  max?: number,
  timeRange?: string,
  targetUsers?: string[],
  measurements?: Metric[],
  onSelect?: (value: any, selectedValue: any) => void,
  onDeselect?: (value: any, selectedValue: any) => void,
  onChange?: (value: any) => void
  limit?: number
  showCheckAllBox?: boolean
  onConfirmClick?: (options: string[]) => void
  onCancelClick?: () => void
  footer?: boolean
  useDimensionValues?: any
};

const ValuePicker = ({
  max = 10,
  showCheckAllBox = false,
  onChange,
  footer,
  ...props
}: Props) => {

  const [value, setValue] = useState(props.value)
  useEffect(() => setValue(props.value), [props.value])
  const handleChange = useCallback((value: any) => {
    if (footer) { setValue(value) }
    if (onChange) { onChange(value) }
  }, [onChange, footer])

  const onConfirmClick = useCallback(() => {
    if (props.onConfirmClick) { props.onConfirmClick(value) }
  }, [props.onConfirmClick, value])

  const onCancelClick = useCallback(() => {
    if (props.onCancelClick) { props.onCancelClick() }
  }, [])

  const [keyword, setKeyword] = useState('');
  const {
    data,
    loading
  } = props.useDimensionValues(props.dimension, { keyword });
  return (
    <div className='value-picker-wrapper'>
      <SelectCore
        isMultiple={true}
        value={value}
        valueKey={null}
        options={data}
        isLoading={loading}
        max={max}
        onSelect={props.onSelect}
        onDeselect={props.onDeselect}
        onChange={handleChange}
        onSearch={setKeyword}
        showCheckAllBox={showCheckAllBox}
        height={footer ? 400 : 450}
        width={282}
      />
      {
        footer && (
          <div className='value-picker-footer'>
            <Button onClick={onConfirmClick}>确定</Button>
            <Gap width={10} />
            <Button type='gray' onClick={onCancelClick}>取消</Button>
          </div>
        )
      }
    </div>
  );
}

export default ValuePicker;
