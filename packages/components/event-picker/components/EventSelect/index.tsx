import React, { useRef, useState, useEffect } from 'react';
import Picker from '../../../picker';
import useMount from 'react-use/lib/useMount';
import useUnmount from 'react-use/lib/useUnmount';
import cacheLatest from '@gio-core/utils/cacheLatest';
import { isEqual, find, uniqBy } from 'lodash';
import {
  useFetch,
  useSearch,
  useLabeledData,
  useGroups,
  useEventsDetail
} from '../../hooks';
import PreparedMetric from '@gio-core/types/Metrics/PreparedMetric';
import {
  convertToOption,
  omitOptionAttrs,
  setMetricAggregator,
  expandAttributeToMetric,
  aggregators
} from '../../helper';
import renderContent from './renderContent';
import { PropsType as PopoverPropsType } from '@gio-design/components/lib/popover';

import './style.less';

const platforms = [] || (window as any).productPlatforms.replace(/js/, 'web').split(',');

interface Props {
  value?: any,
  disabledOptions?: any[],
  disabledPreviewOptions?: any[],
  isMultiple?: boolean,
  isMetric?: boolean,
  defaultAggregator?: string,
  expandAttributes?: boolean,
  children?: any,
  max?: number,
  exclusiveTypes?: string[],
  showEventName?: boolean,
  dataFilter?: (event: any) => boolean,
  onSelect?: (selected: any, index: number, event: any) => void,
  onChange?: (event: any) => void,
  getPopupContainer?: () => HTMLElement,
  needStepPreview?: boolean, // 是否需要右侧固定的步骤预览组件，目前只在漏斗模块中需要
  stepPreviewProps?: any, // 步骤预览组件所需要的各种属性
  placement?: PopoverPropsType['placement']
}

const filterRecentEvents = cacheLatest((metrics: any[], preparedMetrics: PreparedMetric[], dataFilter: (any) => boolean, expandAttributes: boolean) => {
  if (!expandAttributes) {
    metrics = uniqBy(metrics, m => m.id)
  }
  return metrics.filter((metric) => {
    const filteredPreparedMetrics = preparedMetrics.map(m => ({
      type: 'prepared',
      ...m
    })).filter(dataFilter)
    if (metric.type === 'prepared') {
      return find(filteredPreparedMetrics, m => m.name === metric.name);
    }
    return true;
  }).map(m => {
    if (!m.aggregator || !expandAttributes) {
      return m;
    }
    const attr = m.attributes.find(a => a.id === m.attribute)
    const aggregator = aggregators.find(a => a.id === m.aggregator)
    return {
      ...m,
      name: m.name + ' | ' + attr.name + aggregator.name,
    }
  })
});

const EventSelect = ({
  value,
  disabledOptions,
  isMultiple,
  isMetric = true,
  defaultAggregator,
  expandAttributes,
  children,
  max,
  exclusiveTypes = [],
  showEventName,
  dataFilter = () => true,
  onSelect,
  onChange,
  getPopupContainer,
  needStepPreview,
  stepPreviewProps,
  disabledPreviewOptions,
  placement = 'leftTop',
}: Props) => {
  const refContainer = useRef(null);
  /*
  const {
    data: labels,
    isLoading: isLabelsLoading,
    fetch: fetchLabels
  } = useFetch(`/v3/projects/${window.project.id}/labels`);
  const {
    data: preparedMetrics,
    isLoading: isPreparedMetricsLoading
  } = useFetch(`/v3/projects/${window.project.id}/prepared-metrics`);
  */

  /*
  const {
    data: labeledData,
    dataCache: labeledDataCache,
    openedGroupIds,
    isLoading: isLabeledDataLoading,
    handleOpenedGroupChange,
    reset: resetLabeledData
  } = useLabeledData();
  */
  const recentKey = 'key' || `${window.currentUser.id}:${window.project.id}:recentEvents`;
  const initValue = localStorage.getItem(recentKey) || JSON.stringify([])

  const [recentEvents, setRecentEvents] = useState(JSON.parse(initValue));
  const onSetLocalStorage = (e) => {
    if (e.key === recentKey) {
      const newValue = JSON.parse(e.newValue)
      if (!isEqual(newValue, recentEvents)) {
        setRecentEvents(newValue)
      }
    }
  }

  useMount(() => {
    addEventListener('setLocalStorageEvent', onSetLocalStorage)
  });
  useUnmount(() => {
    removeEventListener('setLocalStorageEvent', onSetLocalStorage)
  })
  /*dev*/
  const [
    keyword,
    scope,
    preparedMetrics,
    searchResults,
    labels,
    openedGroupIds,
  ] = [ '', '', [], [], [], []];
  /*dev*/
  /*
  const {
    data: searchResults,
    keyword,
    isLoading: isSearchLoading,
    handleSearch,
    scope,
    setScope,
  } = useSearch(`/v3/projects/${window.project.id}/measurements`);

  const {
    groupIds: collapsedGroupIds,
    handleGroupIdsChange: handleCollapsedGroupChange,
    setGroupIds: setCollapsedGroupIds
  } = useGroups([]);
  */

  // const { data: mineData, isLoading: isMineDataLoading } = useFetch(`/v3/projects/${window.project.id}/measurements?t=mine`);
  // const { data: counters, isLoading: isCountersLoading } = useFetch(`/v3/projects/${window.project.id}/measurements/counters`);

  const isLoading = false && [
    isLabeledDataLoading,
    isSearchLoading,
    isLabelsLoading,
    isPreparedMetricsLoading,
    // isMineDataLoading,
    // isCountersLoading
  ].some((isLoading: boolean) => isLoading);

  let data;
  if (keyword || scope !== 'all') {
    data = expandAttributes ? expandAttributeToMetric(searchResults) : searchResults;
  } else {
    const newPreparedMetrics = preparedMetrics.filter((m: any) => {
      return !m.platforms
        || m.platforms.includes('all')
        || m.platforms.some((platform: string) => platforms.includes(platform.toLowerCase()));
    }).map((m: PreparedMetric) => (convertToOption({
      ...m, type: 'prepared', groups: ['prepared']
    }, showEventName)));
    const displayedRecentEvents = filterRecentEvents(recentEvents, newPreparedMetrics, dataFilter, expandAttributes).slice(0).reverse();
    data = [
      ...displayedRecentEvents,
      ...newPreparedMetrics,
      ...(expandAttributes ? expandAttributeToMetric(labeledData) : labeledData)
    ];
  }
  const [ hoveringNode, setHoveringNode ] = useState(null);
  const [ previewVisibility, setPreviewVisibility ] = useState(false);
  const [ filterVisibility, setFilterVisibility ] = useState(false);

  const handleSelect = (onSelect: (value: any, index: number, option: any) => void, isMetric?: boolean, defaultAggregator?: string) =>
  (value: any, index: number, option: any) => {
    let event = omitOptionAttrs(option);
    const inRecentEvents = recentEvents.find(e => {
      return e.selectKey === option.selectKey && (option.type === 'prepared' ? e.name === option.name : true);
    })
    if (!inRecentEvents) {
      let newRecentEvents = recentEvents.slice(Math.max(recentEvents.length - 4, 0))
      newRecentEvents = newRecentEvents.concat({
        ...option,
        groups: ['recentlyUsed']
      })
      setRecentEvents(newRecentEvents)
      localStorage.setItem(recentKey, JSON.stringify(newRecentEvents))
    }

    event = isMetric ? setMetricAggregator(event, defaultAggregator) : event;
    onSelect(value, index, event);
  }

  //const detailedRecentEvents = useEventsDetail(recentEvents);
  const detailedRecentEvents = [];

  const cacheKey = recentEvents.map(e => e ? e.renderKey : '').join('_');
  if (detailedRecentEvents.fetchStatus === 'succeed' && detailedRecentEvents.key === cacheKey && !isEqual(detailedRecentEvents.values, recentEvents)) {
    setRecentEvents(detailedRecentEvents.values);
    localStorage.setItem(recentKey, JSON.stringify(detailedRecentEvents.values));
  }
  return (
    <Picker
      value={value}
      options={[]}
      onChange={onChange}
      className={'gio-event-picker__overlay'}
      type='popover'
      placement={placement}
      isMultiple={isMultiple}
      getPopupContainer={getPopupContainer || (() => document.querySelector('body'))}
      width={370}
      visible={stepPreviewProps ? stepPreviewProps.stepSelectVisible : undefined}
      onVisibleChange={stepPreviewProps ? stepPreviewProps.handleStepSelectVisibleChange : undefined}
      render={renderContent({
        refContainer,
        isLoading,
        data: [
          { id: 'uv', name: '访问' },
          { id: 'test', name: '测试事件' }
        ],
        disabledOptions: disabledOptions ? disabledOptions.map((o: any) => convertToOption(o)).map((o: any) => o.selectKey) : undefined,
        exclusiveTypes,
        refresh: () => {
          fetchLabels();
          resetLabeledData();
        },
        groups: [
          { id: 'recentlyUsed', name: '最近使用'},
          { id: 'prepared', name: '预定义指标' },
          ...labels,
          { id: 'unknown', name: '未分类' }
        ],
        max,
        onSelect: handleSelect(onSelect, isMetric, defaultAggregator),
        isMultiple,
        keyword,
        openedGroupIds,
        counters: [],
        labeledDataCache: {},
        collapsedGroupIds: [],
        dataFilter,
        handleCollapsedGroupChange: () => void 0,
        setCollapsedGroupIds: () => void 0,
        handleSearch: () => void 0,
        handleOpenedGroupChange: () => void 0,
        scope,
        setScope: () => void 0,
        hoveringNode,
        handleNodeHover: setHoveringNode,
        labels,
        needStepPreview: false,
        stepPreviewProps,
        previewVisibility,
        setPreviewVisibility,
        filterVisibility,
        setFilterVisibility,
        disabledPreviewOptions
      })}
    >
      {children}
    </Picker>
  );
}

export default EventSelect;
