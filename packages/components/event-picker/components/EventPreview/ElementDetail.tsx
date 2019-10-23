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

//const Loading = (<div>Loading...</div>);
//
//const platforms = {
//  all: {
//    value: 'all',
//    label: '全部平台',
//    predicate: true
//  },
//  ...map(getEventPlatfromMap(), (value) => ({
//    ...value,
//    predicate: 'platform'
//  }))
//};
//const simpleFieldsMap: {
//  [key: string]: any[]
//} = {
//  page: [
//    { field: 'domain', label: '域名', hasSwitch: false },
//    { field: 'path', label: '路径', hasSwitch: true },
//    { field: 'query', label: '查询条件', hasSwitch: true },
//  ],
//  elem: [
//    { field: 'page', label: '页面', hasSwitch: false },
//    { field: 'href', label: '链接', hasSwitch: true, optional: true },
//    { field: 'content', label: '文本', hasSwitch: true },
//    { field: 'index', label: '位置', hasSwitch: true, optional: true },
//  ]
//};
//
///*
//// ElementDetail包含了无埋点事件的详细信息和创建者信息
//function ElementDetail(props) {
//  const { event, pages, labelList, cache, setCache, deleteCache } = props;
//
//  // 无埋点事件需要先调用接口去查询事件的详情信息，用此信息再去调用接口画图
//  const $$elementDetail = useElementDetail(event, cache, setCache);
//  // 在两种情况会下会进行无埋点事件预览的渲染
//  // 1. event对象中包含事件或元素id，用id值调用接口之后得到了有效的信息
//  // 2. event对象中没有id，说明现在要展示的是一个没有定义过的元素，这时event对象中应该已经包含了所需展示的信息
//  if ( (!$$elementDetail.isLoading && !isEmpty($$elementDetail.data)) || !event.id) {
//    const elementDetail: { [propName: string]: any; } = event.id ? $$elementDetail.data : event;
//    const platform = elementDetail.platforms[0];
//    const checkedLabels = elementDetail.labels;
//    const description = elementDetail.comment || elementDetail.description || '';
//    return (
//      <React.Fragment>
//        {/* FavoriteIcon需要elementID来判断无埋点事件是否被收藏 */}
//        {elementDetail.id && <FavoriteIcon favorites={elementDetail.favorites} id={elementDetail.id} key={elementDetail.id} type='elements' deleteCache={deleteCache} />}
//        <CreatorInfo event={elementDetail} />
//        <div className='event-fields' key='event-fields'>
//          {
//            description && (
//              <div className='row'>
//                <label>描述</label>
//                <span className='text'>{description}</span>
//              </div>
//            )
//          }
//          {get(elementDetail.screenshot, 'viewport') && <ScreenshotModal src={window.gateway + elementDetail.screenshot.viewport} />}
//          {checkedLabels && !isEmpty(checkedLabels) && <Tag><Tags checkedTagId={checkedLabels} tagList={labelList}/></Tag>}
//          {simpleFieldsMap[elementDetail.docType].map(renderField({
//            ...elementDetail,
//            attrs: {
//              ...elementDetail.attrs,
//              page: getElemPage(elementDetail, pages || [])
//            }
//          }))}
//          <div className='row'>
//            <label htmlFor='platform'>平台</label>
//            <Input
//              id='platform'
//              value={get(platforms[platform], 'label', platform)}
//              disabled={true}
//            />
//          </div>
//        </div>
//      </React.Fragment>
//    )
//  } else {
//    return <div className='event-fields' key='event-fields'><Loading /></div>;
//  }
//}
//
//const renderField = (event: any) => ({ field, label, hasSwitch, optional }: any) => {
//  if (optional && event.attrs[field] === undefined) {
//    return null;
//  }
//  const value = event.definition[field] || event.attrs[field];
//  const input = (<Input id={field} value={value} disabled={true} />);
//  return (
//    <div className='row' key={field}>
//      <label htmlFor={field}>{label}</label>
//      {
//        hasSwitch ? (
//          <span className='switch-wrapper'>
//            {input}
//            <Switch checkedChildren='开' unCheckedChildren='关' checked={!!event.definition[field]} size='small' disabled={true} />
//          </span>
//        ) : input
//      }
//    </div>
//  );
//}
//
////export default ElementDetail;
export default () => (<div>ElementDetail</div>)
