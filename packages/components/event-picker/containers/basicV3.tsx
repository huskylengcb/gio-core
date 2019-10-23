import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import EventSelect from '../components/EventSelect';
import { getIsLoading, convertToOption } from '../helper';
import preparedMetricsService from 'store/data/preparedMetrics';
import labelsService from 'store/data/labels';
import customEventsService from 'store/data/customEvents';
import Label from 'modules/core/types/Label';
import PreparedMetric from 'modules/core/types/Metrics/PreparedMetric';

const resourceInjector = require('store/data/injector').default;

const datametaSelector = (state: any) => state.datameta;

const resources = [
  'labels',
  'preparedMetrics'
];

resourceInjector(EventSelect, resources);

const basicSelector = createSelector(
  datametaSelector,
  labelsService.selector,
  preparedMetricsService.selector,
  (datameta: any, labels: Label[], preparedMetrics: any[]) => {
    return {
      groups: [
        { id: 'prepared', name: '预定义指标' },
        ...labels,
        { id: 'unknown', name: '未分类' }
      ],
      data: [
        ...preparedMetrics.map((m: PreparedMetric) => ({
          ...m, type: 'prepared'
        })),
      ].map((m: any) => convertToOption(m)),
      isLoading: getIsLoading(datameta, [...resources])
    };
  }
);

export default connect(basicSelector)(EventSelect as any);
