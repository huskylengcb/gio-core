import React, {useState} from 'react';
import { get } from 'lodash';
import Spin from '@gio-design-old/components/lib/spin';
import Label from '@gio-core/components/label';
import { Props as SelectCoreProps } from '../../../picker/components/SelectCore';
import FilterTab from '../FilterTab';
import FilterSelect from '../FilterSelect';
import EventPreview from '../../containers/previewContainer';
import DataFilter, { FilterValues } from '../../../data-filter';
import {
  defaultFilters,
  tabs,
  types as defaultTypes,
  platforms as defaultPlatforms,
} from '../EventSelect/constants';
import List from '../List';
import { groupData } from '../../helper';
import Input from '@gio-design-old/components/lib/input';
import classnames from 'classnames';
const SearchInput = Input.Search;

type handleValueChangeType = (value: { [key: string]: any }) => void;

const predicate = (filterValues: FilterValues, item: any) => {
  return defaultFilters.scope.match(item, 'scope', filterValues.scope)
    && defaultFilters.platform.match(item, 'platform', filterValues.platform)
    && defaultFilters.type.match(item, 'type', filterValues.type)
    && (!filterValues.keyword || defaultFilters.keyword.match(item, 'keyword', filterValues.keyword))
}


const filterData = (data: any[], exclusiveTypes: string[], dataFilter?: (data: any) => boolean) => {
  return data.filter((d: any) => {
    return (dataFilter ? dataFilter(d) : true ) && !exclusiveTypes.some((t: string) => {
      return [d.type, d.valueType].includes(t) || (d.type === 'custom' && d.aggregator === t) || d.action === t;
    });
  })
}

const mouseLeaveHandler = (setPreviewVisibility, e) => {
  setPreviewVisibility(false);
}

const mouseEnterHandler = (setPreviewVisibility) => {
  setPreviewVisibility(true)
}


const renderOceanContent = ({
  refContainer,
  isLoading,
  needEventPreview,
  max,
  data,
  disabledOptions,
  refresh,
  groups,
  exclusiveTypes,
  onSelect,
  isMultiple,
  keyword,
  openedGroupIds,
  collapsedGroupIds,
  labeledDataCache = {},
  dataFilter,
  handleOpenedGroupChange,
  handleCollapsedGroupChange,
  handleSearch,
  scope,
  setScope,
  counters,
  hoveringNode,
  handleNodeHover,
  labels,
  previewVisibility,
  setPreviewVisibility,
  filterVisibility,
  setFilterVisibility,
  disabledPreviewOptions,
  useGroup,
  useTab,
  types,
  platforms,
  disabledTypes
}: any) => ({ value, onChange }: Partial<SelectCoreProps>) => {
  const isLazyMode = false // !keyword
  const groupIds = isLazyMode ? openedGroupIds : collapsedGroupIds;
  const handleGroupChange = isLazyMode ? handleOpenedGroupChange : handleCollapsedGroupChange;

  return (
    <DataFilter
      data={filterData(data, exclusiveTypes, dataFilter)}
      filters={defaultFilters}
      predicate={predicate}
    >
      {({ data: filteredData, handleValueChange, filterValues }) => {
        const options = useGroup ? groupData(filteredData, groupIds, groups, counters, isLazyMode, labeledDataCache, filterValues.type.length || filterValues.platform.length, disabledOptions, keyword) : filteredData
        return (
        <div
          className='ocean-event-select-overlay'
          onMouseLeave={mouseLeaveHandler.bind({}, setPreviewVisibility)}
          onMouseEnter={mouseEnterHandler.bind({}, setPreviewVisibility)}
          onClick={() => {setFilterVisibility(false)}}
        >
          <div className='event-select-header'>
            <SearchInput
              placeholder={'??????????????????????????????'}
              onSearch={handleSearch}
              allowRedundant={true}
              quickMode={true}
              allowClear={true}
              className='ocean-search-input'
            />
            <span ref={refContainer} onClick={(e) => {e.stopPropagation()}} style={{display: 'inline-block'}}>
              <FilterSelect
                types={types || defaultTypes}
                platforms={platforms || defaultPlatforms}
                filterValues={filterValues}
                reset={resetFilter(handleValueChange)}
                handleFilterValueChange={handleFilterValueChange(handleValueChange)}
                getPopupContainer={() => refContainer.current}
                filterVisibility={filterVisibility}
                setFilterVisibility={setFilterVisibility}
                disabledTypes={disabledTypes}
              />
            </span>
            <div className={classnames(
              'ocean-event-select-toolbar',
              { 'tab-invisible': !useTab }
            )}>
              <FilterTab
                tabs={tabs}
                onChange={handleScopeChange(setScope)}
                defaultActivedTab={tabs[0].id}
              />
            </div>
          </div>
          <div className='ocean-event-select-label-wrapper'>
            {renderFilterLabel(filterValues, 'type', types || defaultTypes, handleValueChange)}
            {renderFilterLabel(filterValues, 'platform', platforms || defaultPlatforms, handleValueChange)}
          </div>
          <div onMouseEnter={() => { setFilterVisibility(false) }}>
            {isLoading && (
              <div className='ocean-event-select-loading-wrapper'>
                <Spin />
              </div>
            )}
            <List
              value={value}
              max={max}
              isOcean={true}
              options={options}
              disabledOptions={disabledOptions}
              isLoading={isLoading}
              isMultiple={isMultiple}
              onChange={onChange}
              onSelect={onSelect}
              setHoveringNode={handleNodeHover}
              getGroupCollapsed={(groupId: string) => (isLazyMode && groupIds.indexOf(groupId) === -1) || (!isLazyMode && groupIds.indexOf(groupId) > -1)}
              handleGroupChange={handleGroupChange}
              needEventPreview={needEventPreview}
            />
          </div>
          {
            previewVisibility &&
            (
              !disabledPreviewOptions ||
              !(disabledPreviewOptions.includes(hoveringNode && hoveringNode.id))
            ) &&
              <EventPreview chartSourceType={'olap'} target={{ ...hoveringNode, fromEventPicker: true }} labels={labels} delay={750}/>
          }
        </div>
      ); }}
    </DataFilter>
  );
}

const renderFilterLabel = (
  filterValues: any,
  filter: string,
  labels: any,
  handleValueChange: any
) => get(filterValues, filter, [] as any).map((label: any) => {
  const target = labels.find((t: any) => t.id === label);
  return (
    <Label
      key={label}
      type='dark'
      removable={true}
      onRemove={handleFilterRemove(handleValueChange, filterValues, filter, label)}
    >
      {get(target, 'name')}
    </Label>
  );
})

const handleFilterRemove = (
  handleValueChange: handleValueChangeType,
  filters: any,
  filter: string,
  id: string
) => () => {
  const value = filters[filter].filter((v: any) => v !== id);
  handleValueChange({ [filter]: value });
}

const handleScopeChange = (
  setScope: any
) => (scope: string) => setScope(scope);

const handleFilterValueChange = (
  handleValueChange: handleValueChangeType
) => (filter: string) =>
  (value: any) => handleValueChange({ [filter]: value });

const resetFilter = (handleValueChange: handleValueChangeType) => () => {
  handleValueChange({
    platform: [],
    type: []
  })
}

export default renderOceanContent;
