import React from 'react';
import styled from 'styled-components';
import Expression from './Expression';
import Denominator from './Denominator';
import Numerator from './Numerator';
import Divide from './icon/Divide';
import { IExpression } from '../type';
import { get, isEmpty } from 'lodash'
import { IMeasurement } from '@/pages/root/types';

interface Props {
  expression: IExpression
  mode?: 'edit' | 'show' | 'listDetail'
}

const Compute = ({ expression, mode = 'edit' }: Props) => {
  const exprs = expression && expression.exprs
  if(!exprs) return null

  const hasDenominator = !isEmpty(get(expression, 'exprs.1.exprs'))
  const hideOp = mode === 'listDetail' ? true : false

  const measurementCount = get(expression, 'exprs.0.exprs').length + get(expression, 'exprs.1.exprs').length
  const addConditionDisabled = measurementCount >= 100

  return (
    <>
      <ExpressionWrapper>
        <Expression exprs={expression.exprs} hideOp={hideOp} />
        <ConditionWrapper>
          <Numerator
            exprs={expression.exprs}
            hasDenominator={hasDenominator}
            hideOp={hideOp}
            addConditionDisabled={addConditionDisabled}
          />
          <DivideWrapper>
            {hasDenominator ? <Divide /> : null}
          </DivideWrapper>
          <Denominator
            exprs={expression.exprs}
            hideOp={hideOp}
            addConditionDisabled={addConditionDisabled}
          />
        </ConditionWrapper>
      </ExpressionWrapper>
    </>
  );
};

export default Compute;

const ExpressionWrapper = styled.div`
  box-sizing: border-box;
  /* border: 1px solid #DCDFED; */
  border-radius: 6px;
  background-color: #FFFFFF;
`

const DivideWrapper = styled.div`
  padding: 4px 12px;
`

const ConditionWrapper = styled.div`
  height: 85%;
  margin-top: 15px;
`

export const collectMeasurementIds = (exprs: IExpression[]) => {
  return (exprs && exprs.map((expr) => expr.measurements[0].id)) || []
}

export const checkAllMeasurementsWithNumberVariable = (values: string[], measurments: IMeasurement[], excludeIds: string[]) => {
  return values.every((id) => {
    if (!id || excludeIds.includes(id)) {
      return true
    }
    const measurement = measurments.find((m) => m.id === id)
    if (measurement && measurement.attributes) {
      return measurement.attributes.some((attr) => ['double', 'int'].includes(attr.valueType))
    }
    return false
  })
}
