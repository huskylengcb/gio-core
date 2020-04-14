import Metric from '@gio-core/types/Metric';
import { get, clone } from 'lodash';
import { groups, types } from './components/EventSelect/constants';
import measurementType from '@gio-core/types/measurementType';
import objectHash from 'object-hash';

export const flattenEvents = (events: any) => {
  return events.reduce((acc: Metric[], e: Metric) => {
    return [...acc, ...e.actions.map((action: string) => ({
      ...e,
      action
    }))]
  }, []);
}

export const getIsLoading = (datameta: any, resources: string[]) =>
  resources.some((resource: string) =>
    get(datameta, `${resource}.fetchStatus`) === 'fetching'
  );

const eventNameMap = {
  uc: '活跃天数',
  vs: '访问'
};

export const getMeasurementNameWithAttribute = (measurement: any) => {
  const attributeName = ((measurement.attributes || []).find((a: any) => a.id === measurement.attribute) || { name: '' }).name;
  const aggregatorName = (aggregators.find((a: any) => a.id === measurement.aggregator) || { name: '' }).name;
  return [measurement.name, ' | ', attributeName, aggregatorName].filter((s: string) => s).join('');
}

export const getMeasurementName = (measurement: any, showEventName?: boolean) => {
  const name = (showEventName && eventNameMap[measurement.id]) || measurement.name;
  return getShortTypeLabel(measurement) + (name || '');
}

const aggregatorMap = {
  count: '次数',
  distinct: '用户量'
};

export const getMetricName = (metric: any) => {
  const aggregator = aggregatorMap[metric.aggregator] || '';
  return getMeasurementName(metric) + aggregator;
}

export const getShortTypeLabel = (event: any) => {
  const { shortName } = types.find((t: any) => [event.type, event.action].includes(t.id)) || { shortName: '' };
  return shortName && event.type !== 'prepared' ? shortName + ' | ' : '';
};

export const getEventTypeLabel = (event: any) => {
  // 预定义指标在对应分组下不显示类型
  if (event.typeInvisible) {
    return '';
  }
  const targetType = types.find((type: any) =>
    // remove measure from event' action like clck_count
    [(event.action || '').replace(/_.*/g, ''), event.type].includes(type.id)
  );
  return targetType && targetType.name;
}

export const generateEventSelectKey = (event: any) => {
  let type;
  if (event.global) {
    type = 'metric';
  }
  if ([event.type, event.level].indexOf('complex') > -1) {
    type = event.type;
  }
  if (event.action) {
    // strip action measure like clck_count -> clck
    type = event.action.replace(/_.*/g, '');
  }
  if (event.eventType === 'dash') {
    type = event.eventType;
  }
  return `${event.field || event.id}-${type}`;
}

export const groupData = (
  data: any[],
  groupIds: string[],
  groupList: any,
  counters: any,
  isLazyMode = true,
  labeledDataCache: any,
  hasFilter: boolean
) => {
  const groupMap = data.reduce((map: any, event: any) => {

    (event.groups || []).forEach((groupId: string) => {
      if (!groupList.some(({ id }) => id === groupId )) {
        groupId = 'unknown';
      }
      const bucket = map[groupId];
      if (bucket) {
        bucket.push(event);
      } else {
        map[groupId] = [event];
      }
    });
    return map;
  }, {});
  return groupList.reduce((acc: any[], group) => {
    const bucket = groupMap[group.id] || [];
    const groupOption = {
      id: group.id,
      name: group.name,
      type: 'groupName',
      count: bucket.length,
      group
    };
    if (!bucket.length && (!isLazyMode || group.id === 'prepared')) {
      return acc;
    }
    if (
      (groupIds.indexOf(group.id) === -1 && isLazyMode)
      ||
      (groupIds.indexOf(group.id) > -1 && !isLazyMode)
      ) {
      return [...acc, groupOption];
    }
    return [
      ...acc,
      groupOption,
      ...bucket.map((event: any) => ({
        ...event,
        renderKey: event.selectKey + `-${group.id}`,
        typeInvisible: event.type === 'prepared'
      }))
    ]
  }, []);
}

export const sortByPinyin =
  (a: any, b: any) => a.name.localeCompare(b.name, 'zh-Hans-CN', { sensitivity: 'accent' })

const eventTypeMap: { [key: string]: (e: Metric) => boolean } = {
  global: (e: any) => e.global,
  mrgd: (e: any) => e.eventType === 'mrgd',
  simple: (e: any) => e.actions,
  complex: (e: any) => e.eventType === 'complex',
  dash: (e: any) => e.eventType === 'dash'
}

export const getEventAction = (event: any, measurement = 'count') => {
  const type = getEventType(event);
  if (type === 'simple') {
    return event.action + '_' + measurement;
  }
  if (type === 'dash') {
    return 'count';
  }
  return undefined;
}

export const getEventLevel = (event: any) => {
  if (event.global) {
    return 'expression';
  }
  if (event.actions) {
    return 'simple';
  }
  if (event.eventType === 'dash') {
    return event.eventType;
  }
  return 'complex';
}

export const getEventType = (event: Metric) =>
  Object.keys(eventTypeMap).reduce((type: string, key: string) => {
    if (type) {
      return type;
    } else if (eventTypeMap[key](event)) {
      return key;
    }
  }, undefined);

const urlFields = ['domain', 'path', 'query'];
export const getElemPage = (event: any, pages: any[]) => {
  const target = pages.find((p: any) =>
    urlFields.every((field: string) =>
      event.definition[field] === p.definition[field]
    )
  )
  return get(target, 'name') || urlFields.reduce((url: string, field: string) =>
    (field === 'query' && event.definition[field]) ? url + '?' + event.definition[field] : url + (event.definition[field] || ''),
    ''
  );
}

export const convertToOption = ((obj: any, showEventName?: boolean) => {
  return {
    groups: ['unknown'],
    ...obj,
    name: (obj.type === 'prepared' && showEventName && eventNameMap[obj.id]) || obj.name,
    selectKey: generateSelectKey(obj)
  }
});

export const generateSelectKey = (obj: any = {}) => {
  if (obj.type === 'simple') {
    return [obj.type, obj.action, obj.id].join('-');
  }
  if (obj.type === 'custom' && obj.attribute) {
    return [obj.type, obj.id, obj.aggregator, obj.attribute].filter((s: string) => s).join('-');
  }
  return [obj.type, obj.id].join('-');
};

export const omitOptionAttrs = ({ selectKey, renderKey, groups, ...obj }) => obj;

export const setMetricAggregator = (event: any, aggregator = 'count') => {
  if (event && (['prepared', 'complex'].includes(event.type) || event.aggregator)) {
    return event;
  }
  if (event.valueType === 'number') {
    return { ...event, aggregator: 'sum' };
  }
  return { ...event, aggregator };
};

export const aggregators = [
  { id: 'sum', name: '求和' },
  { id: 'average', name: '求平均' }
];

export const expandAttributeToMetric = (data: any[]) => {
  let i = 0;
  const arr = clone(data);
  while (arr[i]) {
    const event = arr[i];
    const numbericAttrs = event.attributes && event.attributes.filter((attr) => ['double', 'int'].includes(attr.valueType));
    const hasNumbericAttribute = event.type === 'custom' && event.attributes && numbericAttrs.length;
    if (hasNumbericAttribute) {
      const insert = numbericAttrs.reduce((acc, attr) => {
        return [...acc, ...aggregators.map((aggregator) => {
          return {
            ...event,
            name: event.name + ' | ' + attr.name + aggregator.name,
            aggregator: aggregator.id,
            attribute: attr.id,
            selectKey: [event.selectKey, aggregator.id, attr.id].join('-')
          }
        })]
      }, []);
      arr.splice(i + 1, 0, ...insert);
      i = i + insert.length;
    }
    i++;
  }
  return arr;
}

// 生成调用图形接口所需的请求实体, 用于chartdata接口的请求
export const generatePayload = (type: string, dataSource: any, timeRange?: string) => {
  let metrics;
  if (type === 'simple') {
    // 无埋点事件
    const metric = {
      id: dataSource.id,
      type: 'simple'
    };

    if (dataSource.action) {
      metrics = [{
        ...metric,
        action: dataSource.action,
      }];
    } else if (dataSource.actions) {
      metrics = dataSource.actions.map((action: string) => ({
        ...metric,
        action,
      }));
    } else {
      metrics = [{ ...metric }];
    }
  } else if (type === 'custom') {
    metrics = [{
      id: dataSource.id,
      type,
      action: dataSource.type === 'number' ? 'none' : 'count',
      aggregator: dataSource.aggregator,
      attribute: dataSource.attribute,
    }];
  } else {
    // others
    metrics = [{
      id: dataSource.id,
      type,
      action: dataSource.type === 'number' ? 'none' : 'count'
    }];
  }
  return {
    name: dataSource.name,
    dimensions: ['tm'],
    skip: 0,
    metrics,
    attrs: {
      metricsHash: objectHash(JSON.stringify({ dataSource }), { respectFunctionProperties: false }),
      metricType: 'none',
      subChartType: 'seperate'
    },
    granularities: [{ id: 'tm', interval: 86400000, trend: true }],
    limit: 20,
    timeRange: timeRange || 'day:8,1',
    targetUser: 'uv',
    chartType: 'line'
  };
}

export const getMetricUnit = (metric: any) => {
  // 埋点事件：数值型、关联数值型事件变量
  if (!metric || metric.type === 'custom' && (metric.valueType === 'number' || ['sum', 'average'].includes(metric.aggregator))) {
    return '';
  }
  // 活跃天数 活跃间隔天数
  if (['uc', 'lad'].includes(metric.id)) {
    return '天';
  }
  // xxx(unit)
  if (metric.type === 'prepared' && metric.name && metric.name.indexOf('(') >= 0 && metric.name.indexOf(')') >= 0) {
    return metric.name.substring(metric.name.indexOf('(') + 1, metric.name.indexOf(')'));
  }
  return '次';
}
