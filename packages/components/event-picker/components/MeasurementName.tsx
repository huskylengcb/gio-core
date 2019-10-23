import React, { SFC } from 'react';
import { useMeasurementName } from '../hooks';

interface Props {
  measurement: any,
  showEventName?: boolean,
  visibleLength?: number
};

const MeasurementName: SFC<Props> = (props) => {
  const { name } = useMeasurementName(props);
  return (
    <span>{name}</span>
  );
}

export default MeasurementName;
