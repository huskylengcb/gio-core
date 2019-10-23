import React from 'react';
//import { useFetch } from '../../hooks';
//import Loading from 'giodesign/utils/Loading';
import _ from 'lodash';
import CreatorInfo from './CreatorInfo';
import Tags from './Tags';
import FavoriteIcon from './FavoriteIcon';

const typeDict = {
  ['simple-clck']: '元素点击 | ',
  ['simple-imp']: '元素浏览 | ',
  ['simple-chng']: '输入框修改 | ',
  ['simple-sbmt']: '表单提交 | ',
  ['simple-page']: '页面浏览 | ',
  custom: '埋点事件 | ',
  prepared: '预定义指标 | ',
  merged: '合并事件 | ',
};

const Loading = (<div>Loading</div>);

// MrgedEventDetail包含了合并事件的表达式信息和创建者信息
function MrgedEventDetail(props: any) {
  const { event, labelList, cache, setCache, deleteCache } = props;
  const urlMergedEvent = `/v3/projects/${window.project.id}/merged-events/${event.id}`;
  const urlChildren = `/v3/projects/${window.project.id}/merged-events/${event.id}/children`;
  const $$mergedEventsData = []//useFetch(urlMergedEvent, null, cache, setCache);
  const $$childrenData = []//useFetch(urlChildren, null, cache, setCache);

  if ($$mergedEventsData.isLoading || $$childrenData.isLoading) {
    return <div className='loading'><Loading /></div>;
  } else if (!_.isEmpty($$mergedEventsData.data)) {
    const detailData: { [propName: string]: any; } = $$mergedEventsData.data;
    const renderedChildren = renderChildren(detailData.children, $$childrenData.data);
    const description = detailData.description;
    const checkedLabels = detailData.labels;
    return (
      <React.Fragment>
        <FavoriteIcon favorites={detailData.favorites} id={detailData.id} key={detailData.id} type='merged-events' deleteCache={deleteCache} />
        <CreatorInfo event={detailData} />
        {
          description && (
            <div className='row'>
              <label>描述</label>
              <span className='text'>{description || '无'}</span>
            </div>
          )
        }
        {checkedLabels && !_.isEmpty(checkedLabels) && (
          <div className='event-preview-tag'>
            <Tags checkedTagId={checkedLabels} tagList={labelList}/>
          </div>
        )}
        <div className='event-preview-expression'>{renderedChildren}</div>
      </React.Fragment>);
  }
  return null;
}

const renderChildren = (children: any[], childrenData: any[]): React.ReactNode => {
  if (!children) { return null; }
  return children.map((item) => {
    const { type, name } = renderTypeAndName(item, childrenData);
    return <div className='child' key={item.id}>{type + name}</div>;
  });
}

const renderTypeAndName = (item, childrenData) => {
  const childDetail = _.find(childrenData, (o) => o.child.id === item.id);
  if (!childDetail) {
    return { type: '', name: '该事件已被删除或者您没有权限查看此事件' }
  } else if (childDetail.child.action) {
    // 无埋点事件的类型由type和action两个字段共同决定
    const type = typeDict[`${childDetail.type}-${childDetail.child.action}`];
    const name = childDetail.child.name;
    return { type, name };
  } else {
    const type = typeDict[childDetail.type];
    const name = childDetail.child.name;
    return { type, name };
  }
};

export default MrgedEventDetail;
