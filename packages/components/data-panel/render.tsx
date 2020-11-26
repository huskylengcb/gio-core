import React, { useState, useEffect } from "react";
import Button from "@gio-design/components/lib/button";
import Input from "@gio-design/components/lib/input";
import { setRequestHost, GioChart } from "giochart";
import { format } from "@gio-core/utils/date";
import Form, { FormComponentProps } from "antd/lib/form";
import Badge from "antd/lib/badge";
import { isEqual } from "lodash";
import EventVariablesSelect, {
  valueTypeMap,
} from "@gio-core/components/eventvariable-select";
import ItemSelect from "@gio-core/components/item-select";
import Select from "@gio-design/components/lib/select";
import styled from "styled-components";

setRequestHost("chartdata", "/chartdata");

export type dataTypes = keyof typeof fieldsMap;
export interface DataPanelFormProps {
  form: any;
  data: any;
  dataType: dataTypes;
  extraData: any;
  extraRenders?: any;
  disabledOk?: boolean;
}

const PointWrapper = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #3867f4;
  color: #fff;
  text-align: center;
  display: inline-block;
  margin-right: 8px;
`;

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

const DataPanelForm: React.FC<DataPanelFormProps> = ({
  data,
  dataType,
  extraData,
  form,
  extraRenders,
  disabledOk,
}) => {
  const formFields = renderFormFields(
    data,
    dataType,
    form,
    extraData,
    extraRenders,
    disabledOk
  );
  return (
    <Form
      className="gio-core-data-panel"
      layout="horizontal"
      {...formItemLayout}
    >
      <div className="header">
        {false && <Button size="small">创建事件分析</Button>}
      </div>
      {formFields}
    </Form>
  );
};

const FormField: React.FC<{ field: string }> = (props) => (
  <div className={`form-field ${props.field}`}>{props.children}</div>
);

const readOnlyFields = [
  "platforms",
  "key",
  "creator",
  "createdAt",
  "updatedAt",
  "type",
  "updater",
  "docType",
];

const renderFormFields = (
  data: any,
  dataType: dataTypes,
  form: any,
  extraData: any,
  extraRenders?: any,
  disabledOk?: boolean
) => {
  const { getFieldDecorator, getFieldValue } = form;
  const { canEdit, fields = [] } = fieldsMap[dataType] || {};
  return (
    fields &&
    fields.map((key: string) => {
      // 分组元素
      if (key.startsWith("gap")) {
        return (
          <div>
            <PointWrapper>{key.slice(3)}</PointWrapper>
            {data[key]}
          </div>
        );
      }
      switch (key) {
        case "attributes":
          return renderAttributes(
            data,
            dataType,
            key,
            form,
            extraData,
            disabledOk
          );
        case "itemModels":
          return renderItemModelSelect(
            data,
            dataType,
            key,
            form,
            extraData,
            disabledOk
          );
        case "chart":
          return renderChart(data, dataType);
        case "platforms":
          return dataType === "elements" ? (
            <Form.Item label={keyMap[key]}>
              {getFieldDecorator(key, {
                initialValue: renderValue(data[key], key),
              })(<Input disabled={readOnlyFields.includes(key) || !canEdit} />)}
            </Form.Item>
          ) : (
              <Form.Item label={keyMap[key]}>
                {getFieldDecorator(key, {
                  initialValue: data[key],
                })(<div>{renderValue(data[key], key)}</div>)}
              </Form.Item>
            );
        case "example":
        // case 'description':
        // case 'instruction':
        case "valueType":
          return (
            <Form.Item label={keyMap[key]}>
              {getFieldDecorator(key, {
                initialValue: data[key],
              })(
                <Select style={{ width: 140, height: 40 }} disabled>
                  <Select.Option value="string">字符串</Select.Option>
                  <Select.Option value="int">整数</Select.Option>
                  <Select.Option value="double">小数</Select.Option>
                  <Select.Option value="date">日期</Select.Option>
                </Select>
              )}
            </Form.Item>
          );
        case "createdAt":
        case "updatedAt":
        case "updater":
        case "creator":
          return dataType === "elements" ? (
            <Form.Item label={keyMap[key]}>
              {getFieldDecorator(key, {
                initialValue: renderValue(data[key], key),
              })(<Input disabled={readOnlyFields.includes(key) || !canEdit} />)}
            </Form.Item>
          ) : (
              <Form.Item label={keyMap[key]}>
                {getFieldDecorator(key, {
                  initialValue: data[key],
                })(<div>{renderValue(data[key], key)}</div>)}
              </Form.Item>
            );

        case "description":
          return (
            <Form.Item label={keyMap[key]}>
              {getFieldDecorator(key, {
                initialValue: data[key],
                rules: [
                  {
                    max: 150,
                    message: "名称最长为150个字符",
                  },
                ],
              })(
                <Input
                  disabled={
                    readOnlyFields.includes(key) || !canEdit || disabledOk
                  }
                />
              )}
            </Form.Item>
          );
        case "name":
          return (
            <Form.Item label="名称">
              {getFieldDecorator(key, {
                initialValue: data[key],
                rules: [
                  {
                    required: true,
                    message: "名称不能为空",
                  },
                  {
                    max: 30,
                    message: "名称最长为30个字符",
                  },
                ],
              })(
                <Input
                  placeholder="请输入名称"
                  disabled={!canEdit || disabledOk}
                />
              )}
            </Form.Item>
          );
        case "others":
          return (
            <Form.Item label="其他">
              {extraRenders &&
                extraRenders.DetailListRender &&
                extraRenders.DetailListRender({ data, dataType, key, form })}
            </Form.Item>
          );
        case "logs":
          return (
            <Form.Item label="操作历史">
              {extraRenders &&
                extraRenders.LogsRender &&
                extraRenders.LogsRender({ data, dataType, key, form })}
            </Form.Item>
          );
        case "complexMetricCondition":
          return (
            <Form.Item label="计算公式">
              {extraRenders &&
                extraRenders.complexMetricCondition &&
                extraRenders.complexMetricCondition({
                  data,
                  dataType,
                  key,
                  form,
                })}
            </Form.Item>
          );
        case "tunnelDetail":
          return (
            extraRenders &&
            extraRenders.tunnelDetail &&
            extraRenders.tunnelDetail({ data, dataType, key, form })
          );
        case "itemModelPrimaryAttributeKey":
          return (
            extraRenders &&
            extraRenders.itemModelPrimaryAttributeKey &&
            extraRenders.itemModelPrimaryAttributeKey({
              data,
              dataType,
              key,
              form,
            })
          );
        case "elementRule":
          return (
            extraRenders &&
            extraRenders.elementRule &&
            extraRenders.elementRule({ data, dataType, key, form, extraData })
          );
        case 'userVariableCategory':
          return (
            extraRenders && extraRenders.userVariable && extraRenders.userVariable({ data, dataType, key, form })
          )
        default:
          return (
            <Form.Item label={keyMap[key]}>
              {getFieldDecorator(key, {
                initialValue: data[key],
              })(
                <Input
                  disabled={
                    readOnlyFields.includes(key) || !canEdit || disabledOk
                  }
                />
              )}
            </Form.Item>
          );
      }
    })
  );
};

const renderValue = (value: keyof typeof valueTypeMap, key: string) => {
  switch (key) {
    case "valueType":
      return valueTypeMap[value];
    case "createdAt":
    case "updatedAt":
      return format(new Date(value));
  }
  return value;
};

const renderChart = (data: any, dataType: dataTypes) => {
  const gql = generateGQL(data, dataType);
  return (
    <FormField key="form-field-chart" field={"chart"}>
      <React.Fragment>
        <Form.Item label="统计趋势"></Form.Item>
        <div className="chart-area">
          <GioChart width={380} height={250} padding={0} gql={gql} />
        </div>
      </React.Fragment>
    </FormField>
  );
};

const renderAttributes = (
  data: any,
  dataType: string,
  key: keyof typeof keyMap,
  form: any,
  extraData: any,
  disableOk: boolean
) => {
  const rowKey = (record: any) => record.id;
  const eventVariables = extraData.eventVariables;
  const { getFieldDecorator } = form;
  return (
    <div className={`form-field-${key}`}>
      <React.Fragment>
        <Form.Item
          label={keyMap[key]}
          labelCol={{ xs: { span: 8 }, sm: { span: 6 } }}
        >
          {getFieldDecorator(key, {
            initialValue: (data[key] || []).map((item: any) => item.id),
          })(
            <EventVariablesSelect
              eventVariables={eventVariables}
              disabled={disableOk}
            />
          )}
        </Form.Item>
      </React.Fragment>
    </div>
  );
};

const renderItemModelSelect = (
  data: any,
  dataType: string,
  key: keyof typeof keyMap,
  form: any,
  extraData: any,
  disabledOk: boolean
) => {
  const rowKey = (record: any) => record.id;
  const { getFieldDecorator } = form;
  return (
    <div className={`form-field-${key}`}>
      <React.Fragment>
        <Form.Item
          label={keyMap[key]}
          labelCol={{ xs: { span: 8 }, sm: { span: 6 } }}
        >
          {getFieldDecorator(key, {
            initialValue: (data[key] || []).map((item: any) => item.id),
          })(
            <ItemSelect
              itemModels={extraData.itemModels}
              usePrimaryItemVariable={extraData.usePrimaryItemVariable}
              disabled={disabledOk}
            />
          )}
        </Form.Item>
      </React.Fragment>
    </div>
  );
};

const fieldsMap = {
  custom: {
    canEdit: true,
    fields: [
      "name",
      "description",
      "key",
      "creator",
      "createdAt",
      "updatedAt",
      "chart",
      "attributes",
      "itemModels",
    ],
  },
  elements: {
    canEdit: true,
    fields: [
      "gap1",
      "name",
      "description",
      "platforms",
      "gap2",
      "elementRule",
      "gap3",
      "creator",
      "createdAt",
      "updater",
      "updatedAt",
    ],
  },
  preparedDimension: {
    canEdit: false,
    fields: ["name", "description", "platforms", "example"],
  },
  userVariable: {
    canEdit: true,
    fields: ["name", "key", "valueType", "userVariableCategory","description"],
  },
  itemVariable: {
    canEdit: true,
    fields: ["name", "key", "description"],
  },
  eventVariable: {
    canEdit: true,
    fields: ["name", "key", "description", "valueType"],
  },
  tunnel: {
    canEdit: true,
    fields: ["name", "description", "tunnelDetail"],
  },
  dataImport: {
    canEdit: false,
    fields: ["name", "jobPath", "others", "logs"],
  },
  complexMetric: {
    canEdit: false,
    fields: [
      "name",
      "description",
      "complexMetricCondition",
      "chart",
      // 'others',
      // 'logs'
    ],
  },
  itemModel: {
    canEdit: true,
    fields: ["name", "description", "itemModelPrimaryAttributeKey"],
  },
  preparedMetric: {
    canEdit: false,
    fields: ["name", "description", "instruction", "chart"],
  },
};

const keyMap = {
  name: "名称",
  key: "标识符",
  description: "描述",
  creator: "创建人",
  createdAt: "创建时间",
  updatedAt: "更新时间",
  platforms: "平台",
  example: "示例",
  valueType: "类型",
  attributes: "关联事件属性",
  itemModels: "关联物品属性（限一个）",
  chart: "统计趋势",
  jobPath: "任务目录地址",
  timeRange: "时间范围",
  others: "其他",
  instruction: "说明",
  updater: "更新人",
};

const generateGQL = (event: any, dataType: dataTypes) => {
  let type = "custom";
  if (dataType === "complexMetric") {
    type = "complex";
  } else if (dataType === "preparedMetric") {
    type = "prepared";
  }

  return {
    chartType: "line",
    attrs: {
      metricType: "none",
      subChartType: "seperate",
    },
    dimensions: ["tm"],
    filter: null,
    granularities: [
      {
        id: "tm",
        interval: 86400000,
        trend: true,
      },
    ],
    limit: 20,
    metrics: [
      {
        id: event.id,
        type,
        test: new Date().getTime(),
      },
    ],
    orders: null,
    timeRange: "day:8,1",
    targetUser: "uv",
    skip: 0,
    expandedTimeOnColumns: true,
  };
};

export interface FormProps extends FormComponentProps {
  onValuesChange: (changed: boolean, values: any) => void;
  data: any;
  dataType: dataTypes;
  extraData: any;
  extraRenders: any;
  disabledOk?: boolean;
}

const tempValue = {};

const Render = Form.create({
  onValuesChange: (props: FormProps, values: any) => {
    if (props.onValuesChange) {
      Object.keys(values).reduce((acc, key) => {
        acc[key] = values[key];
        return acc;
      }, tempValue);
      const changed = Object.keys(tempValue).some(
        (key: string) => !isEqual(props.data[key], tempValue[key])
      );
      props.onValuesChange(changed, values);
    }
  },
})(DataPanelForm);

export default Render;
