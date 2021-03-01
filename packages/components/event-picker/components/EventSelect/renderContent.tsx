import React, { useState } from 'react';
import { get } from 'lodash';
// import Button from '@gio-design-old/components/lib/button';
import Icon from '@gio-design/icon';
import Spin from '@gio-design-old/components/lib/spin';
import Label from '@gio-core/components/label';
import Popover from '@gio-design-old/components/lib/popover';
import { Props as SelectCoreProps } from '../../../picker/components/SelectCore';
import FilterTab from '../FilterTab';
import FilterSelect from '../FilterSelect';
import EventPreview from '../../containers/previewContainer';
import DataFilter, { FilterValues } from '../../../data-filter';
// import { Header, Toolbar } from '../../../picker/components/index.styled';
import {
  defaultFilters,
  tabs,
  types as defaultTypes,
  platforms as defaultPlatforms,
} from './constants';
import List from '../List';
import { groupData } from '../../helper';
import StepPreview from '../StepsPreview';
// import Input from '@gio-design-old/components/lib/input';
import classnames from 'classnames';
import { SearchBar, Input, Button } from '@gio-design/components';
import { RefreshOutlined } from '@gio-design/icons'
import '@gio-design/components/es/components/search-bar/style/index.less';
//const SearchInput = require('components/utils/SearchInput').default;

type handleValueChangeType = (value: { [key: string]: any }) => void;

const predicate = (filterValues: FilterValues, item: any) => {
  return defaultFilters.scope.match(item, 'scope', filterValues.scope)
    && defaultFilters.platform.match(item, 'platform', filterValues.platform)
    && defaultFilters.type.match(item, 'type', filterValues.type)
    && (!filterValues.keyword || defaultFilters.keyword.match(item, 'keyword', filterValues.keyword))
}

interface Props {
  data: any[],
  groups: string[],
  refresh: () => void,
  isLoading?: boolean
}

const filterData = (data: any[], exclusiveTypes: string[], dataFilter?: (data: any) => boolean) => {
  return data.filter((d: any) => {
    return (dataFilter ? dataFilter(d) : true) && !exclusiveTypes.some((t: string) => {
      return [d.type, d.valueType].includes(t) || (d.type === 'custom' && d.aggregator === t) || d.action === t;
    });
  })
}

const mouseLeaveHandler = (setPreviewVisibility, e) => {
  if (e.target.querySelector('.ant-modal-mask') || e.target.toString() === '[object HTMLButtonElement]') {
    if (e.target.querySelector('.ant-modal-mask.ant-modal-mask-hidden')) {
      setPreviewVisibility(false);
    }
    return;
  }
  setPreviewVisibility(false);
}

const mouseEnterHandler = (setPreviewVisibility) => {
  setPreviewVisibility(true)
}

const handleRefetch = (refetch: () => void) =>
  (e: React.MouseEvent<HTMLButtonElement>) => refetch()

const renderContent = ({
  refContainer,
  isLoading,
  needEventPreview,
  needStepPreview,
  stepPreviewProps = {},
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
            className='event-select-overlay'
            onMouseLeave={mouseLeaveHandler.bind({}, setPreviewVisibility)}
            onMouseEnter={mouseEnterHandler.bind({}, setPreviewVisibility)}
            onClick={() => { setFilterVisibility(false) }}
          >
            <div className='event-select-header'>
              <div className='event-select-header__searchbar'>
                <SearchBar
                  placeholder={'搜索事件或指标的名称'}
                  value={keyword}
                  onChange={handleSearch}
                  showClear={true}
                  size="large"
                />
              </div>
              <Button
                icon={<RefreshOutlined />}
                type='secondary'
                className='btn-refresh'
                onClick={handleRefetch(refresh)}
              />
              <span ref={refContainer} onClick={(e) => { e.stopPropagation() }} style={{ display: 'inline-block' }}>
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
                'event-select-toolbar',
                { 'tab-invisible': !useTab }
              )}>
                <FilterTab
                  tabs={tabs}
                  onChange={handleScopeChange(setScope)}
                  defaultActivedTab={tabs[0].id}
                />
                {/* <span style={{ float: 'right' }} ref={refContainer} onClick={(e) => {e.stopPropagation()}}>
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
              </span> */}
              </div>
            </div>
            <div className='event-select-label-wrapper'>
              {renderFilterLabel(filterValues, 'type', types || defaultTypes, handleValueChange)}
              {renderFilterLabel(filterValues, 'platform', platforms || defaultPlatforms, handleValueChange)}
            </div>
            <div className="event-select-list-wrapper" onMouseEnter={() => { setFilterVisibility(false) }}>
              {isLoading && (
                <div className='event-select-loading-wrapper'>
                  <Spin />
                </div>
              )}
              <List
                value={value}
                max={max}
                options={options}
                disabledOptions={disabledOptions}
                isLoading={isLoading}
                isMultiple={isMultiple}
                onChange={onChange}
                onSelect={onSelect}
                setHoveringNode={handleNodeHover}
                getGroupCollapsed={(groupId: string) => (isLazyMode && groupIds.indexOf(groupId) === -1) || (!isLazyMode && groupIds.indexOf(groupId) > -1)}
                handleGroupChange={handleGroupChange}
                needEventPreview={needEventPreview} // 是否需要事件预览，如果是true的话，在列表中会出现跟随型事件预览的组件
              />
            </div>
            {/* 步骤预览，目前只在漏斗模块中出现，是固定在eventPicker右侧的组件 */}
            {
              needStepPreview &&
              <StepPreview
                steps={Array.isArray(value) ? value : [value]}
                removeStep={stepPreviewProps.removeStep}
                confirmDisabled={value.length < 2}
                max={max}
                onCancel={stepPreviewProps.onStepsPreviewCancel}
                onConfirm={stepPreviewProps.onStepsPreviewConfirm}
                handleStepsChange={stepPreviewProps.handleStepsChange}
                totalConversionRate={stepPreviewProps.totalConversionRate}
                isLoadingTotalConversionRate={stepPreviewProps.isLoadingTotalConversionRate}
                stepSelectVisible={stepPreviewProps.stepSelectVisible}
                timeRange={stepPreviewProps.timeRange}
              />
            }
            {/* 固定型的事件预览，如果存在步骤预览就不会出现，取而代之的是跟随型事件预览 */}
            {
              !needStepPreview &&
              previewVisibility &&
              (
                !disabledPreviewOptions ||
                !(disabledPreviewOptions.includes(hoveringNode && hoveringNode.id))
              ) &&
              <EventPreview chartSourceType={'chartdata'} target={{ ...hoveringNode, fromEventPicker: true }} labels={labels} delay={750} />
            }
          </div>
        );
      }}
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

export default renderContent;
