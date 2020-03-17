import React, { useRef } from 'react';
import List from '@gio-design/components/lib/list';
import Select from '@gio-design/components/lib/select';
import { format } from '@gio-core/utils/date';

interface ItemVariableSelectProps {
  onChange?: (value: string[]) => void;
  itemVariables?: any[];
  value?: string[];
}

const ItemVariableSelect: React.FC<ItemVariableSelectProps> = ({ itemVariables, value, onChange }) => {
  const rowKey = (record: any) => record.id;
  const tableDataSource = itemVariables && itemVariables.filter(({ id }) => value && value.includes(id));
  const ref = useRef(null)
  return (
    <div ref={ref} style={{position: 'relative'}}>
      <Select
        mode='multiple'
        placeholder='Please select'
        style={{ width: '100%' }}
        onChange={onChange}
        value={value}
        default={value}
        getPopupContainer={() => ref.current}
      >
        {itemVariables && itemVariables.map((item: any, index: number) => {
          return <Select.Option key={index} value={item.id}>{item.key}</Select.Option>;
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

export default ItemVariableSelect;

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