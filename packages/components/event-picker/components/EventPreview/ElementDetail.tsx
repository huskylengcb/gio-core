import React, { useState } from "react";
import { useElementDetail } from "../../hooks";
// import Loading from 'giodesign/utils/Loading';
import { Input, Toggles } from "@gio-design/components";
// import Switch from "antd/lib/switch";
import '@gio-design/components/es/components/toggles/style/index.less';

import { getElemPage } from "../../helper";
import { get, isEmpty } from "lodash";
import ScreenshotModal from "./ScreenshotModal";
import CreatorInfo from "./CreatorInfo";
// import { Tag } from "./index.styled";
import Tags from "./Tags";
import FavoriteIcon from "./FavoriteIcon";
import { getEventPlatfromMap } from "@gio-core/constants/platformConfig";
import { map } from "lodash";
import styled from "styled-components";
import { renderChart } from "./renderMap";
import ElementClickDetail from "./ElementClickDetail";
// import Icon from "@gio-design/icon";
import { InfoCircleFilled } from "@gio-design/icons"
import { TitleWrapper, DescripitionWrapper, QuickViewContent, Col, Tag } from './styled'
const Switch = Toggles;
// const TitleWrapper = styled.div`
//   text-align: left;
//   color: #a3adc8;
//   font-size: 12px;
//   line-height: 20px;
//   margin-top: 10px;
//   margin-bottom: 5px;
// `;

// const Col = styled.div`
//   width: ${(props) => props.width};
//   display: inline-block;
//   margin-left: ${(props) => props.marginLeft && "4px"}
//   text-align: center;
// `;

// const DescripitionWrapper = styled.div`
//   text-align: left;
//   color: #313e75;
//   font-size: 12px;
//   line-height: 20px;
// `;
const DefinitionRule = styled.div`
  background-color: #f7f8fc;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 12px;
  color: #313e75;
  position: relative;
  margin-bottom: 10px;
`;

const BlueSpan = (props: any) => (
  <span style={{ color: '#1248E9', wordBreak: 'break-all', marginLeft: '3px', marginRight: '3px' }}>
    {props.children}
  </span>
);
// const Tag = styled.span`
//   display: inline-block;
//   padding-right: 8px;
//   padding-left: 8px;
//   color: #313e75;
//   font-family: PingFang SC;
//   background-color: #f7f8fc;
//   border-radius: 4px;
//   cursor: default;
// `;
interface Props {
  event: any;
  labels: string;
  pages: any;
  key: any;
  getRef: any;
  cache: any;
  setCache: any;
  deleteCache: any;
  children: any;
  timeRange: any;
}
const renderEventDetail = (domain: string, path: string, query: string, platform: string) => {
  const isMinp = platform === 'minp';
  if (isMinp) {
    if (!path && !query) {
      return (<div style={{ wordBreak: 'break-all' }}>现在定义的是 <BlueSpan>小程序所有页面。</BlueSpan> </div>)
    }
    if (!path && query) {
      return (<div style={{ wordBreak: 'break-all' }}>现在定义的是 <BlueSpan >小程序所有页面。</BlueSpan> 查询条件为 <BlueSpan>{query}</BlueSpan></div>)
    }
    if (!query && path) {
      return (<div style={{ wordBreak: 'break-all' }}>现在定义的是页面 <BlueSpan>{path}</BlueSpan> 。</div>)
    }
    if (query && path) {
      return (<div style={{ wordBreak: 'break-all' }}>现在定义的是页面 <BlueSpan>{path}</BlueSpan> ，查询条件为 <BlueSpan>{query}</BlueSpan> 。</div>)
    }

  }
  if (!path && !query) {
    return (<div style={{ wordBreak: 'break-all' }}>现在定义的是 <BlueSpan>{domain}</BlueSpan> 下的所有页面。</div>)
  }
  if (!path && query) {
    return (<div style={{ wordBreak: 'break-all' }}>现在定义的是 <BlueSpan>{domain}</BlueSpan> 查询条件为 <BlueSpan>{query}</BlueSpan>下的所有页面。</div>)
  }
  if (!query && path) {
    return (<div style={{ wordBreak: 'break-all' }}>现在定义的是 <BlueSpan>{domain}{path}</BlueSpan> 。</div>)
  }
  if (query && path) {
    return (<div style={{ wordBreak: 'break-all' }}>现在定义的是 <BlueSpan>{domain}{path}</BlueSpan> ，查询条件为 <BlueSpan>{query}</BlueSpan> 。</div>)
  }

}
const ElementDetail = (props: Props) => {
  const { event, timeRange, cache, setCache } = props;
  const isElemClick = event.docType == "elem";
  const chart = renderChart("simple", event, timeRange, cache, setCache);
  if (isElemClick) {
    return <ElementClickDetail {...props} />;
  }
  return (
    <QuickViewContent>
      <div>
        <TitleWrapper style={{ color: "#A3ADC8" }}>描述</TitleWrapper>
        <DescripitionWrapper>{event.description}</DescripitionWrapper>
      </div>
      <div>
        <TitleWrapper style={{ color: "#A3ADC8" }}>平台</TitleWrapper>
        <Tag>{get(event, "platforms.0", '')}</Tag>
      </div>
      <div>
        <TitleWrapper style={{ color: "#A3ADC8" }}>定义规则</TitleWrapper>
        <DefinitionRule>
          <div
            style={{
              display: "inline-block",
              width: "20px",
              position: "absolute",
              left: "12px",
              top: "7px",
            }}
          >
            {/* <InfoCircleFilled color="#3867F4" size="16px" /> */}
          </div>
          <div style={{ display: "inline-block", paddingLeft: "20px" }}>
            {renderEventDetail(
              get(event, "definition.domain"),
              get(event, "definition.path"),
              get(event, "definition.query"),
              get(event, "platforms[0]")
            )}
          </div>
        </DefinitionRule>
      </div>
      {(!!get(event, 'definition.urlScheme') || get(event, 'platforms[0]') === 'minp') && (
        <div>
          <TitleWrapper>所属应用</TitleWrapper>
          <Input
            size="small"
            disabled={true}
            value={`${get(event, 'definition.tunnelName', '')}  ${get(event, 'definition.tunnelName', '') ? '|' : ''}  ${get(event, 'definition.spn', '')}`}
          />
        </div>
      )}
      {(get(event, 'platforms[0]') !== 'minp') && (
        <div>
          <TitleWrapper>域名</TitleWrapper>
          <Input size="small" disabled value={get(event, "definition.domain")} />
        </div>)
      }
      <div>
        <TitleWrapper>路径</TitleWrapper>
        <Col width="240px">
          <Input size="small" disabled value={get(event, "definition.path")} />
        </Col>
        <Col width="auto" marginLeft="8px">
          <Toggles className="event-picker-preview-toggle" disabled={true} checked={!!get(event, 'definition.path')} defaultChecked={!!get(event, "definition.path")} />
        </Col>
      </div>
      {get(event, "definition.query") && (
        <div>
          <TitleWrapper>查询条件</TitleWrapper>
          {get(event, "definition.query")
            .split("&")
            .map((ele: any) => {
              const query = ele.split("=");
              return (
                <div style={{ marginBottom: "10px" }}>
                  <Col width={"45%"}>
                    <Input size="small" disabled={true} value={query[0]} />
                  </Col>
                  <Col width={"10%"}>
                    =
                  </Col>
                  <Col width={"45%"}>
                    <Input size="small" disabled={true} value={query[1]} />
                  </Col>
                </div>
              );
            })}
        </div>
      )}
      <div>
        <TitleWrapper>过去七天数据</TitleWrapper>
        {chart}
      </div>
      {!(get(event, 'platforms[0]', '').toLowerCase() === 'minp') && (
        <ScreenshotModal
          src={
            get(event, "screenshot.viewport")
              ? `${document.location.origin}/download?file=${get(
                event,
                "screenshot.viewport"
              ).slice(0, get(event, "screenshot.viewport").indexOf("?"))}`
              : ""
          }
        />)}
    </QuickViewContent>
  );
};

export default ElementDetail;
