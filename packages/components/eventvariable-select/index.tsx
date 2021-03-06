import React, { useRef } from 'react';
import List from '@gio-design-old/components/lib/list';
import Select from '@gio-design-old/components/lib/select';
import { format } from '@gio-core/utils/date';

interface EventVariablesSelectProps {
  onChange?: (value: string[]) => void;
  eventVariables?: any[];
  value?: string[];
  placeholder?: string;
  disabled?: boolean;
}

const EventVariablesSelect: React.FC<EventVariablesSelectProps> = ({ placeholder = '请选择事件属性', eventVariables, value, onChange, disabled = false }) => {
  const rowKey = (record: any) => record.id;
  const tableDataSource = eventVariables && eventVariables.filter(({ id }) => value && value.includes(id));
  const ref = useRef(null)
  return (
    <div ref={ref} style={{position: 'relative'}}>
      <Select
        mode='multiple'
        placeholder={placeholder}
        style={{ width: '100%' }}
        onChange={onChange}
        value={value}
        default={value}
        getPopupContainer={() => ref.current}
        disabled={disabled}
      >
        {eventVariables && eventVariables.map((item: any, index: number) => {
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

export default EventVariablesSelect

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