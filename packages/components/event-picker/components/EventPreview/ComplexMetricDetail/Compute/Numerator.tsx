import React from 'react';
import Condition from '../Condition';
import { IExpression } from '../type';
import styled from 'styled-components';
import { get, isEmpty } from 'lodash';
import OPSelect from './OPSelect';

interface Props {
  exprs: IExpression[]
  hasDenominator: boolean
  hideOp?: boolean
  addConditionDisabled?: boolean
}

const Numerator = ({ exprs, hideOp, addConditionDisabled }: Props) => {
  const NumeratorExprs: IExpression[] = get(exprs, '[0].exprs')
  return (
    <Wrapper>
      <ExprsWrapper>
        {NumeratorExprs && NumeratorExprs.map((expr, index) => {
          return (
            <>
              {index === 0 ? null : <div><OPSelect value={expr.op} conditionIndex={index} type='numerator' disableSelect={hideOp} /></div>}
              <Condition
                measurement={expr.measurements[0]}
                conditionIndex={index}
                key={index}
                op={expr.op}
                alias={'A' + (index + 1)}
                type='numerator'
                hideOp={hideOp}
                deleteDisabled={index === 0}
                addConditionDisabled={addConditionDisabled}
              />
            </>
          )
        })}
      </ExprsWrapper>
      {/* <DivideIconWrapper /> */}
    </Wrapper>
  );
};

export default Numerator;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const ExprsWrapper = styled.div`
  position: relative;
  padding: 10px 12px;
  border-radius: 6px;
  background-color: #F5F6FA;
  flex-grow: 1;
`

// export const DivideIconWrapper = styled.div`
//   display: flex;
//   top: 42%;
//   right: -50px;
//   cursor: pointer;
//   align-items: center;
//   width: 70px;
//   justify-content: center;
// `
