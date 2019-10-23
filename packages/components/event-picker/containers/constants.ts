import { createSelector } from 'reselect';
import Metric from 'modules/core/types/Metric';
import { groups as groupList } from '../components/EventSelect/constants';
import {
  getIsLoading,
  generateEventSelectKey
} from '../helper';
import { frequencyMetricsSelector } from 'store/data/metrics/selectors';

export const groups = Object.keys(groupList).map((id: string) => ({ id, name: groupList[id] }));

export const resources = [
  'metrics',
  'events',
  'dimEvents'
];

const EventsService = require('store/data/events').default;
const DimEventsService = require('store/data/dimevents').default;
const MetricsService = require('store/data/metrics').default;
const { flattenEventsSelector, flattenEventsWithoutMergedSelector } = require('store/data/events/selectors');
const datametaSelector = (state: any) => state.datameta;

const transformEventToOption = (event: any, index: number) => ({
  ...event,
  // GQL metric use field as id
  id: event.field || event.id,
  selectKey: generateEventSelectKey(event),
  // demo
  groups: [event.global ? 'globalMetric' : 'uncategorized', index < 5 && 'recentlyUsed'].map((g: string) => g)
});

const output = (resources: string[]) => (datameta: any, ...dataSet: Metric[][]) => {
  const isLoading = getIsLoading(datameta, resources);
  let data;
  if (isLoading) {
    data = [];
  } else {
    data = dataSet.reduce((acc: Metric[], events: Metric[]) => [
      ...acc,
      ...events.map(transformEventToOption)
    ], []);
  }
  const [metrics, events, dimEvents] = dataSet;
  const pages = events.filter((e: any) => e.eventType === 'page');
  return ({ data, groups, pages, isLoading });
};

export const basicSelector = createSelector(
  datametaSelector,
  MetricsService.selector,
  flattenEventsSelector,
  DimEventsService.selector,
  output(resources)
);

export const frequencySelector = createSelector(
  datametaSelector,
  frequencyMetricsSelector,
  flattenEventsWithoutMergedSelector,
  DimEventsService.selector,
  output(resources)
);

export const mapDispatchToProps = (dispatch: any) => ({
  refresh: () => {
    dispatch(MetricsService.actions.fetchAllMetrics(true));
    dispatch(EventsService.actions.fetchAllEvents(true));
    dispatch(DimEventsService.actions.fetchAllDimEvents(true));
  }
});
