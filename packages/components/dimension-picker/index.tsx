import React, { useRef, useState } from 'react';
import Picker from '../picker';
import ValuePicker, { Props as ValuePickerProps } from './components/ValuePicker';
import { getGroupIcon } from '../filter-picker/DimensionExpression/DimensionSelect';
import Metric from '@gio-core/types/Metric';

export interface Props {
  value: any,
  dimensionValue?: any,
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  getPopupContainer?: () => HTMLElement
  onChange: (value: any) => void,
  useDimensions: any;

  limit?: number,
  showCheckAllBox?: boolean,
  timeRange?: string,
  targetUsers?: string[],
  measurements?: Metric[],
  useDimensionValues: any;
  subPanelConfirm?: (value: string[]) => void
  subPanelCancel?: () => void
  subPanelFooter?: boolean
  onDimensionValueChange?: (dimensionValue: any) => void,
  onDimensionValueSelect?: (value: any, selectedValue: any) => void,
  onDimensionValueDeselect?: (value: any, selectedValue: any) => void,
}

const DimensionPicker: React.FC<Props & Partial<ValuePickerProps>> = ({
  value,
  useDimensions,
  onChange,
  getPopupContainer,
  visible: visibleProp,
  onVisibleChange,
  children,
  ...valuePickerProps
}) => {
  const { data, loading } = useDimensions();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  return (
    <Picker
      type='popover'
      value={value}
      options={data}
      isLoading={loading}
      subPanel={renderSubPanel({
        value,
        onVisibleChange: onVisibleChange || setVisible,
        ...valuePickerProps
      } as any)}
      onChange={onChange}
      getGroupIcon={getGroupIcon}
      getPopupContainer={getPopupContainer}
      visible={visibleProp || visible}
      ref={ref}
      onVisibleChange={handleVisibleChange(onVisibleChange || setVisible)}
      width={320}
    >
      {children}
    </Picker>
  );
}

const handleVisibleChange = (onVisibleChange: (visible: boolean) => void) =>
  (visible: boolean) =>
    onVisibleChange(visible);

const renderSubPanel: (props: any) => React.ReactNode = ({
  value,
  limit = 20,
  showCheckAllBox,
  timeRange,
  targetUsers,
  measurements,
  dimensionValue,
  useDimensionValues,
  subPanelConfirm,
  subPanelCancel,
  subPanelFooter,
  onDimensionValueChange,
  onDimensionValueSelect,
  onDimensionValueDeselect,
  onVisibleChange
}) => {
  return dimensionValue && value && (
    <ValuePicker
      dimension={value}
      value={[...dimensionValue]}
      max={limit}
      measurements={measurements}
      timeRange={timeRange}
      targetUsers={targetUsers}
      onChange={onDimensionValueChange}
      onSelect={onDimensionValueSelect}
      onDeselect={onDimensionValueDeselect}
      limit={limit}
      showCheckAllBox={showCheckAllBox}
      footer={subPanelFooter}
      onConfirmClick={handleSubVisibleChange(handleVisibleChange(onVisibleChange))(false, subPanelConfirm)}
      onCancelClick={handleSubVisibleChange(handleVisibleChange(onVisibleChange))(false, subPanelCancel)}
      useDimensionValues={useDimensionValues}
    />
  );
}

const handleSubVisibleChange = (onVisibleChange: (visible: boolean) => void) =>
  (visible: boolean, onChange: any) => {
    return (...args: any[]) => {
      onVisibleChange(visible)
      if (onChange) {
        onChange.apply(null, args)
      }
    }
  }

export default DimensionPicker;
