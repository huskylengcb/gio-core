import React, { useRef } from 'react';
import List from '@gio-design/components/lib/list';
import Select from '@gio-design/components/lib/select';
import { format } from '@gio-core/utils/date';

interface EventVariablesSelectProps {
  onChange?: (value: string[]) => void;
  eventVariables?: any[];
  value?: string[];
}

const EventVariablesSelect: React.FC<EventVariablesSelectProps> = ({ eventVariables, value, onChange }) => {
  const rowKey = (record: any) => record.id;
  const tableDataSource = eventVariables && eventVariables.filter(({ id }) => value && value.includes(id));
  const ref = useRef(null)
  console.log(ref.current)
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
        {eventVariables && eventVariables.map((item: any, index: number) => {
          return <Select.Option key={index} value={item.id}>{item.key}</Select.Option>;
        })}
      </Select>
      <div>
        <List rowKey={rowKey} dataSource={tableDataSource} columns={AttrColumns} />
      </div>
    </div>
    );
};

export default EventVariablesSelect

const AttrColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 100, textWrap: 'word-break', ellipsis: true },
  { title: '标识符', dataIndex: 'key', key: 'key', width: 100 },
  { title: '类型', dataIndex: 'valueType', key: 'valueType', width: 100 },
  { title: '创建日期', dataIndex: 'createdAt', key: 'createdAt', width: 105, render: (value: string) => format(new Date(value), 'yyyy/MM/dd') },
];