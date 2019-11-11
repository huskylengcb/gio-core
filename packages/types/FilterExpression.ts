
// 例: city = 北京
export default interface FilterExpression {
  key: string,
  op: string,
  values: string[],
  name?: string,
  symbol?: string
};

export const defaultFilterExpression: FilterExpression = {
  key: undefined,
  op: '=',
  values: []
};
