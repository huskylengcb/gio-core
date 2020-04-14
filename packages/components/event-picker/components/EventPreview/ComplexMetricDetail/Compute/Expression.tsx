import React from 'react';
import styled from 'styled-components';
import { IExpression } from '../../type';

interface Props {
  exprs: IExpression[]
  hideOp?: boolean
}

const Expression = (props: Props) => {
  if (props.hideOp) {
    return null
  }
  const NumeratorExprs = props.exprs[0].exprs
  const DenominatorExprs = props.exprs[1].exprs
  return (
    <Wrapper>
      {converExpressToString(NumeratorExprs, 'A')}
      {DenominatorExprs.length > 0 ? '÷' + converExpressToString(DenominatorExprs, 'B') : ''}
    </Wrapper>
  );
};

export default Expression;

const Wrapper = styled.div`
  line-height: 60px;
  min-height: 60px;
  margin-right: 70px;
  text-align: center;
  border-bottom: 1px solid #E7EAF9;
  margin-bottom: 15px;
`

const converExpressToString = (exprs: IExpression[], alias: string) => {
  if (exprs.length === 0) return ''
  if (exprs.length === 1) return alias + '1'
  return exprs.map((expr, index) =>
    (index === 0 ? '（' : expr.op) + ' '
      + alias
      + (index + 1)
      + (index === exprs.length - 1  ? ' ）' : ' ')
  ).join('')
}

