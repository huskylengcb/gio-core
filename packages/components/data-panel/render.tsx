import React from 'react';
import Button from '@gio-design/components/lib/button';
import Chart from 'giochart';
import { setRequsetHost } from 'giochart';
import Input from '@gio-design/components/lib/input';
import { format } from '@gio-core/utils/date';
import List from '@gio-design/components/lib/list';


setRequsetHost('chartdata', '/chartdata');

export type dataTypes = 'element' | 'complex' | 'custom'

const render = (data: any, dataType: dataTypes) => {
  const formFields = renderFormFields(data, dataType);
  return (
    <form className='gio-core-data-panel'>
      <div className='header'>
        {
          [].includes(dataType) && (
            <Button size='small'>创建事件分析</Button>
          )
        }
      </div>
      {formFields}
    </form>
  );
}

const FormField: React.FC<{ field: string}> = (props) => (
  <div className={`form-field ${props.field}`}>
    {props.children}
  </div>
)

const readOnlyFields = [
  'key',
  'creatorName',
  'createdAt',
  'updatedAt'
]

const renderFormFields = (data, dataType) => {
  return fieldsMap[dataType].map((key: string) => {
    switch (key) {
      case 'attributes':
        return renderAttributes(data, dataType, key);
      case 'chart':
        return renderChart(data, dataType)
      case 'platforms':
      case 'example':
      case 'description':
      case 'valueType':
        return (
          <FormField key={`form-field-${key}`} field={key}>
            <React.Fragment>
              <label>{keyMap[key]}</label>
              <div>{renderValue(data[key], key)}</div>
            </React.Fragment>
          </FormField>
        )
      default:
        return (
          <FormField key={`form-field-${key}`} field={key}>
            <React.Fragment>
              <label>{keyMap[key]}</label>
              <Input value={renderValue(data[key], key)} readOnly={readOnlyFields.includes(key)} />
            </React.Fragment>
          </FormField>
        )
    }
  });
}

const valueTypeMap = {
  string: '字符串',
  int: '整数',
  double: '小数'
}

const renderValue = (value: any, key: string) => {
  switch (key) {
    case 'valueType':
      return valueTypeMap[value];
    case 'createdAt':
    case 'updatedAt':
      return format(new Date(value));
  }
  return value;
}

const renderChart = (data, dataType) => {
  const gql = generateGQL(data);
  return (
    <FormField key='form-field-chart' field={'chart'}>
      <React.Fragment>
        <label>统计趋势</label>
        <div className='chart-area'>
          <Chart
            width={380}
            height={250}
            padding={0}
            gql={gql}
          />
        </div>
      </React.Fragment>
    </FormField>
  )
}

const renderAttributes = (data: any, dataType: string, key: keyof typeof keyMap) => {
  const rowKey = (record: any) => record.id;

  return (
    <div className={`form-field-${key}`}>
      <React.Fragment>
        <div>
          <label>{keyMap[key]}</label>
        </div>
        <div>
          <List
            rowKey={rowKey}
            dataSource={data[key]}
            columns={AttrColumns}
          />
        </div>
      </React.Fragment>
    </div>
  )
}

const AttrColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 100, textWrap: 'word-break', ellipsis: true },
  { title: '标示符', dataIndex: 'key', key: 'key', width: 100 },
  { title: '类型', dataIndex: 'valueType', key: 'valueType', width: 100 },
  { title: '创建日期', dataIndex: 'associatedAt', key: 'associatedAt', width: 105, render: (value: string) => format(new Date(value), 'yyyy/MM/dd')},
]

const fieldsMap = {
  custom: [
    'name',
    'key',
    'creatorName',
    'createdAt',
    'updatedAt',
    'chart',
    'attributes',
  ],
  preparedDimension: [
    'name',
    'description',
    'platforms',
    'example',
  ],
  userVariable: [
    'name',
    'key',
    'description'
  ],
  eventVariable: [
    'name',
    'key',
    'description',
    'valueType'
  ]
}

const keyMap = {
  name: '名称',
  key: '标示符',
  description: '描述',
  creatorName: '创建者',
  createdAt: '创建时间',
  updatedAt: '更新时间',
  platofmrs: '平台',
  example: '示例',
  valueType: '类型',
  attributes: '关联事件级变量'
}

const generateGQL = (event: any) => {
  return {
    chartType: 'line',
    attrs: {
      metricType: 'none',
      subChartType: 'seperate'
    },
    dimensions: ['tm'],
    filter: null,
    granularities: [
      {
        id: 'tm',
        interval: 86400000,
        trend: true
      }
    ],
    limit: 20,
    metrics: [{
      id: event.id,
      type: 'custom'
    }],
    orders: null,
    timeRange: 'day:8,1',
    targetUser: 'uv',
    skip: 0,
    expandedTimeOnColumns: true
  }
}

export default render;