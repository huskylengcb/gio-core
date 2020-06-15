import React from 'react';
import classnames from 'classnames';
import SelectCore from '../../../picker/components/SelectCore';
import Icon from '@gio-design/icon';
import Metric from '@gio-core/types/Metric';
import { getEventTypeLabel, generateSelectKey } from '../../helper';
import { iconMap, iconStyle } from './constants';
import Popover from 'antd/lib/popover';
import EventPreview from '../../containers/previewContainer';

import './style.less';

const List = ({
  max,
  value,
  options,
  disabledOptions,
  isLoading,
  isMultiple,
  onChange,
  onSelect,
  setHoveringNode,
  getGroupCollapsed,
  handleGroupChange,
  needEventPreview, // 是否需要事件预览，如果是true的话，在列表中会出现跟随型事件预览的组件
}) => {
  return (
    <SelectCore
      max={max}
      value={getValue(value)}
      valueKey='selectKey'
      renderKey='renderKey'
      onChange={onChange}
      options={options}
      disabledOptions={disabledOptions}
      isMultiple={isMultiple}
      allowDuplicate={true}
      width={370}
      height={400}
      showSearch={false}
      labelRenderer={renderLabel(handleGroupChange, setHoveringNode, getGroupCollapsed, needEventPreview)}
      onSelect={onSelect}
      emptyPlaceholder={isLoading ? '' : undefined}
    />
  );
};

const getValue = (value: Metric | Metric[]) =>
  Array.isArray(value) ? value.map((v: Metric) =>
    generateSelectKey(v)
  ) : generateSelectKey(value)

const renderLabel = (
  handleGroupChange: any,
  setHoveringNode: any,
  getGroupCollapsed: any,
  needEventPreview: boolean,
) => (option: any, isGroup?: string) => {
  if (isGroup) {
    const collapsed = getGroupCollapsed(option.id);
    switch(isGroup) {
      case 'group':
        return (
          <div
            onClick={handleClick(handleGroupChange)(option.id)}
            className={classnames('gio-event-picker-group-option', { collapsed })}
            onMouseEnter={() => { setHoveringNode(null); }}
          >
            <Icon
              type='tag'
              className='icon-group-option'
              svgStyle={iconStyle}
            />
            {option.name} {/*!isNaN(option.count) && `(${option.count})`*/}
            <Icon type='down' />
          </div>
        )
      case 'fold':
        return (
          <div
            onClick={handleClick(handleGroupChange)(option.id)}
          >
            {option.name} 
          </div>
        )
    }
  }

  const prefix = getEventTypeLabel(option);

  if (needEventPreview && !(option.type === 'prepared' && /^retentionuv$|^uv_[a-zA-Z]+$/.test(option.id) && /^任意行为/.test(option.name))) {
    return (
      <Popover
        content={<EventPreview target={option} style={{ position: 'static', height: '487px', boxShadow: 'none', padding: '0px 8px 32px 8px' }} />}
        placement='right'
        mouseEnterDelay={0.75}
      >
        <div
          className='gio-event-picker-option'
          title={option.name}
          onMouseEnter={() => { setHoveringNode(option); }}
        >
          {[prefix, option.name].filter((v: string) => v).join(' | ')}
        </div>
      </Popover>
    )
  }

  return (
    <div
      className='gio-event-picker-option'
      title={option.name}
      onMouseEnter={() => { setHoveringNode(option); }}
    >
      {[prefix, option.name].filter((v: string) => v).join(' | ')}
    </div>
  )
}

const handleClick = (handleGroupChange: any) =>
  (groupId: string) => () =>{
    handleGroupChange(groupId);
  }

export default List;
