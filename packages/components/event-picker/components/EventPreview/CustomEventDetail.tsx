import React from 'react';
import { useFetch } from '../../hooks';
// import Loading from 'giodesign/utils/Loading';
import { get, isEmpty } from 'lodash';
import CreatorInfo from './CreatorInfo';
import List from '@gio-design/components/lib/list';
import { Tag, Header } from './index.styled';
import Tags from './Tags';
import FavoriteIcon from './FavoriteIcon';
import { getMeasurementNameWithAttribute } from '../../helper';
import { renderChart } from './renderMap';

const Loading = () => (<div>Loading...</div>);

const typesMapping = {
 String: '字符串',
 Int: '整数',
 Double: '小数',
 string: '字符串',
 int: '整数',
 double: '小数'
};

const dashColumns = [
 { title: '属性名称', dataIndex: 'name', key: 'name' },
 { title: '属性类型', dataIndex: 'valueType', key: 'valueType', render: (v: string) => typesMapping[v] }
];
// CustomEventDetail包含了埋点事件的事件级变量信息和创建者信息
const CustomEventDetail = (props: any) => {

  //const urlCustomEvent = `/v3/projects/${window.project.id}/custom-events/${props.event.id}`;
  //  const $$customEvent = useFetch(urlCustomEvent, null, cache, setCache);
  const { event, labelList, cache, setCache, deleteCache, chartSourceType } = props;
  const $$customEvent = {
    loading: false,
    data: event
  }

  const isCustomEventWithAttribute = event.type === 'custom'
    && event.attribute
    && ['sum', 'average'].includes(event.aggregator)
    && !event.fromEventPicker;
  if ($$customEvent.isLoading) {
    return <div className='loading'><Loading /></div>;
  } else if (isEmpty($$customEvent.data)) {
    return null;
  } else {
    const data: { [propName: string]: any; } = { ...$$customEvent.data, attribute: event.attribute };
    const description = data.description;
    const name = isCustomEventWithAttribute ? getMeasurementNameWithAttribute({ ...data, aggregator: event.aggregator }) : get(event, 'name');
    const chart = renderChart('custom', { ...data, name, aggregator: event.aggregator }, null, cache, setCache, chartSourceType);
    //  const checkedLabels = data.labels;
    return (
      <React.Fragment>
        <div className='event-preview-header'>
          <h1 title={name}>{name}</h1>
        </div>
        {/* <FavoriteIcon favorites={data.favorites} id={data.id} key={data.id} type='custom-events' deleteCache={deleteCache} /> */}
        <CreatorInfo event={$$customEvent.data} />
        {
          description && (
          <div key='prepared-metric-description'>
              <span>描述</span>
              <span className='text'>{description}</span>
            </div>
          )
        }
        {/*
          * 业务标签暂不可用
          {
        checkedLabels &&
        !isEmpty(checkedLabels) &&
        (
          <div>
            <Tags checkedTagId={checkedLabels} tagList={labelList}/>
          </div>
        )
      } */}
      <div>
        <div className='prepared-metric-description'>
          <span>事件属性</span>
        </div>
        <List
          columns={dashColumns}
          dataSource={get(data.attributes, 'length') ? data.attributes : [{ name: '无', type: '' }]}
          rowKey='name'
          size='small'
          bordered={true}
          pagination={false}
        />
      </div>
        {chart}
      </React.Fragment>
    );
  }
}

export default CustomEventDetail;

// export default () => (<div>CustomEventDetail</div>)
