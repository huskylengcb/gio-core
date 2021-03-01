import React, { useRef } from 'react';
import List from '@gio-design-old/components/lib/list';
import Select from '@gio-design-old/components/lib/select';
import { format } from '@gio-core/utils/date';
import { noop } from 'lodash';

interface ItemSelectProps {
  onChange?: (value: string[]) => void;
  itemModels?: any[];
  value?: string;
  placeholder?: string
  selectedItemModel?: any
  usePrimaryItemVariable: (id: string) => { data: any, loading: boolean};
  disabled?: boolean;
}

const ItemSelect: React.FC<ItemSelectProps> = ({ onChange = noop, usePrimaryItemVariable = noop, placeholder = '请选择物品', itemModels, value = [], selectedItemModel, disabled = false }) => {
  const rowKey = (record: any) => record.id;
  const ref = useRef(null)
  const { data, loading} = usePrimaryItemVariable(value && value[0])
  const tableDataSource = data ? [data] : []
  const onSelectChange = (value: string) => onChange(value ? [value] : [])

  return (
    <div ref={ref} style={{position: 'relative'}}>
      <Select
        placeholder={placeholder}
        style={{ width: '100%' }}
        onChange={onSelectChange}
        value={value}
        default={value}
        getPopupContainer={() => ref.current}
        allowClear={true}
        disabled={disabled}
      >
        {itemModels && itemModels.map((item: any, index: number) => {
          return <Select.Option key={index} value={item.id}>{item.name}</Select.Option>;
        })}
      </Select>
      <div>
        {
          Array.isArray(tableDataSource) && tableDataSource.length > 0
            ? <List rowKey={rowKey} dataSource={tableDataSource} columns={AttrColumns} pagination={false} />
            : null
        }
      </div>
    </div>
    );
};

export default ItemSelect;

const AttrColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 100, textWrap: 'word-break', ellipsis: true },
  { title: '标识符', dataIndex: 'key', key: 'key', width: 100 },
  { title: '类型', dataIndex: 'valueType', key: 'valueType', width: 100, render: (text: keyof typeof valueTypeMap) => valueTypeMap[text]  },
  { title: '创建日期', dataIndex: 'createdAt', key: 'createdAt', width: 105, render: (value: string) => format(new Date(value), 'yyyy/MM/dd') },
];

export const valueTypeMap = {
  string: '字符串',
  int: '整数',
  double: '小数'
}
