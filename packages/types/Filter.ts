import FilterExpression from './FilterExpression';

export default interface Filter {
  op: 'and', // 表达式之间的逻辑关系符， 'or' 将被废弃，只允许 'and'
  exprs: FilterExpression[]
}

export const defaultFilter: Filter = {
  op: 'and',
  exprs: undefined
}
