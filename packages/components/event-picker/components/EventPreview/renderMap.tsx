import React from "react";
import { get, find } from "lodash";
import { generatePayload } from "../../helper";
import MrgedEventDetail from "./MrgedEventDetail";
import ComplexMetricDetail from "./ComplexMetricDetail";
import ElementDetail from "./ElementDetail";
import CustomEventDetail from "./CustomEventDetail";
import { GioChart, setRequestHost } from "giochart";

setRequestHost("olap", "/v6/olap");

interface PureChartProps {
  payload: any;
  url: string;
  timeRange: string;
  cache: any;
  setCache: (cacheId: string, data: any) => void;
  chartSourceType: Params["chartSourceType"];
}

const renderPureChart = (props: PureChartProps) => {
  return (
    <GioChart
      sourceType={props.url.endsWith("ping") ? "ping" : props.chartSourceType}
      width={280}
      height={180}
      padding={0}
      gql={{ ...props.payload }}
      hideDate={true}
      hideTitle={true}
    />
  );
};

interface Params {
  target: any;
  timeRange: any;
  labels: any[];
  pages: any[];
  getRef: () => HTMLElement;
  preparedMetrics: any[];
  cache: object;
  setCache: (cacheId: string, data: any) => void;
  deleteCache: (cacheId: string) => void;
  chartSourceType: "chartdata" | "olap";
}

// 预定义指标需要展示的预览内容
export const prepared = (params: Params) => {
  const { target, preparedMetrics, cache, setCache, chartSourceType } = params;
  const chart = renderChart(
    "prepared",
    target,
    null,
    cache,
    setCache,
    chartSourceType
  );
  const preparedMetricDetail = find(preparedMetrics, { id: target.id });
  const description =
    get(target, "description") ||
    get(preparedMetricDetail, "description") ||
    "无";
  const instruction =
    get(target, "instruction") ||
    get(preparedMetricDetail, "instruction") ||
    "";

  return (
    <React.Fragment>
      <div key="prepared-metric-description">
        <span>指标含义</span>
        <p>{description}</p>
      </div>
      {instruction && (
        <div key="prepared-metric-instruction">
          <span>说明</span>
          <p>{instruction}</p>
        </div>
      )}
      {chart}
    </React.Fragment>
  );
};

// 无埋点事件需要展示的预览内容，内容时对应的元素的信息
export const simple = (params: Params) => {
  const {
    target,
    timeRange,
    labels,
    pages,
    getRef,
    cache,
    setCache,
    deleteCache,
  } = params;
  return (
    <React.Fragment>
      <ElementDetail
        event={target}
        labels={labels}
        timeRange={timeRange}
        pages={pages}
        key={target.id}
        getRef={getRef}
        cache={cache}
        setCache={setCache}
        deleteCache={deleteCache}
      />
    </React.Fragment>
  );
};

export const element = (params: Params) => {
  const {
    target,
    timeRange,
    labels,
    pages,
    getRef,
    cache,
    setCache,
    deleteCache,
  } = params;

  return (
    <React.Fragment>
      <ElementDetail
        event={target}
        labels={labels}
        timeRange={timeRange}
        pages={pages}
        key={target.id}
        getRef={getRef}
        cache={cache}
        setCache={setCache}
        deleteCache={deleteCache}
      />
    </React.Fragment>
  );
};

// 合并事件需要展示的预览内容
const mrgd = (params: Params) => {
  const { target, timeRange, labels, cache, setCache, deleteCache } = params;
  const chart = renderChart("merged", target, timeRange, cache, setCache);
  return (
    <React.Fragment>
      <MrgedEventDetail
        event={target}
        key={target.id}
        labels={labels}
        cache={cache}
        setCache={setCache}
        deleteCache={deleteCache}
      />
      {chart}
    </React.Fragment>
  );
};

// 计算指标需要展示的预览内容
const complex = (params: Params) => {
  const { target, timeRange, labels, cache, setCache, deleteCache } = params;
  const chart = renderChart("complex", target, timeRange, cache, setCache);
  return (
    <React.Fragment>
      <ComplexMetricDetail
        event={target}
        labels={labels}
        cache={cache}
        setCache={setCache}
        deleteCache={deleteCache}
      />
      {chart}
    </React.Fragment>
  );
};

// 埋点事件需要展示的预览内容
const dash = (params: Params) => {
  const {
    target,
    timeRange,
    labels,
    cache,
    setCache,
    deleteCache,
    chartSourceType,
  } = params;
  return (
    <React.Fragment>
      <CustomEventDetail
        event={target}
        labels={labels}
        cache={cache}
        setCache={setCache}
        deleteCache={deleteCache}
        chartSourceType={chartSourceType}
      />
    </React.Fragment>
  );
};

// 生成预览图
export const renderChart = (
  type: string,
  dataSource: any,
  timeRange?: string,
  cache?: object,
  setCache?: (cacheId: string, data: any) => void,
  chartSourceType: Params["chartSourceType"] = "chartdata"
) => {
  let payload: object;
  let url: string;
  const projectId = window.location.href
    .match(/\/projects\/[0-9A-Za-z]*/)?.[0]
    ?.replace("/projects/", "");
  if (dataSource.type === "element") {
    payload = {
      actions: dataSource.actions,
      attrs: {
        domain: get(dataSource, "definition.domain") || "",
        path: get(dataSource, "definition.path") || undefined,
        query: get(dataSource, "attrs.query") || undefined,
        xpath: get(dataSource, "attrs.xpath") || undefined,
        content: get(dataSource, "attrs.content") || undefined,
        contentType: get(dataSource, "attrs.contentType") || undefined,
        index: get(dataSource, "attrs.index") || undefined,
        href: get(dataSource, "attrs.href") || undefined,
        urlScheme: get(dataSource, "definition.urlScheme") || undefined,
      },
      definition: {
        domain: get(dataSource, "definition.domain") || "",
        path: get(dataSource, "definition.path") || undefined,
        query: get(dataSource, "definition.query") || undefined,
        xpath: get(dataSource, "definition.xpath") || undefined,
        content: get(dataSource, "definition.content") || undefined,
        contentType: get(dataSource, "definition.contentType") || undefined,
        index: get(dataSource, "definition.index") || undefined,
        href: get(dataSource, "definition.href") || undefined,
        urlScheme: get(dataSource, "definition.urlScheme") || undefined,
      },
      platform: dataSource.platforms[0],
      chartType: "line",
    };
    url = `/projects/${window.project.id}/ping`;
  } else if (dataSource.id) {
    payload = generatePayload(type, dataSource, timeRange);
    if (chartSourceType === "olap") {
      url = "/v6/olap";
    } else {
      url = projectId ? `/projects/${projectId}/chartdata` : "/chartdata";
    }
  } else {
    return null;
    // 如果dataSource中没有id，说明现在要展示的是一个没有定义过的元素
    // 此时需要调用的是ping接口
  }

  // return (
  //   <GioChart
  //     sourceType={'olap'}
  //     width={280}
  //     height={180}
  //     padding={0}
  //     gql={testGQL}
  //     hideDate={true}
  //     hideTitle={true}
  //   />
  // )

  return (
    <div className="event-preview-chart-wrapper">
      {renderPureChart({
        payload,
        url,
        timeRange,
        cache,
        setCache,
        chartSourceType,
      })}
      {/* <PureChart
        payload={payload}
        url={url}
        timeRange={timeRange}
        cache={cache}
        setCache={setCache}
        chartSourceType={chartSourceType}
      /> */}
    </div>
  );
};

const render = {
  prepared,
  simple,
  element,
  mrgd,
  complex,
  dash,
  merged: mrgd,
  custom: dash,
};

export default render;
