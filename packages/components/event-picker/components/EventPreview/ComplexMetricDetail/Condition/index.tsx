import React from 'react';
import {
  Wrapper,
  ConditionWrapper,
  Divide,
  Conditions,
} from 'src/components/styled/ComputeEditStyles';
import ExprVarSelect from './ExprVarSelect';
import ExprEventSelect from './ExprEventSelect';
import { IMeasurement } from 'src/pages/root/types';
import { IExpressionOP } from '../type';

interface Props {
  // prefix: string
  // enableAddOr: boolean
  conditionIndex: number
  deleteDisabled: boolean
  disabled?: boolean
  measurement: IMeasurement
  op: IExpressionOP
  alias: string
  type: string
  hideOp?: boolean
  addConditionDisabled?: boolean
}

const Condition = (props: Props) => {
  const { alias, conditionIndex, deleteDisabled, disabled, type, measurement, hideOp } = props;
  const ExprVarDisabled = (props.conditionIndex !== 0 && measurement.aggregator !== 'sum')
  const divide = props.hideOp && measurement.type !== 'prepared' ? <Divide /> : null
  const varComp = measurement.type === 'prepared' ? null : (
    <ExprVarSelect
      disabled={ExprVarDisabled}
      measurement={measurement}
      conditionIndex={conditionIndex}
      type={type}
      hideOp={hideOp}
    />
  )

  const tail = measurement.aggregator === 'sum' ? '的加和' : null

  return (
    <Wrapper>
      <ConditionWrapper>
        <Conditions>
          <ExprEventSelect
            disabled={disabled}
            measurement={measurement}
            conditionIndex={conditionIndex}
            type={type}
            hideOp={hideOp}
          />
          {divide}
          {varComp}
          {tail}
        </Conditions>
      </ConditionWrapper>
    </Wrapper>
  );
};

export default Condition;

