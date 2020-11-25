import React, { useState } from "react";
import { useElementDetail } from "../../hooks";
// import Loading from 'giodesign/utils/Loading';
import Input from "@gio-design/components/lib/input";
import Switch from "antd/lib/switch";
import { getElemPage } from "../../helper";
import { get, isEmpty } from "lodash";
import ScreenshotModal from "./ScreenshotModal";
import CreatorInfo from "./CreatorInfo";
import { Tag } from "./index.styled";
import Tags from "./Tags";
import FavoriteIcon from "./FavoriteIcon";
import { getEventPlatfromMap } from "@gio-core/constants/platformConfig";
import { map } from "lodash";
import styled from "styled-components";
import { renderChart } from "./renderMap";
import ElementClickDetail from "./ElementClickDetail";
import Icon from "@gio-design/icon";
const TitleWrapper = styled.div`
  text-align: left;
  color: #a3adc8;
  font-size: 12px;
  line-height: 20px;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const Col = styled.div`
  width: ${(props) => props.width};
  display: inline-block;
  margin-left: ${(props) => props.marginLeft && "4px"}
  text-align: center;
`;

const DescripitionWrapper = styled.div`
  text-align: left;
  color: #313e75;
  font-size: 12px;
  line-height: 20px;
`;
const DefinitionRule = styled.div`
  background-color: #f7f8fc;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 12px;
  color: #313e75;
  position: relative;
  margin-bottom: 10px;
`;

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
const renderEventDetail = (domain: string, path: string, query: string) => {
  if (!path && !query) {
    return (
      <div style={{ wordBreak: "break-all" }}>
        现在定义的是{" "}
        <span style={{ color: "#1248E9", wordBreak: "break-all" }}>
          {domain}
        </span>{" "}
        下的所有页面。
      </div>
    );
  }
  if (!path && query) {
    return (
      <div style={{ wordBreak: "break-all" }}>
        现在定义的是{" "}
        <span style={{ color: "#1248E9", wordBreak: "break-all" }}>
          {domain}
        </span>{" "}
        查询条件为 <span style={{ color: "#1248E9" }}>{query}</span>
        下的所有页面。
      </div>
    );
  }
  if (!query && path) {
    return (
      <div style={{ wordBreak: "break-all" }}>
        现在定义的是{" "}
        <span style={{ color: "#1248E9", wordBreak: "break-all" }}>
          {domain}
          {path}
        </span>{" "}
        。
      </div>
    );
  }
  if (query && path) {
    return (
      <div style={{ wordBreak: "break-all" }}>
        现在定义的是{" "}
        <span style={{ color: "#1248E9" }}>
          {domain}
          {path}
        </span>{" "}
        ，查询条件为 <span style={{ color: "#1248E9" }}>{query}</span> 。
      </div>
    );
  }
};
const ElementDetail = (props: Props) => {
  const { event, timeRange, cache, setCache } = props;
  const isElemClick = event.docType == "elem";
  const chart = renderChart("simple", event, timeRange, cache, setCache);
  if (isElemClick) {
    return <ElementClickDetail {...props} />;
  }
  return (
    <div>
      <div>
        <TitleWrapper style={{ color: "#A3ADC8" }}>描述</TitleWrapper>
        <DescripitionWrapper>{event.description}</DescripitionWrapper>
      </div>
      <div>
        <TitleWrapper style={{ color: "#A3ADC8" }}>平台</TitleWrapper>
        <Tag size="small">{event.description}</Tag>
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
            <Icon
              type={"warning-circle"}
              style={{
                backgroundColor: "#3867F4",
                color: "#fff",
                width: "16px",
                height: "16px",
                borderRadius: "8px",
                display: "inline-block",
              }}
            />
          </div>
          <div style={{ display: "inline-block", paddingLeft: "20px" }}>
            {renderEventDetail(
              get(event, "definition.domain"),
              get(event, "definition.path"),
              get(event, "definition.query")
            )}
          </div>
        </DefinitionRule>
      </div>
      <div>
        <TitleWrapper>域名</TitleWrapper>
        <Input size="small" disabled value={get(event, "definition.domain")} />
      </div>
      <div>
        <TitleWrapper>路径</TitleWrapper>
        <Col width="80%">
          <Input size="small" disabled value={get(event, "definition.path")} />
        </Col>
        <Col width="10%" marginLeft="5px">
          <Switch disabled={true} checked={!!get(event, "definition.path")} />
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
                  <Col width={"40%"}>
                    <Input disabled={true} value={query[0]} />
                  </Col>
                  <Col width={"5%"} marginLeft={true}>
                    =
                  </Col>
                  <Col width={"40%"} marginLeft={true}>
                    <Input disabled={true} value={query[1]} />
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
      <ScreenshotModal
        src={
          get(event, "screenshot.viewport")
            ? `${document.location.origin}/download?file=${get(
              event,
              "screenshot.viewport"
            ).slice(0, get(event, "screenshot.viewport").indexOf("?"))}`
            : ""
        }
      />
    </div>
  );
};

export default ElementDetail;
