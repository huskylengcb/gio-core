import React from 'react';
import Button from '@gio-design/components/lib/button';
import Input from '@gio-design/components/lib/input';

export type dataTypes = 'element' | 'complex' | 'custom'

const render = (data: any, dataType: dataTypes = 'element') => {
  if (!data) {
    return <div>Loading...</div>
  }
  const formFields = renderFormFields(data, dataType);
  return (
    <form className='gio-core-data-panel'>
      <div className='header'>
        {
          ['custom'].includes(dataType) && (
            <Button size='small'>创建事件分析</Button>
          )
        }
      </div>
      {formFields}
    </form>
  );
}

const renderFormFields = (data, dataType) => {
  return fieldsMap[dataType].map((key: string) => {
    switch (key) {
      case 'chart':
        return renderChart(data, dataType)
      case 'description':
        return (
          <div className={`form-row ${key}`}>
            <label>{keyMap[key]}</label>
            <div>{data[key]}</div>
          </div>
        )
      default:
        return (
          <div className='form-row'>
            <label>{keyMap[key]}</label>
            <Input value={data[key]} readOnly />
          </div>
        )
    }
  });
}

const renderChart = (data, dataType) => {
  return (
    <div>
      <label>统计趋势</label>
      <div className='chart'>
        Chart
      </div>
    </div>
  )
}

const fieldsMap = {
  custom: [
    'name',
    'key',
    'creatorName',
    'createdAt',
    'updatedAt',
    'chart',
  ],
  preparedDimension: [
    'name',
    'description',
    'chart',
  ],
  userVariable: [
    'name',
    'key',
    'description'
  ]
}

const keyMap = {
  name: '名称',
  key: '标示符',
  description: '描述',
  creatorName: '创建者',
  createdAt: '创建时间',
  updatedAt: '更新时间'
}

export default render;