import React from "react";
import styled from "styled-components";
import Icon from "@gio-design/icon";
import { get } from "lodash";
import { isSameWithRegular } from "./xpathUtil";
const Rule = (props: any) => {
  const { data, dataType } = props;
  const DefinitionRuleContainer = styled.div`
    background-color: #f7f8fc;
    border-radius: 4px;
    padding: 8px 16px 8px 20px;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 20px;
    color: #313e75;
    position: relative;
  `;
  const Cel = (props: any) => (
    <span style={{ color: "#1248E9", marginLeft: "3px", marginRight: "3px" }}>
      {props.children}
    </span>
  );
  const renderSimilarElement = (props: any) => {
    const { data } = props;
    let hasLimiter =
      !!get(data, "definition.content") ||
      !!get(data, "definition.href") ||
      !!get(data, "definition.index");
    let hasContentLimiter = !!get(data, "definition.content");
    let hasIndexLimiter = !!get(data, "definition.index");
    let hasHrefLimiter = !!get(data, "definition.href");
    return (
      <>
        {hasLimiter && (
          <>
            <Cel>同类元素内</Cel>
            {hasContentLimiter && hasIndexLimiter && (
              <>
                ，限定
                <Cel>
                  元素内容
                  {get(data, "definition.contentType") == "match_phrase"
                    ? "包含"
                    : "为"}
                  「{get(data, "definition.content")}」
                </Cel>
                ，
                <Cel>{`元素位置为「第${get(
                  data,
                  "definition.index"
                )}位」`}</Cel>
              </>
            )}
            {!hasContentLimiter && hasIndexLimiter && (
              <>
                ，限定
                <Cel>{`元素位置为「第${get(
                  data,
                  "definition.index"
                )}位」`}</Cel>
              </>
            )}
            {hasContentLimiter && !hasIndexLimiter && (
              <>
                ，限定
                <Cel>
                  元素内容
                  {get(data, "definition.contentType") == "match_phrase"
                    ? "包含"
                    : "为"}
                  「{get(data, "definition.content")}」
                </Cel>
              </>
            )}
            {hasHrefLimiter && (
              <>
                ，限定
                <Cel>跳转链接</Cel>
              </>
            )}
            的元素。
            {hasContentLimiter && hasHrefLimiter && !hasIndexLimiter && (
              <>
                <span>若元素的内容或跳转链接改变，就不再继续统计了。</span>
                <span>即使元素的位置改变，也会继续统计。</span>
              </>
            )}
            {hasContentLimiter && !hasHrefLimiter && hasIndexLimiter && (
              <>
                <span>若元素的内容或位置改变，就不再继续统计了。</span>
                <span>即使元素的跳转链接改变，也会继续统计。</span>
              </>
            )}
            {!hasContentLimiter && hasHrefLimiter && hasIndexLimiter && (
              <>
                <span>若元素的位置或跳转链接改变，就不再继续统计了。</span>
                <span>即使元素的内容改变，也会继续统计。</span>
              </>
            )}
            {hasContentLimiter && !hasHrefLimiter && !hasIndexLimiter && (
              <>
                <span>若元素的内容改变，就不再继续统计了。</span>
                <span>即使元素的位置和跳转链接改变，也会继续统计。</span>
              </>
            )}
            {!hasContentLimiter && hasHrefLimiter && !hasIndexLimiter && (
              <>
                <span>若元素的跳转链接改变，就不再继续统计了。</span>
                <span>即使元素的内容和位置改变，也会继续统计。</span>
              </>
            )}
            {!hasContentLimiter && !hasHrefLimiter && hasIndexLimiter && (
              <>
                <span>若元素的位置改变，就不再继续统计了。</span>
                <span>即使元素的内容和跳转链接改变，也会继续统计。</span>
              </>
            )}
            {hasContentLimiter && hasHrefLimiter && hasIndexLimiter && (
              <>
                <span>
                  若元素的内容、位置或跳转链接改变，就不再继续统计了。
                </span>
              </>
            )}
          </>
        )}
        {!hasLimiter && (
          <>所有同类元素的数据之和。我们已经将这组同类元素用虚线框标记出来</>
        )}
      </>
    );
  };
  const renderNoSimilarElement = (props: any) => {
    const { data } = props;
    let hasLimiter =
      !!get(data, "definition.content") || !!get(data, "definition.href");

    let hasContentLimiter = !!get(data, "definition.content");
    // let hasIndexLimiter = get(data, 'definition.index') === null;
    let hasHrefLimiter = !!get(data, "definition.href");
    return (
      <>
        {hasLimiter && (
          <>
            <Cel>当前位置</Cel>
            {hasContentLimiter && (
              <>
                ，限定
                <Cel>
                  元素内容
                  {get(data, "definition.contentType") == "match_phrase"
                    ? "包含"
                    : "为"}
                  「{get(data, "definition.content")}」
                </Cel>
              </>
            )}
            {hasHrefLimiter && (
              <>
                ，限定
                <Cel>跳转链接</Cel>
              </>
            )}
            的元素。
            {hasContentLimiter && !hasHrefLimiter && (
              <>
                <span>若元素的内容改变，就不再继续统计了。</span>
                <span>即使元素的跳转链接改变，也会继续统计。</span>
              </>
            )}
            {!hasContentLimiter && hasHrefLimiter && (
              <>
                <span>若元素的跳转链接改变，就不再继续统计了。</span>
                <span>即使元素的内容改变，也会继续统计。</span>
              </>
            )}
            {hasContentLimiter && hasHrefLimiter && (
              <>
                <span>若元素的内容或跳转链接改变，就不再继续统计了。</span>
              </>
            )}
          </>
        )}
        {!hasLimiter && (
          <>
            <Cel>当前位置</Cel>
            的元素。即使元素的内容和跳转链接改变，也会继续统计。
          </>
        )}
      </>
    );
  };

  const hasSimilar = () => {
    // attr中有index，href，xpath，但是在定义规则中没有index，
    //那就在筛选同类元素的时候，只匹配xpath和href相同就认为是同类元素。当前元素肯定是attr相同的那个
    if (
      !!get(data, "attrs.href") &&
      !!get(data, "attrs.xpath") &&
      !!get(data, "attrs.index")
    ) {
      return isSameWithRegular(
        get(data, "definition.xpath"),
        get(data, "attrs.xpath")
      );
    }

    return false;
  };
  //////<see href='https://growingio.atlassian.net/wiki/spaces/CDP/pages/1662026026'/>
  return (
    <DefinitionRuleContainer>
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
        <span>
          现在定义的是
          <Cel>所属页面</Cel>
          中，
          {hasSimilar()
            ? renderSimilarElement({ ...props })
            : renderNoSimilarElement({ ...props })}
          {/* 现在定义的是 所属页面 中，所有同类元素的数据之和
            现在定义的是 所属页面 中，当前位置 的元素。即使元素的内容和跳转链接改变，也会继续统计。 */}
        </span>
      </div>
    </DefinitionRuleContainer>
  );
};

/* 现在定义的是 所属页面 中，同类元素内，限定 元素内容包含 {name} ，元素位置为{addr}，
          限定 跳转链接 的元素。若元素的内容、位置或跳转链接改变，就不再继续统计了 */

export default Rule;
