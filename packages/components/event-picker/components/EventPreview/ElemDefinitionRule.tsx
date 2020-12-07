import React from 'react';
import styled from 'styled-components';
import { WarningFilled } from '@gio-design/icons';
import { get } from 'lodash';
import { isSameWithRegular } from './xpathUtil';
const Rule = (props: any) => {
  const { data, dataType } = props;
  const DefinitionRuleContainer = styled.div`
    background-color: #f7f8fc;
    border-radius: 4px;
    padding: 8px 16px 8px 20px;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 20px;
    color: #313E75;
    position: relative;
  `;
  const Cel = (props: any) => (
    <span style={{ color: '#1248E9', marginLeft: '3px', marginRight: '3px' }}>
      {props.children}
    </span>
  );

  const renderSimilarElement = (props: any) => {
    const { data } = props;
    let hasLimiter =
      !!get(data, 'definition.content') ||
      !!get(data, 'definition.href') ||
      !!get(data, 'definition.index');
    let hasContentLimiter = !!get(data, 'definition.content');
    let hasIndexLimiter = !!get(data, 'definition.index');
    let hasHrefLimiter = !!get(data, 'definition.href');
    return (
      <>
        {hasLimiter && (
          <>
            <Cel>同类元素内</Cel>
            {hasContentLimiter && hasIndexLimiter && (
              <>
                ，限定
                <Cel>
                  元素内容{get(data, 'definition.contentType') == 'match_phrase' ? '包含' : '为'}「
                  {get(data, 'definition.content')}」
                </Cel>
                ，<Cel>{`元素位置为「第${get(data, 'definition.index')}位」`}</Cel>
              </>
            )}
            {!hasContentLimiter && hasIndexLimiter && (
              <>
                ，限定<Cel>{`元素位置为「第${get(data, 'definition.index')}位」`}</Cel>
              </>
            )}
            {hasContentLimiter && !hasIndexLimiter && (
              <>
                ，限定
                <Cel>
                  元素内容{get(data, 'definition.contentType') == 'match_phrase' ? '包含' : '为'}「
                  {get(data, 'definition.content')}」
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
          </>
        )}
        {renderAttrsDesc({ ...props })}
      </>
    );
  };
  const renderNoSimilarElement = (props: any) => {
    const { data } = props;
    let hasLimiter = !!get(data, 'definition.content') || !!get(data, 'definition.href');

    let hasContentLimiter = !!get(data, 'definition.content');
    // let hasIndexLimiter = get(data, 'definition.index') === null;
    let hasHrefLimiter = !!get(data, 'definition.href');
    return (
      <>
        {
          <>
            <Cel>当前位置</Cel>
            {hasContentLimiter && (
              <>
                ，限定
                <Cel>
                  元素内容{get(data, 'definition.contentType') == 'match_phrase' ? '包含' : '为'}「
                  {get(data, 'definition.content')}」
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
          </>
        }
        {renderAttrsDesc({ ...props })}
        {/* {!hasLimiter && (
          <>
            <Cel>当前位置</Cel>的元素。即使元素的内容和跳转链接改变，也会继续统计。
          </>
        )} */}
      </>
    );
  };
  const renderAttrsDesc = (props: any) => {
    const { data } = props;
    let hasLimiter = !!get(data, 'definition.content') || !!get(data, 'definition.href');
    let contentDefined = !!get(data, 'definition.content');
    let indexDefined = !!get(data, 'definition.index');
    let hrefDefined = !!get(data, 'definition.href');
    const contentAttr = !!get(data, 'attrs.content');
    const hrefAttr = !!get(data, 'attrs.href');
    const indexAttr = !!get(data, 'attrs.index');
    // const attrsDescs=['即使元素的跳转']
    //现根据有无跳转链接判断同类和非同类的描述
    let str1: string = '',
      str2: string = '';
    if (indexAttr) {
      if (contentAttr && hrefAttr && contentDefined && hrefDefined && indexDefined) {
        str1 = '内容、位置或跳转链接';
        str2 = '';
      }
      if (contentAttr && hrefAttr && !contentDefined && hrefDefined && indexDefined) {
        str1 = '位置或跳转链接';
        str2 = '内容';
      }
      if (contentAttr && hrefAttr && contentDefined && !hrefDefined && indexDefined) {
        str1 = '跳转链接';
        str2 = '内容和位置';
      }
      if (contentAttr && hrefAttr && !contentDefined && !hrefDefined && indexDefined) {
        str1 = '位置';
        str2 = '内容和跳转链接';
      }

      if (contentAttr && hrefAttr && !contentDefined && hrefDefined && !indexDefined) {
        str1 = '跳转链接';
        str2 = '内容和位置';
      }
      if (contentAttr && hrefAttr && contentDefined && !hrefDefined && !indexDefined) {
        str1 = '内容';
        str2 = '位置和跳转链接';
      }

      if (contentAttr && hrefAttr && contentDefined && hrefDefined && !indexDefined) {
        str1 = '内容或跳转链接';
        str2 = '位置';
      }
      if (contentAttr && hrefAttr && !contentDefined && !hrefDefined && !indexDefined) {
        str1 = '';
        str2 = '';
      }
      //元素attrs中没有的属性 definition中肯定没有
      //只有href
      if (!contentAttr && hrefAttr && hrefDefined && indexDefined) {
        str1 = '位置或跳转链接';
        str2 = '';
      }
      if (!contentAttr && hrefAttr && !hrefDefined && indexDefined) {
        str1 = '位置';
        str2 = '跳转链接';
      }
      if (!contentAttr && hrefAttr && !hrefDefined && !indexDefined) {
        str1 = '';
        str2 = '';
      }
      if (!contentAttr && hrefAttr && hrefDefined && !indexDefined) {
        str1 = '跳转链接';
        str2 = '位置';
      }
      //只有content时
      if (contentAttr && !hrefAttr && !contentDefined && !indexDefined) {
        str1 = '';
        str2 = '';
      }
      if (contentAttr && !hrefAttr && contentDefined && !indexDefined) {
        str1 = '内容';
        str2 = '位置';
      }
      if (contentAttr && !hrefAttr && !contentDefined && indexDefined) {
        str1 = '位置';
        str2 = '内容';
      }
      if (contentAttr && !hrefAttr && contentDefined && indexDefined) {
        str1 = '内容或位置';
        str2 = '';
      }
      if (!contentAttr && !hrefAttr) {
        str1 = '';
        str2 = '';
      }
    } else {
      if (contentAttr && hrefAttr && contentDefined && hrefDefined) {
        str1 = '内容或跳转链接';
        str2 = '';
      }
      if (contentAttr && hrefAttr && !contentDefined && hrefDefined) {
        str1 = '跳转链接';
        str2 = '内容';
      }
      if (contentAttr && hrefAttr && contentDefined && !hrefDefined) {
        str1 = '内容';
        str2 = '跳转链接';
      }
      if (contentAttr && hrefAttr && !contentDefined && !hrefDefined) {
        str1 = '';
        str2 = '内容和跳转链接';
      }
      //--只有href
      if (!contentAttr && hrefAttr && !hrefDefined) {
        str1 = '';
        str2 = '跳转链接';
      }
      if (!contentAttr && hrefAttr && hrefDefined) {
        str1 = '跳转链接';
        str2 = '';
      }
      //--只有content
      if (contentAttr && !hrefAttr && !contentDefined) {
        str1 = '';
        str2 = '内容';
      }
      if (contentAttr && !hrefAttr && contentDefined) {
        str1 = '内容';
        str2 = '';
      }
      //都没有
      if (!contentAttr && !hrefAttr) {
        str1 = '';
        str2 = '';
      }
    }
    const tmp = () => {
      if (!str1 && !str2 && indexAttr) {
        return <span style={{ color: '#313e75' }}>所有同类元素的数据之和。我们已经将这组同类元素用虚线框标记出来。</span>;
      }
      return (
        <>
          <span style={{ color: '#313e75' }}>{str1 ? `若元素的${str1}改变，就不再继续统计了。` : ''}</span>
          <span style={{ color: '#313e75' }}>{str2 ? `即使元素${str2}改变，也会继续统计。` : ''}</span>
        </>
      );
    };
    return tmp();
  };
  const hasSimilar = () => {
    // 同类元素判定 attrs.index && definition.xpath 与attrs.xpath 符合相似规则
    return !!get(data, 'attrs.index');
    // &&isSameWithRegular(get(data, 'definition.xpath'), get(data, 'attrs.xpath'))
  };
  //////<see href='https://growingio.atlassian.net/wiki/spaces/CDP/pages/1662026026'/>
  return (
    <DefinitionRuleContainer>
      <div
        style={{
          display: 'inline-block',
          width: '20px',
          position: 'absolute',
          left: '12px',
          top: '7px',
        }}
      >
        <WarningFilled color="#3867F4" size="16px" />
      </div>
      <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
        <>
          现在定义的是
          <Cel>所属页面</Cel>
          中，
          {hasSimilar() ? renderSimilarElement({ ...props }) : renderNoSimilarElement({ ...props })}
          {/* 现在定义的是 所属页面 中，所有同类元素的数据之和
            现在定义的是 所属页面 中，当前位置 的元素。即使元素的内容和跳转链接改变，也会继续统计。 */}
        </>
      </div>
    </DefinitionRuleContainer>
  );
};

/* 现在定义的是 所属页面 中，同类元素内，限定 元素内容包含 {name} ，元素位置为{addr}，
          限定 跳转链接 的元素。若元素的内容、位置或跳转链接改变，就不再继续统计了 */

export default Rule;
