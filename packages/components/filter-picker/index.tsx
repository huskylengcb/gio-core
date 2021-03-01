import React from 'react';
import Icon from '@gio-design/icon';
import Button from '@gio-design-old/components/lib/button';
import DimensionProvider from '@gio-core/components/dimension-provider';
import FilterDropdown from './FilterDropdown';
import FilterLabelList from './FilterLabelList';
import CircularIcon from '@gio-core/components/circular-icon';
import Metric from '@gio-core/types/Metric';
import Filter from '@gio-core/types/Filter'
import { noop } from 'lodash';

interface Props {
  filter: Filter,
  onChange: (filter: Filter) => void,
  children?: JSX.Element,
  title?: string,
  type?: string,
  version?: string,
  metrics?: Metric[],
  targetUsers?: string[],
  timeRange?: string
};

const FilterPicker = ({
  filter,
  onChange,
  children,
  title,
  type,
  version,
  metrics,
  targetUsers,
  timeRange,
}: Props) => (
  <DimensionProvider
    type={type}
    version={version}
    metrics={metrics}
    targetUsers={targetUsers}
  >
      {({ dimensions, fetchDimensions }) => (
        <div>
          <div style={{ marginBottom: 10, display: !filter && 'none' }}>
            <FilterLabelList
              editable={true}
              removable={true}
              filter={filter}
              propertyOptions={dimensions}
              metrics={metrics}
              timeRange={timeRange}
              onChange={onChange}
              beforeDropdownOpen={fetchDimensions}
            />
          </div>
          <FilterDropdown
            filter={filter}
            propertyOptions={dimensions}
            metrics={metrics}
            timeRange={timeRange}
            onConfirm={onChange}
            beforeOpen={fetchDimensions}
          >
            {
              children || (
                <Button type='ghost' withoutBg={true}>
                  <span>
                    <CircularIcon>
                      <Icon type='plus' size='small' />
                    </CircularIcon>
                    添加过滤条件
                  </span>
                </Button>
              )
            }
          </FilterDropdown>
        </div>
      )}
  </DimensionProvider>
);

export default FilterPicker;
