import React from 'react';
import { useQuery} from 'react-apollo-hooks';
import { IMeasurement, IValueType  } from 'src/pages/root/types';
import { MEASUREMENTS } from 'src/components/EventPicker';
import { get } from 'lodash';


export const preparedEvents = [
  {
    id: 'uc',
    type: 'prepared',
    name: '用户量',
    attribute: '',
    aggregator: 'distinct',
    selectKey: 'prepared-uc'
  }
]
interface Props {
  disabled?: boolean
  measurement: IMeasurement
  setValueType?: (valueType: IValueType) => void
  conditionIndex: number
  type: string
  hideOp?: boolean
}

const ExprEventSelect = (props: Props) => {
  const { loading, error, data: eventsQuery, refetch } = useQuery(MEASUREMENTS, { fetchPolicy: 'cache-and-network' });
  const measurements = [...preparedEvents, ...get(eventsQuery, 'measurements', [])];
  const selectedMeasurement = [
    ...get(eventsQuery, 'preparedMetrics', []),
    ...measurements
  ].find((m) => m.id === props.measurement.id)

  return (selectedMeasurement && selectedMeasurement.name) || '事件已删除'
}

export default ExprEventSelect;
