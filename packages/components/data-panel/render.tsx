import React, { useState, useEffect } from 'react';
import Button from '@gio-design/components/lib/button';
import Input from '@gio-design/components/lib/input';
import Chart from 'giochart';
import { setRequsetHost } from 'giochart';
import { format } from '@gio-core/utils/date';
import Form, { FormComponentProps } from 'antd/lib/form';
import { isEqual } from 'lodash';
import EventVariablesSelect from '@gio-core/components/eventvariable-select';

setRequsetHost('chartdata', '/chartdata');

export type dataTypes = keyof typeof fieldsMap
export interface DataPanelFormProps {
  form: any;
  data: any
  dataType: dataTypes
  extraData: any
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const DataPanelForm: React.FC<DataPanelFormProps> = ({ data, dataType, extraData, form }) => {
  const formFields = renderFormFields(data, dataType, form, extraData);
  return (
    <Form
      className='gio-core-data-panel'
      layout='horizontal'
      {...formItemLayout}
    >
      <div className='header'>
        {
          false && (
            <Button size='small'>创建事件分析</Button>
          )
        }
      </div>
      {formFields}
    </Form>
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

const renderFormFields = (data: any, dataType: dataTypes, form: any, extraData: any) => {
  const { getFieldDecorator, getFieldValue } = form
  return fieldsMap[dataType] && fieldsMap[dataType].map((key: string) => {
    switch (key) {
      case 'attributes':
        return renderAttributes(data, dataType, key, form, extraData);
      case 'chart':
        return renderChart(data, dataType)
      case 'platforms':
      case 'example':
      // case 'description':
      case 'valueType':
        return (
          <Form.Item label={keyMap[key]}>
            {getFieldDecorator(key, {
              initialValue: data[key]
            })(
              <div>{renderValue(data[key], key)}</div>
            )}
          </Form.Item>
        )
      case 'name':
        return (
          <Form.Item label='名称'>
            {getFieldDecorator(key, {
              initialValue: data[key],
              rules: [{
                required: true,
                message: '名称不能为空',
              }, {
                max: 30,
                message: '名称最长为30字符',
              }],
            })(
              <Input placeholder='请输入名称' />
            )}
          </Form.Item>
        )
      default:
        return (
          <Form.Item label={keyMap[key]}>
            {getFieldDecorator(key, {
              initialValue: data[key]
            })(
              <Input disabled={readOnlyFields.includes(key)} />
            )}
          </Form.Item>
        )
    }
  });
}

const valueTypeMap = {
  string: '字符串',
  int: '整数',
  double: '小数'
}

const renderValue = (value: keyof typeof valueTypeMap, key: string) => {
  switch (key) {
    case 'valueType':
      return valueTypeMap[value];
    case 'createdAt':
    case 'updatedAt':
      return format(new Date(value));
  }
  return value;
}

const renderChart = (data: any, dataType: string) => {
  const gql = generateGQL(data);
  return (
    <FormField key='form-field-chart' field={'chart'}>
      <React.Fragment>
        <Form.Item label='统计趋势'></Form.Item>
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

const renderAttributes = (data: any, dataType: string, key: keyof typeof keyMap, form: any, extraData: any) => {
  const rowKey = (record: any) => record.id;
  const eventVariables = extraData.eventVariables
  const { getFieldDecorator } = form
  return (
    <div className={`form-field-${key}`}>
      <React.Fragment>
        <Form.Item label={keyMap[key]}  labelCol={{ xs: { span: 8 }, sm: { span: 6 }}}>
          {getFieldDecorator(key, {
              initialValue: (data[key] || []).map((item: any) => item.id)
            })(
              <EventVariablesSelect eventVariables={eventVariables} />
            )}
        </Form.Item>
      </React.Fragment>
    </div>
  )
}

const fieldsMap = {
  custom: [
    'name',
    'description',
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
  key: '标识符',
  description: '描述',
  creatorName: '创建者',
  createdAt: '创建时间',
  updatedAt: '更新时间',
  platforms: '平台',
  example: '示例',
  valueType: '类型',
  attributes: '关联事件级变量',
  chart: '统计趋势'
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

export interface FormProps extends FormComponentProps{
  onValuesChange: (changed: boolean, values: any) => void;
  data: any
  dataType: dataTypes
  extraData: any
}


const Render = Form.create({
  onValuesChange: (props: FormProps, values: any) => {

    if (props.onValuesChange) {
      const changed = Object.keys(values).some((key: string) => !isEqual(props.data[key], values[key]));
      props.onValuesChange(changed, values)
    }
  }
})(DataPanelForm);

export default Render;
