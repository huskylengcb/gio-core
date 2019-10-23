import { useState, useEffect } from 'react';
import { initialState } from './components/List/constants';
import { generateSelectKey  } from './helper';
//import customEventsService from 'store/data/customEvents';
import {
  getMeasurementName,
  getMeasurementNameWithAttribute
} from './helper';
import { subString } from '@gio-core/utils/format';
import _ from 'lodash';
import objectHash from 'object-hash';

const customEventsService = {};

const http = require('@gio-core/utils/http').default;

const getQueryString = (query: object) => {
  let queryString;
  if (query) {
    queryString = Object.keys(query)
      .reduce((pairs: string[], key: string) =>
        query[key] ? [...pairs, `${key}=${query[key]}`] : pairs,
        []
      )
      .join('&');
  }
  return queryString ? `?${queryString}` : '';
}

export const useFetch = (url: string, query?: object, cache?: object, setCache?: (cacheId: string, data: any) => void) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const endpoint = url + getQueryString(query);
  const fetch = () => {
    setIsLoading(true);
    http.get(endpoint)
      .then((data: any[]) => {
        setData(data);
        setIsLoading(false);
        if (setCache) {
          // 如果存在缓存，并且成功调用接口获取了数据，就将此数据存放在缓存中
          setCache(objectHash(endpoint), data);
        }
      })
      .catch(() => {
        setData(data);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (cache && cache[objectHash(endpoint)]) {
      // 如果存在缓存并且在缓存中存在哈希值ID相同的数据，就直接结束loading状态，然后调用数据
      setData(cache[objectHash(endpoint)]);
      setIsLoading(false);
    } else {
      // 如果在缓存中不存在哈希值ID相同的数据，说明这是第一次请求此数据，需要调用接口获得数据
      fetch();
    }
  }, [url, query]);

  return { data, isLoading, fetch };
}

export const useSearch = (url: string, cacheOptions?: object) => {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState(undefined);
  const [scope, setScope] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const {
    groupIds,
    setGroupIds,
    handleGroupIdsChange
  } = useGroups([]);

  const handleSearch = (keyword: string) => setKeyword(keyword);

  useEffect(() => {
    if (keyword !== undefined || scope !== 'all') {
      setIsLoading(true);
      http.get(url + getQueryString({ q: keyword && encodeURIComponent(keyword), c: scope === 'all' ? '' : scope }))
        .then((data: any[]) => {
          setData(
            data.map((d: any) => ({
              ...d,
              selectKey: generateSelectKey(d),
              groups: d.labels || ['unknown']
            }))
          );
          setIsLoading(false);
        })
        .catch(() => {
          setData([]);
          setIsLoading(false);
        });
      setGroupIds([]);
    }
  }, [keyword, scope]);

  return {
    data,
    keyword,
    isLoading,
    handleSearch,
    searchGroupIds: groupIds,
    handleSearchGroupIdsChange: handleGroupIdsChange,
    scope,
    setScope,
  };
}

export const useGroups = (initialGroupIds = []) => {
  const [groupIds, setGroupIds] = useState(initialGroupIds);
  const handleGroupIdsChange = (groupId) => {
    const isExist = groupIds.indexOf(groupId) > -1;
    let newGroupIds: string[] = [];
    if (isExist) {
      newGroupIds = groupIds.filter((gId: string) => gId !== groupId);
    } else {
      newGroupIds = [...groupIds, groupId];
    }
    setGroupIds(newGroupIds);
  }
  return {
    groupIds,
    setGroupIds,
    handleGroupIdsChange
  };
}

export const useLabeledData = () => {
  const [state, setState] = useState(initialState);
  const { groupIds, handleGroupIdsChange, setGroupIds } = useGroups(['prepared', 'recentlyUsed']);
  const [scope, setScope] = useState('all');

  const handleOpenedGroupChange = (groupId) => {
    const isOpened = groupIds.indexOf(groupId) > -1;
    handleGroupIdsChange(groupId);
    setState({ ...state, targetGroupId: isOpened ? null : groupId });
  }

  const reset = () => {
    setGroupIds([]);
    setState(initialState);
  }

  useEffect(() => {
    const { targetGroupId: groupId, dataCache } = state;
    const c = scope === 'all' ? groupId : scope;

    if (c && !dataCache[c]) {
      setState({ ...state, isLoading: true });
      http.get(`/v3/projects/${window.project.id}/measurements?c=${c}`)
        .then((data: any) =>
          setState({
            ...state,
            isLoading: false,
            dataCache: {
              ...dataCache,
              [c]: data.map((event: any) => ({
                ...event,
                groups: scope === 'all' ? [groupId] : [],
                selectKey: generateSelectKey(event)
              }))
            }
          })
        )
        .catch(() => setState({ ...state, isLoading: false }));
    }
  }, [state.targetGroupId, scope])

  return {
    data: Object.keys(state.dataCache).reduce((acc: any[], key: string) => (
      [...acc, ...state.dataCache[key]]
    ), []),
    dataCache: state.dataCache,
    openedGroupIds: groupIds,
    isLoading: state.isLoading,
    handleOpenedGroupChange,
    scope,
    setScope,
    reset
  }
}

const elementDetailHandler = (
  url: string,
  data: any,
  setData: (data: any) => void,
  setIsLoading: (isLoading: boolean) => void,
  setCache: (cacheId: string, data: any) => void
) => {
  setData(data);
  setIsLoading(false);
  if (setCache) {
    // 如果存在缓存，并且成功调用接口获取了数据，就将此数据存放在缓存中
    setCache(objectHash(url), data);
  }
}

// 如果获取到的信息中存在element ID，就直接调用 elements/ID 接口获取元素详情
// 如果没有element ID（只有event ID），需要先调用 simple-events/ID 接口，获得element ID，之后再调用 elements/ID 接口
export const useElementDetail = (event: any, cache?: object, setCache?: (cacheId: string, data: any) => void) => {
  const eventId = event.id;
  const [_elementId, setElementId] = useState(event.elementId);
  const [_isLoading, setIsLoading] = useState(true);
  const [_elementDetail, setElementDetail] = useState({});

  useEffect(() => {
    let handler = elementDetailHandler;
    setIsLoading(true);
    if (eventId && !_elementId) {
      const url = `/v3/projects/${window.project.id}/simple-events/${eventId}`;
      if (cache && cache[objectHash(url)]) {
        // 如果存在缓存并且在缓存中存在哈希值ID相同的数据，就直接结束loading状态，然后调用数据
        setElementId(cache[objectHash(url)].elementId);
        setIsLoading(false);
      } else {
        // 如果在缓存中不存在哈希值ID相同的数据，说明这是第一次请求此数据，需要调用接口获得数据
        http.get(url)
        .then((data: { [propName: string]: any; }) => {
          if (handler) {
            handler(url, data.elementId, setElementId, setIsLoading, setCache);
          }
        })
        .catch(() => {
          setIsLoading(true);
        });
      }
    }
    return () => {
      handler = null;
    }
  }, [eventId, _elementId]);

  useEffect(() => {
    let handler = elementDetailHandler;
    setIsLoading(true);
    if (_elementId) {
      const url = `/v3/projects/${window.project.id}/elements/${_elementId}`;
      if (cache && cache[objectHash(url)]) {
        // 如果存在缓存并且在缓存中存在哈希值ID相同的数据，就直接结束loading状态，然后调用数据
        setElementDetail(cache[objectHash(url)]);
        setIsLoading(false);
      } else {
        // 如果在缓存中不存在哈希值ID相同的数据，说明这是第一次请求此数据，需要调用接口获得数据
        http.get(url)
        .then((data: { [propName: string]: any; }) => {
          if (handler) {
            handler(url, data, setElementDetail, setIsLoading, setCache);
          }
        })
        .catch(() => {
          setIsLoading(true);
        });
      }
      return () => {
        handler = null;
      }
    }
  }, [_elementId]);

  return { isLoading: _isLoading, data: _elementDetail }
}

interface Props {
  measurement: any,
  showEventName?: boolean,
  visibleLength?: number
};

export const useMeasurementName = ({ measurement, showEventName, visibleLength }: Props) => {
  const [customEvent, setCustomEvent] = useState(null);
  const isCustomEventWithAttribute = measurement.type === 'custom'
    && measurement.attribute
    && ['sum', 'average'].includes(measurement.aggregator);
  useEffect(() => {
    if (isCustomEventWithAttribute) {
      const request = (window as any).store.dispatch(customEventsService.actions.getCustomEventById(measurement.id));
      request.then((customEvent: any) => {
        setCustomEvent(customEvent);
      })
    } else {
      setCustomEvent(null);
    }
  }, [measurement]);
  const showNameWithAttribute = isCustomEventWithAttribute && customEvent;
  const name = showNameWithAttribute ?
    getMeasurementNameWithAttribute({
      ...measurement,
      name: customEvent.name,
      attributes: customEvent.attributes
    })
    :
    getMeasurementName(measurement, showEventName)
  return ({
    name: visibleLength ? subString(name, visibleLength, true) : name,
    fullName: name,
  })
}

const detailedEventUrlMap = {
  custom: `/v3/projects/${window.project.id}/custom-events/`,
  merged: `/v3/projects/${window.project.id}/merged-events/`,
  complex: `/v3/projects/${window.project.id}/complex-metrics/`,
  simple: `/v3/projects/${window.project.id}/elements/`
};

export const useEventsDetail = (events: any[]) => {
  const cacheKey = events.map(e => e.renderKey).join('_');
  const [detailedEvents, setDetailedEvents] = useState({
    fetchStatus: 'unstarted',
    key: cacheKey,
    values: []
  });

  useEffect(() => {
    setDetailedEvents({
      fetchStatus: 'fetching',
      key: cacheKey,
      values: []
    })
    Promise.all(events.map((e) => {
      if (e.type === 'prepared') {
        return Promise.resolve(e);
      }

      return http.get(detailedEventUrlMap[e.type] + (e.type === 'simple' ? e.elementId : e.id))
        .then((data) => {
          return {
            ...e,
            name: data.name
          }
        })
        .catch(() => {
          return null;
        });
    })).then((result) => {
      setDetailedEvents({
        fetchStatus: 'succeed',
        key: cacheKey,
        values: result.filter(r => !!r)
      });
    }).catch(() => {
      setDetailedEvents({
        fetchStatus: 'failed',
        key: cacheKey,
        values: []
      });
    })
  }, [cacheKey])

  return detailedEvents;
}
