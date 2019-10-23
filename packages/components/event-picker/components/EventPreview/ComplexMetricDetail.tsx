import React from 'react';
import { useFetch } from '../../hooks';
import _ from 'lodash';
//import Loading from 'giodesign/utils/Loading';
import CreatorInfo from './CreatorInfo';
import { Expression } from './index.styled';
import { Tag } from './index.styled';
import Tags from './Tags';
import Tooltip from '@gio-design/components/lib/tooltip';
import FavoriteIcon from './FavoriteIcon';

const Loading = (<div>Loading...</div>);

const typeDict = {
  ['simple-clck']: '元素点击',
  ['simple-imp']: '元素浏览',
  ['simple-chng']: '输入框修改',
  ['simple-sbmt']: '表单提交',
  ['simple-page']: '页面浏览',
  custom: '埋点事件',
  prepared: '预定义指标',
  merged: '合并事件',
};

const aggregatorDict = {
  count: '次数',
  distinct: '人数',
};

const specialPreparedMetricsName = {
  uc: '用户量',
  pv: '页面浏览量',
  vs: '访问量',
  vv: '进入次数',
};
/*
// ComplexMetricDetail包含了计算指标的表达式信息和创建者信息
function ComplexMetricDetail(props) {
  const { event, labelList, cache, setCache, deleteCache } = props;
  const urlComplexMetric = `/v3/projects/${window.project.id}/complex-metrics/${event.id}`;
  const urlChildren = `/v3/projects/${window.project.id}/complex-metrics/${event.id}/children`;
  const $$complexMetricData = useFetch(urlComplexMetric, null, cache, setCache);
  const $$childrenData = useFetch(urlChildren, null, cache, setCache);

  if ($$complexMetricData.isLoading || $$childrenData.isLoading) {
    return <div className='loading'><Loading /></div>;
  } else {
    const data: { [propName: string]: any; } = $$complexMetricData.data;
    const renderedExpression = renderExpression(data.expression, $$childrenData.data);
    const description = data.description;
    const checkedLabels = data.labels;
    return (
      <React.Fragment>
        <FavoriteIcon favorites={data.favorites} id={data.id} key={data.id} type='complex-metrics' deleteCache={deleteCache} />
        <CreatorInfo event={$$complexMetricData.data} />
        {
          description && (
            <div className='row'>
              <label>描述</label>
              <span className='text'>{data.description}</span>
            </div>
          )
        }
        {checkedLabels && !_.isEmpty(checkedLabels) && <Tag><Tags checkedTagId={checkedLabels} tagList={labelList}/></Tag>}
        <Expression>{renderedExpression}</Expression>
      </React.Fragment>
    );
  }
}

const renderExpression = (expression, childrenData: any[]) => {
  if (!expression || _.isEmpty(expression)) { return null; }

  if (expression.exprs) {
    // 这个计算指标分为分子和分母两部分
    const numerators = expression.exprs[0].measurements;
    const denominators = expression.exprs[1].measurements;
    const renderedNumerators = numerators.map(renderUnit.bind({}, childrenData));
    const renderedDenominators = denominators.map(renderUnit.bind({}, childrenData));
    return (
      <React.Fragment>
        <div className='expression'>
          {renderedNumerators}
        </div>
        <div className='middle'>&divide;</div>
        <div className='expression'>
          {renderedDenominators}
        </div>
      </React.Fragment>
    );
  } else {
    // 这个计算指标只有分子，相当于一些的指标相加，没有除法运算
    const numerators = expression.measurements;
    const renderedNumerators = numerators.map(renderUnit.bind({}, childrenData));
    return (
      <div className='expression'>
        {renderedNumerators}
      </div>
    );
  }
}

const renderUnit = (childrenData, unit, index) => {
  const weightNumber = unit.weight || 1;
  let weight: any = weightNumber.toString();
  if (weight.length > 6) {
    weight = <Tooltip title={weightNumber}>{weight.slice(0, 6) + '...'}</Tooltip>;
  }
  const { type, name } = renderTypeAndName(unit, childrenData);
  const aggregator = aggregatorDict[unit.aggregator];
  if (index === 0) {
    if (type === 'deleted') {
      return (
        <div className='unit' key={`${index}-${unit.id}`}>
          <span className='section'>{name}</span>
        </div>
      );
    } else {
      return (
        <div className='unit' key={`${index}-${unit.id}`}>
          <span className='type section'>{`${type}`}</span>
          <span className='name section'>{` | ${name}`}</span>
          <span className='aggregator section'>{` | ${aggregator}`}</span>
          <span className='weight section'>{' | '}&#215;{weight}</span>
        </div>
      );
    }
  }
  if (type === 'deleted') {
    return (
      <div className='unit' key={`${index}-${unit.id}`}>
        <span className='section'>{name}</span>
        <div className='plus'>+</div>
      </div>
    );
  } else {
    return (
      <div className='unit' key={`${index}-${unit.id}`}>
        <span className='type section'>{`${type}`}</span>
        <span className='name section'>{` | ${name}`}</span>
        <span className='aggregator section'>{` | ${aggregator}`}</span>
        <span className='weight section'>{' | '}&#215;{weight}</span>
        <div className='plus'>+</div>
      </div>
    );
  }
}

const renderTypeAndName = (unit, childrenData) => {
  const unitDetail = _.find(childrenData, (item) => item.child.id === unit.id);
  if (unitDetail) {
    if (unitDetail.child.action) {
      // 无埋点事件的类型由type和action两个字段共同决定
      const type = typeDict[`${unitDetail.type}-${unitDetail.child.action}`];
      const name = unitDetail.child.name;
      return { type, name };
    } else {
      const type = typeDict[unitDetail.type];
      // 如果children接口返回的数据中没有name字段，说明这个子事件可能是一个预定义指标
      const name = unitDetail.child.name || specialPreparedMetricsName[unitDetail.child.id];
      return { type, name };
    }
  } else if (specialPreparedMetricsName[unit.id]) {
    // 如果从接口返回的数据中没有某一个时间的详细信息，有可能这个事件是一个预定义指标
    const type = '预定义指标';
    const name = specialPreparedMetricsName[unit.id];
    return { type, name };
  } else {
    return { type: 'deleted', name: '该指标已被删除或者您没有权限查看此指标' };
  }
}

//export default ComplexMetricDetail;
*/
export default () => (<div>ComplexMetricDetail</div>);
