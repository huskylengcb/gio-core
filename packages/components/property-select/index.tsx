import React, { ReactNode } from 'react';
import { groupBy, get, noop } from 'lodash';
import Select from '@gio-design-old/components/lib/select';

type getGroupIconType = (groupKey: string) => JSX.Element;
interface PropertySelectProps {
  value: string,
  options: any[],
  grouped?: boolean,
  groupKey?: string,
  getGoupIcon?: getGroupIconType,
  onChange: (option: any) => void,
  [key: string]: any
};

const renderOptions = (options: any[]): ReactNode =>
  options.map((option: any) => (
    <Select.Option
      key={option.id}
      value={option.id}
    >
      {option.name}
    </Select.Option>
  )
  );

const renderGroupedOptions = (options: any[], groupKey = 'groupName', getGoupIcon: getGroupIconType): any => {
  const groupedOptions = groupBy(options, groupKey);
  return Object.keys(groupedOptions).map((groupName: string) => {
    const group = get(groupedOptions, `${groupName}[0].groupId`, null);
    const label = (
      <span>
        {group && getGoupIcon(group)}
        {groupName}
      </span>
    );
    return (
      <Select.OptGroup key={groupName} label={label}>
        {renderOptions(groupedOptions[groupName])}
      </Select.OptGroup>
    )
  })
};

const onPropertySelectChange = (onChange: (option: any) => void, valueTypeMap: any) =>
  (option: any) => {
    onChange({
      ...option,
      valueType: valueTypeMap[option.key]
    })
  }

const PropertySelect = ({
  value,
  options,
  onChange,
  grouped,
  groupKey,
  getGroupIcon = noop,
  ...props
}: PropertySelectProps): JSX.Element => {
  let valueTypeMap = {};
   options.map((opt: any) => valueTypeMap[opt.id] = opt.valueType)
  return (
    <Select
      labelInValue={true}
      value={value && { key: value }}
      onChange={onPropertySelectChange(onChange, valueTypeMap)}
      {...props}
    >
      {
        grouped && options.some((option: any) => !!option[groupKey || 'groupName'])
          ?
          renderGroupedOptions(options, groupKey, getGroupIcon)
          :
          renderOptions(options)
      }
    </Select>
  )
};

export default PropertySelect;
