
// 例: city = 北京
export default interface FilterExpression {
  key: string,
  op: string,
  value: string,
  name?: string,
  symbol?: string
};

export const defaultFilterExpression: FilterExpression = {
  key: undefined,
  op: '=',
  value: undefined
};
