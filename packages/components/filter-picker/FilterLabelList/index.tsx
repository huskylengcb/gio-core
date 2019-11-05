import React from 'react';
import Filter from '@gio-core/types/Filter';
import Expression from '@gio-core/types/FilterExpression';
import Label from '@gio-core/components/label';
import FilterDropdown from '@gio-core/components/filter-picker/FilterDropdown';
import { handleRemove } from '@gio-core/components/filter-picker/utils';
import { get } from 'lodash';
import Metric from '@gio-core/types/Metric';

import './style.less';

interface Props {
  title?: string,
  filter: Filter,
  propertyOptions?: any[],
  isPropertyOptionsLoading?: boolean,
  editable?: boolean,
  removable?: boolean,
  metrics?: Metric[],
  timeRange?: string,
  nowrap?: boolean,
  onChange?: (filter: Filter) => void,
  beforeDropdownOpen?: () => void,
  getPopupContainer?: () => HTMLElement
}

const FilterLabelList: (props: Props) => JSX.Element = ({
  title,
  filter,
  propertyOptions = [],
  isPropertyOptionsLoading = false,
  editable = false,
  removable = false,
  metrics,
  timeRange,
  nowrap = true,
  onChange,
  beforeDropdownOpen,
  getPopupContainer
}) => (
  <div
    className='gio-filter-label-list'
    style={{
      position: 'relative',
      display: 'inline-block',
      maxWidth: '100%'
    }}
  >
    {
      (get(filter, 'exprs', []) as Expression[]).map((expression: Expression, index: number) => {
        const label = (
          <Label removable={removable} onRemove={handleRemove(index, filter, onChange)} nowrap={nowrap}>
            {
              [
                expression.name,
                expression.op,
                expression.value.replace(/,/g, ', ')
              ].join(' ')
            }
          </Label>
        );
        return editable ? (
          <FilterDropdown
            title={title}
            filter={filter}
            propertyOptions={propertyOptions}
            isPropertyOptionsLoading={isPropertyOptionsLoading}
            onConfirm={onChange}
            metrics={metrics}
            timeRange={timeRange}
            beforeOpen={beforeDropdownOpen}
            getPopupContainer={getPopupContainer}
          >
            <span className='gio-filter-dropdown-trigger'>
              {label}
            </span>
          </FilterDropdown>
        ) : label;
    })
    }
  </div>
);

export default FilterLabelList;
