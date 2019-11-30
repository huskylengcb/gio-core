import React, { useRef, useState } from 'react';
import Picker from '../picker';

import { getGroupIcon } from '../filter-picker/DimensionExpression/DimensionSelect';
import Metric from '@gio-core/types/Metric';

export interface Props {
  value: any,
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  getPopupContainer?: () => HTMLElement
  onChange?: (value: any) => void,
  onSelect?: (value: any, selectedValue: any, option: any) => void,
  useDimensions: any;
  useTags: any;
  placement?: string;
  limit?: number,
  showCheckAllBox?: boolean,
  timeRange?: string,
  targetUsers?: string[],
  measurements?: Metric[],
  isMultiple?: boolean
}

const DimensionTagPicker: React.FC<Props> = ({
  value,
  useDimensions,
  useTags,
  onChange,
  onSelect,
  getPopupContainer,
  visible: visibleProp,
  onVisibleChange,
  children,
  placement = 'right',
  isMultiple,
  // tabKey
}) => {
  const { data: dimensionsData, loading1 } = useDimensions();
  const { data: tagsData, loading2 } = useTags();

  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const tabOptions = [
    {
      tabKey: 'attribute',
      name: '属性',
      placeholder: '搜索属性',
      options: dimensionsData,
    },
    {
      tabKey: 'tag',
      name: '标签',
      placeholder: '搜索标签',
      options: tagsData && tagsData.map((item) => {
        return {
          ...item,
          groupId: 'tag',
          groupName: "标签"
        }
      })
    }
  ]

  return (
    <Picker
      type='popover'
      value={value}
      mode='tab'
      tabKey={'attribute'}
      tabOptions={tabOptions}
      isMultiple={isMultiple}
      isLoading={loading1 || loading2 }
      onChange={onChange}
      onSelect={onSelect}
      getGroupIcon={getGroupIcon}
      getPopupContainer={getPopupContainer}
      visible={visibleProp || visible}
      ref={ref}
      onVisibleChange={handleVisibleChange(onVisibleChange || setVisible)}
      width={320}
      placement={placement}
    >
      {children}
    </Picker>
  );
}

const handleVisibleChange = (onVisibleChange: (visible: boolean) => void) =>
  (visible: boolean) =>
    onVisibleChange(visible);

export default DimensionTagPicker;
