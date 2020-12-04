import React from 'react';
import _ from 'lodash';
//import Loading from 'giodesign/utils/Loading';
import { get, isEmpty, update, cloneDeep, set } from 'lodash';
import { useQuery } from 'react-apollo-hooks';
import Compute from './Compute';
import gql from 'graphql-tag';

const Loading = (<div>Loading...</div>);

const ComplexMetricDetail = (props: any) => {
  const { event, labelList, cache, setCache, deleteCache } = props;
  const name = get(event, 'name');
  const description = get(event, 'description')

  return (
    <React.Fragment>
      {
        description && (
          <div className='row prepared-metric-description'>
            <span>描述</span>
            <span className='text'>{description}</span>
          </div>
        )
      }
      <div>
        <span>计算方式</span>
        <ComplexMetricCondition data={{ id: event.id }}/>
      </div>
    </React.Fragment>
  )
}
export default ComplexMetricDetail;

const ComplexMetricCondition = (props: any) => {
  const { data: { id }} = props
  const { data: detail } = useQuery(getComplexMetricByIdGQL, { variables: { id, projectId: window.project.id }, skip: !id } )
  const complexMetric = detail && detail.complexMetric

  if (!complexMetric) {
    return null
  }

  const newComplexMetric = tranformOriginData(complexMetric)

  return (
    <Compute expression={newComplexMetric.expression} mode={'listDetail'} />
  );
};


const tranformOriginData = (complexMetric: any) => {
  const newComlexMetric = cloneDeep(complexMetric)
  if (get(newComlexMetric, 'expression.op') === '+') {
    update(newComlexMetric, 'expression', (expr) => {
     return { exprs: [transformMeasurementsToInnerExprs(expr)], op: '/', measurements: [], __typename: hashTypename('expression') }
    })
    set(newComlexMetric, 'expression.exprs[1]', ({
      op: '+', exprs: [], measurements: [], __typename: hashTypename('expression')
    }))
  }

  update(newComlexMetric, 'expression.exprs', (exprs) => {
    return exprs.map((expr: any) => {
      return transformMeasurementsToInnerExprs(expr)
    })
  })

  return newComlexMetric
}

const getComplexMetricByIdGQL = gql`
  query complexMetric($id: HashId!, $projectId: HashId!) {
    complexMetric(id: $id, projectId: $projectId) {
      id
      isSystem
      creatorId
      createdAt
      updaterId
      updatedAt
      creator
      updater
      name
      description
      expression {
        op
        measurements {
          type
          id
          attribute
          aggregator
          weight
        }
        exprs {
          op
          measurements {
            type
            id
            attribute
            aggregator
            weight
          }
          exprs {
            op
            measurements {
              type
              id
              attribute
              aggregator
              weight
            }
          }
        }
      }
    }
  }
`

const transformMeasurementsToInnerExprs = (expr: any) => {
  if (!isEmpty(expr.measurements)) {
    expr.exprs = ((expr && expr.measurements) || []).map((m) => ({
      op: m.weight === -1.0 ? IExpressionOP.SUBTRACT : IExpressionOP.ADD,
      measurements: [m],
      exprs: [],
      __typename: hashTypename('expression')
    }))
    expr.measurements = []
  }
  return expr
}

const hashTypename = (typename: string) => {
  return typename.slice() + grRandomString(4)
}

const grRandomString = (length: number) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

enum IExpressionOP {
  ADD = '+',
  SUBTRACT = '-',
  DIVIDE = '/'
}
