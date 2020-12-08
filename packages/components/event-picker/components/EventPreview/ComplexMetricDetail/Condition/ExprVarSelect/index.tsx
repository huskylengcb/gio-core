import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { IMeasurement } from 'src/pages/root/types';
import { cloneDeep, get, some } from 'lodash';
import { preparedEvents } from '../ExprEventSelect';
import gql from 'graphql-tag';

const MEASUREMENTS = gql`
  query measurements($projectId: HashId!) {
    measurements(projectId: $projectId) {
      id
      name
      type
      action
      elementId
      valueType
      platforms
      labels
      favorites
      attributes {
        id
        name
        valueType
      }
      isComplexDistinct
    }
  }
`;

interface Props {
  disabled?: boolean
  measurement: IMeasurement
  conditionIndex: number
  type: string
  hideOp?: boolean
}

const ExprVarSelect = (props: Props) => {
  const { loading, error, data: eventsQuery, refetch } = useQuery(MEASUREMENTS, { variables: { projectId: window.project.id }, fetchPolicy: 'no-cache' });
  const measurementList = [...preparedEvents, ...get(eventsQuery, 'measurements', [])];

  if (props.measurement.aggregator === 'distinct') {
    return '人数'
  } else if (props.measurement.aggregator === 'count' || props.measurement.attribute === 'count') {
    return '次数'
  } else {
    const selectedMeasurement = measurementList.find((m) => m.id === props.measurement.id)
    const attr = get(selectedMeasurement, 'attributes', []).find((attr: any) => attr.id === props.measurement.attribute)
    return (attr && attr.name) || '属性已删除'
  }
}

export default ExprVarSelect;
