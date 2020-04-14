import React from 'react';
import Icon from '@gio-design/icon';
import styled from 'styled-components';
import { IExpression, IExpressionOP } from '../type';
import Condition from '../Condition';
import Add from './icon/Add';
import Subtract from './icon/Subtract'
import { get, isEmpty } from 'lodash';
import { IMeasurement } from '@/pages/root/types';
import OPSelect from './OPSelect';

interface Props {
  exprs: IExpression[]
  hideOp?: boolean
  addConditionDisabled?: boolean
}

const Denominator = ({exprs, hideOp, addConditionDisabled}: Props) => {
  const DenoExprs: IExpression[] = get(exprs, '[1].exprs')
  if (isEmpty(DenoExprs)) return null

  return (
    <Wrapper>
      {DenoExprs && DenoExprs.map((expr, index) => {
        const Op = expr.op === IExpressionOP.ADD ? <Add /> : <Subtract />
        return (
          <>
            {index === 0 ? null : <div><OPSelect value={expr.op} conditionIndex={index} type='denominator' disableSelect={hideOp}/></div>}
            <Condition
              measurement={expr.measurements[0]}
              conditionIndex={index}
              key={index}
              op={expr.op}
              alias={'B' + (index + 1)}
              type='denominator'
              hideOp={hideOp}
              addConditionDisabled={addConditionDisabled}
            />
          </>
        )
      })}
    </Wrapper>
  );
};

export default Denominator;

const Wrapper = styled.div`
  position: relative;
  padding: 10px 12px;
  /* margin-right: 70px; */
  border-radius: 6px;
  background-color: #F5F6FA;
`
