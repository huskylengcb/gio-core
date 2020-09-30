import React, { useRef, useState, useEffect } from 'react';
import Picker from '../../../picker';
import useMount from 'react-use/lib/useMount';
import useUnmount from 'react-use/lib/useUnmount';
import cacheLatest from '@gio-core/utils/cacheLatest';
import { isEqual, find, uniqBy, noop } from 'lodash';
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
import { useGroups } from '../../hooks';

const platforms = [] || (window as any).productPlatforms.replace(/js/, 'web').split(',');

interface Props {
  value?: any,
  disabled: boolean;
  disabledOptions?: any[],
  disabledPreviewOptions?: any[],
  disabledTypes?: string[]
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
  needEventPreview?: boolean, //是否需要事件预览
  needStepPreview?: boolean, // 是否需要右侧固定的步骤预览组件，目前只在漏斗模块中需要
  stepPreviewProps?: any, // 步骤预览组件所需要的各种属性
  placement?: PopoverPropsType['placement']
  measurements?: any[];
  loading?: boolean;
  keyword?: string;
  handleKeywordChange?: (keyword: string) => void;
  useGroup?: boolean;
  useTab?: boolean;
  refetch?: () => void;
  type?: 'dropdown' | 'popover';
  types?: any[];
  platforms?: any[];
  getElement?: any;
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
  disabled,
  disabledOptions,
  isMultiple,
  isMetric = false,
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
  needEventPreview,
  needStepPreview,
  stepPreviewProps,
  disabledPreviewOptions,
  placement = 'leftTop',
  measurements,
  loading,
  keyword,
  handleKeywordChange,
  // useGroup = false,
  useGroup = true,
  useTab = true,
  refetch,
  types,
  type,
  platforms,
  disabledTypes = [],
  getElement
}: Props) => {
  const refContainer = useRef(null);
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

  const {
    groupIds: collapsedGroupIds,
    handleGroupIdsChange: handleCollapsedGroupChange,
    setGroupIds: setCollapsedGroupIds
  } = useGroups([]);

  /*
  * 异步获取
  * const {
  *   data: labeledData,
  *   dataCache: labeledDataCache,
  *   openedGroupIds,
  *   isLoading: isLabeledDataLoading,
  *   handleOpenedGroupChange,
  *   reset: resetLabeledData
  * } = useLabeledData();
  *
  * */

  /*dev*/
  const [
    preparedMetrics,
    searchResults,
    labels,
    openedGroupIds,
  ] = ['', [], [], ['prepared', 'recentlyUsed', 'unknown']];
  const [scope, setScope] = useState('all');

  let data = isMetric ? expandAttributeToMetric(measurements as any) : measurements;
  disabledOptions = (disabledOptions || []).concat(data.filter((m) => disabledTypes.includes(m.aggregator || m.type) || (disabledTypes.includes('isComplexDistinct') && m.isComplexDistinct)))

  /*
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
  */
  const [ hoveringNode, setHoveringNode ] = useState(null);
  const [ previewVisibility, setPreviewVisibility ] = useState(false);
  const [ filterVisibility, setFilterVisibility ] = useState(false);

  const handleSelect = (onSelect: (value: any, index: number, option: any) => void, isMetric?: boolean, defaultAggregator?: string) =>
  (value: any, index: number, option: any) => {
    let event = omitOptionAttrs(option);
    if(event.type === 'element') {
      event.type = 'simple'
    }
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


  const handleNodeHover = (option) => {
    if (option && (option.type === 'simple' || option.type === 'element')) {
      if(!!getElement){
        getElement(option).then(res => {
          setHoveringNode({...res.data.element, type: 'element'})
        })
      } else {
        setHoveringNode(option)
      }
    } else {
      setHoveringNode(option)
    }
  }
  return (
    <Picker
      value={value}
      disabled={disabled}
      type={type}
      options={[]}
      onChange={onChange}
      className={'gio-event-picker__overlay_76'}
      placement={placement}
      isMultiple={isMultiple}
      getPopupContainer={getPopupContainer || (() => document.querySelector('body'))}
      width={370}
      visible={stepPreviewProps ? stepPreviewProps.stepSelectVisible : undefined}
      onVisibleChange={stepPreviewProps ? stepPreviewProps.handleStepSelectVisibleChange : undefined}
      render={renderContent({
        refContainer,
        isLoading: loading,
        data,
        disabledOptions: disabledOptions ? disabledOptions.map((o: any) => convertToOption(o)).map((o: any) => o.selectKey) : undefined,
        exclusiveTypes,
        refresh: refetch,
        groups: [
          // { id: 'recentlyUsed', name: '最近使用'},
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
        collapsedGroupIds, // 收起、展开，与 handleCollapsedGroupChange setCollapsedGroupIds 一起使用
        dataFilter,
        handleCollapsedGroupChange,
        setCollapsedGroupIds,
        handleSearch: handleKeywordChange,
        handleOpenedGroupChange: () => {},
        scope,
        setScope,
        hoveringNode,
        handleNodeHover: handleNodeHover,
        labels,
        needEventPreview,
        needStepPreview,
        stepPreviewProps,
        previewVisibility,
        setPreviewVisibility,
        filterVisibility,
        setFilterVisibility,
        disabledPreviewOptions,
        useGroup: useGroup && scope === 'all',
        useTab,
        types,
        platforms,
        disabledTypes
      })}
    >
      {children}
    </Picker>
  );
}

export default EventSelect;
