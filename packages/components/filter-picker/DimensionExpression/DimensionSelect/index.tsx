import React from 'react';
import Icon from '@gio-design/icon';
import PropertySelect from '@gio-core/components/property-select';
import Dimension from '@gio-core/types/Dimension';

import './style.less';

interface Props {
  className?: string,
  value: string,
  dimensions: Dimension[],
  isLoading?: boolean,
  onChange: (property: string) => void,
  getPopupContainer?: () => HTMLElement,
  placeholder?: string,
  disabled?: boolean,
  style?: {
    [key: string]: number | string
  }
}

const defaultStyle = {
  width: '195px',
  placeholder: '选择维度',
  disabled: false,
}

const DimensionSelect = ({
  className = '',
  value,
  dimensions,
  isLoading = false,
  onChange,
  getPopupContainer,
  placeholder,
  style,
  disabled = false,
}: Props) => (
  <PropertySelect
    key='dimension-select'
    className={`dimension-select ${className}`}
    dropdownClassName='dimension-select-dropdown'
    grouped={true}
    value={!value || dimensions.some((d: any) => d.id === value) ? value : '无效维度'}
    options={dimensions}
    showSearch={true}
    onChange={onChange}
    dropdownMatchSelectWidth={false}
    style={style ? style : defaultStyle}
    dropdownStyle={{ width: '360px' }}
    placeholder={placeholder || '选择维度'}
    getGroupIcon={getGroupIcon}
    getPopupContainer={getPopupContainer}
    notFoundContent={isLoading ? '正在加载……' : '没有可用维度'}
    disabled={disabled}
  />
);

export const getGroupIcon = (group: string) => (
  <span className='group-icon'>
    {/* <Icon name={`gicon-${group}`} /> */}
    <Icon type='tag-2' />
  </span>
);

export default DimensionSelect;
