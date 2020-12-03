import React from 'react';
import Popover from '@gio-design/components/lib/popover';
import Icon from '@gio-design/icon';
import Checkbox from 'antd/lib/checkbox';
import Badge from 'antd/lib/badge';
import { Button } from '@gio-design-new/components';
import { Filter2Outlined } from '@gio-design/icons'
const constraintTypes = ['custom', 'merged', 'complex'];

import './style.less';

const handleFilterChange = (handleFilterValueChange: any, filter: string, selectedValues: string[]) =>
  // CheckBoxGroup 单选
  (value: string[]) => {
    // let v: string[];
    // if (!selectedValues.length) {
    //   v = value;
    // } else if (selectedValues.join('') === value.join('')) {
    //   v = [];
    // } else {
    //   v = value.filter((val: string) => val !== selectedValues.join(''))
    // }
    handleFilterValueChange(filter)(value)
  }

const render = ({
  filterValues,
  reset,
  handleFilterValueChange,
  getPopupContainer,
  filterVisibility,
  setFilterVisibility,
  types,
  platforms,
  disabledTypes = []
}: {
  filterValues: any,
  reset: (e: React.MouseEvent<HTMLSpanElement>) => void,
  handleFilterValueChange: (filter: string) => (value: { [key: string]: any }) => void,
  getPopupContainer: () => Element,
  filterVisibility?: boolean,
  setFilterVisibility?: (visible: boolean) => void,
  types: any[],
  platforms: any[],
  disabledTypes: string[]
}) => {
  const hasUsedEventTypeFilter = localStorage.getItem('hasUsedEventTypeFilter') === '1';
  const setUsedEventTypeFilter = () => { localStorage.setItem('hasUsedEventTypeFilter', '1'); }

  return (
    <Popover
      visible={filterVisibility}
      content={(
        <div className='filter-select-wrapper'>
          {/* <span
            className='btn-reset'
            onClick={reset}
          >
            重置
          </span> */}
          <div className='section'>
            {/* <span>类型</span> */}
            <div>
              <Checkbox.Group
                className='filter-select-checkbox'
                value={filterValues.type}
                options={types
                  .filter((tab: any) => {
                    if ((window as any).productPlatforms === 'minigame') {
                      return ['custom', 'merged', 'complex'].includes(tab.id)
                    }
                    return true;
                  })
                  .map(({ id: value, name: label }) => ({
                    value,
                    label,
                    disabled: ((constraintTypes.indexOf(value) > -1) && filterValues.platform.length) || disabledTypes.includes(value)
                  }))}
                onChange={handleFilterChange(handleFilterValueChange, 'type', filterValues.type)}
              />
            </div>
          </div>
          {
            platforms && !!platforms.length && (
              <div className='section'>
                <span>无埋点事件平台</span>
                <Checkbox.Group
                  value={filterValues.platform}
                  options={platforms.map(({ id: value, name: label }) => ({
                    value,
                    label,
                    disabled: constraintTypes.indexOf(filterValues.type[0]) > -1
                  }))}
                  onChange={handleFilterChange(handleFilterValueChange, 'platform')}
                />
              </div>
            )
          }
        </div>
      )}
      getPopupContainer={getPopupContainer}
    >
      <div
        className='filter-select-trigger'
        onClick={(e) => {
          if (!hasUsedEventTypeFilter) {
            setUsedEventTypeFilter();
          }
          setFilterVisibility(!filterVisibility);
          e.stopPropagation();
        }}>
        <Button
          icon={<Filter2Outlined />}
          type='secondary'
          className='btn-refresh'
        />

        {
          // hasUsedEventTypeFilter ? '筛选' :
          // <Badge
          //   dot
          //   style={{ height: 6, width: 6, right: -10 }}
          // >
          //   筛选
          // </Badge>
        }
      </div>
    </Popover>
  );
}

export default render;
