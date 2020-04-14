import React from 'react';
import { get, find } from 'lodash';
import { generatePayload } from '../../helper';
import MrgedEventDetail from './MrgedEventDetail';
import ComplexMetricDetail from './ComplexMetricDetail';
import ElementDetail from './ElementDetail';
import CustomEventDetail from './CustomEventDetail';
import { GioChart } from 'giochart';
// import PureChart from 'modules/core/components/ChartPreview/PureChart';

interface PureChartProps {
  payload: any
  url: string
  timeRange: string
  cache: any
  setCache: () => void
}

const PureChart = (props: PureChartProps) => {
  return (
    <GioChart
      width={280}
      height={180}
      padding={0}
      gql={props.payload}
      hideDate={true}
      hideTitle={true}
    />
  )
}

interface Params {
  target: any,
  timeRange: any,
  labels: any[],
  pages: any[],
  getRef: () => HTMLElement,
  preparedMetrics: any[],
  cache: object,
  setCache: (cacheId: string, data: any) => void,
  deleteCache: (cacheId: string) => void,
}

// 预定义指标需要展示的预览内容
export const prepared = (params: Params) => {
  const { target, preparedMetrics, cache, setCache } = params;
  const chart = renderChart('prepared', target, null, cache, setCache);
  const preparedMetricDetail = find(preparedMetrics, {id: target.id})
  const description = get(target, 'description') || get(preparedMetricDetail, 'description') || '无';
  const instruction = get(target, 'instruction') || get(preparedMetricDetail, 'instruction') || '';

  return (
    <React.Fragment>
      <div key='prepared-metric-description'>
        <span>指标含义</span>
        <p>{description}</p>
      </div>
      {
        instruction && (
          <div key='prepared-metric-instruction'>
            <span>说明</span>
            <p>{instruction}</p>
          </div>
        )
      }
      {chart}
    </React.Fragment>
  );
};

// 无埋点事件需要展示的预览内容，内容时对应的元素的信息
export const simple = (params: Params) => {
  const { target, timeRange, labels, pages, getRef, cache, setCache, deleteCache } = params;
  const chart = renderChart('simple', target, timeRange, cache, setCache);
  return (
    <React.Fragment>
      <ElementDetail event={target} labels={labels} pages={pages} key={target.id} getRef={getRef} cache={cache} setCache={setCache} deleteCache={deleteCache} />
      {chart}
    </React.Fragment>
  )
};

// 合并事件需要展示的预览内容
const mrgd = (params: Params) => {
  const { target, timeRange, labels, cache, setCache, deleteCache } = params;
  const chart = renderChart('merged', target, timeRange, cache, setCache);
  return (
    <React.Fragment>
      <MrgedEventDetail event={target} key={target.id} labels={labels} cache={cache} setCache={setCache} deleteCache={deleteCache} />
      {chart}
    </React.Fragment>
  );
};

// 计算指标需要展示的预览内容
const complex = (params: Params) => {
  const { target, timeRange, labels, cache, setCache, deleteCache } = params;
  const chart = renderChart('complex', target, timeRange, cache, setCache);
  return (
    <React.Fragment>
      <ComplexMetricDetail event={target} labels={labels} cache={cache} setCache={setCache} deleteCache={deleteCache} />
      {chart}
    </React.Fragment>
  );
};

// 埋点事件需要展示的预览内容
const dash = (params: Params) => {
  const { target, timeRange, labels, cache, setCache, deleteCache } = params;
  return (
    <React.Fragment>
      <CustomEventDetail event={target} labels={labels} cache={cache} setCache={setCache} deleteCache={deleteCache} />
    </React.Fragment>
  );
}

// 生成预览图
export const renderChart = (type: string, dataSource: any, timeRange?: string, cache?: object, setCache?: (cacheId: string, data: any) => void) => {
  let payload: object;
  let url: string;
  if (dataSource.id) {
    payload = generatePayload(type, dataSource, timeRange);
    url = `/v5/projects/${window.project.id}/chartdata`;
  } else {
    return null
    // 如果dataSource中没有id，说明现在要展示的是一个没有定义过的元素
    // 此时需要调用的是ping接口
    payload = dataSource;
    url = `/v4/projects/${window.project.id}/ping`;
  }

  return (
    <div className='event-preview-chart-wrapper'>
      <PureChart payload={payload} url={url} timeRange={timeRange} cache={cache} setCache={setCache} />
    </div>
  );
};

// interface IRender {
//   [key: string]: (m: Metric, pages: Metric[]) => any
// }

const render = {
  prepared,
  simple,
  mrgd,
  complex,
  dash,
  merged: mrgd,
  custom: dash
};

export default render;
