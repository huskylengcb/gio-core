import React, { useState } from 'react';
import { useElementDetail } from '../../hooks';
// import Loading from 'giodesign/utils/Loading';
import Input from '@gio-design/components/lib/input';
import Switch from 'antd/lib/switch';
import { getElemPage } from '../../helper';
import { get, isEmpty } from 'lodash';
import ScreenshotModal from './ScreenshotModal';
import CreatorInfo from './CreatorInfo';
import { Tag } from './index.styled';
import Tags from './Tags';
import FavoriteIcon from './FavoriteIcon';
import { getEventPlatfromMap } from '@gio-core/constants/platformConfig';
import { map } from 'lodash';
import styled from 'styled-components';
import { renderChart } from './renderMap';
const TitleWrapper = styled.div`
    text-align: left;
    color: #A3ADC8;
    font-size: 12px;
    line-height: 20px;
    margin-top: 10px;
    margin-bottom: 5px;
`

const Col = styled.div`
  width: ${props => props.width};
  display: inline-block;
  margin-left: ${props => props.marginLeft && '4px'}
  text-align: center;
`

const DescripitionWrapper = styled.div`
    text-align: left;
    color: #313E75;
    font-size: 14px;
    line-height: 20px;
`

interface Props {
  event: any
  labels: string
  pages: any
  key: any
  getRef: any
  cache: any
  setCache: any
  deleteCache: any
  children: any
  timeRange: any
}



const ElementDetail = (props: Props) => {
  const { event, timeRange, cache, setCache } = props
  const chart = renderChart('simple', event, timeRange, cache, setCache);
  return (
    <div>
      <div>
        <TitleWrapper>
          描述
        </TitleWrapper>
        <DescripitionWrapper>
          {event.description}
        </DescripitionWrapper>
      </div>
      <div>
        <TitleWrapper>
          定义规则
        </TitleWrapper>
        <div style={{pading: '8px 16px',backgroundColor: '#F7F8FC'}}>现在定义的是页面<span style={{color: '#1248E9'}}>{get(event, 'definition.domain')}{get(event, 'definition.path')}</span>{get(event, 'definition.query') ?`，查询条件为${get(event, 'definition.query')}`: ''}。</div>
      </div>
      <div>
        <TitleWrapper>
          域名
        </TitleWrapper>
        <Input size='small' disabled value={get(event, 'definition.domain')}/>
      </div>
      <div>
        <TitleWrapper>
          路径
        </TitleWrapper>
        <Col width="80%">
          <Input size='small' disabled value={get(event, 'definition.path')}/>
        </Col>
        <Col width='10%' marginLeft='5px'>
          <Switch disabled={true} checked={!!get(event, 'definition.path')}/>
        </Col>
      </div>
      {get(event, 'definition.query') && (<div>
        <TitleWrapper>
          查询条件
        </TitleWrapper>
        {
          get(event, 'definition.query').split('&').map((ele: any) => {
            const query = ele.split('=')
            return (
              <div style={{marginBottom: '10px'}}>
                <Col width={'40%'}>
                  <Input disabled={true} value={query[0]}/>
                </Col>
                <Col width={'5%'} marginLeft={true}>
                    =
                </Col>
                <Col width={'40%'} marginLeft={true}>
                  <Input disabled={true} value={query[1]}/>
                </Col>
              </div>
            )
          })
        }
      </div>)}
      <div>
        <TitleWrapper>
          过去七天数据
        </TitleWrapper>
        {chart}
      </div>
      <ScreenshotModal src={get(event, 'screenshot.viewport')?`${document.location.origin}/download?file=${get(event, 'screenshot.viewport').slice(0,get(event, 'screenshot.viewport').indexOf('?'))}`: ''}/>
    </div>
  )
}



export default ElementDetail
