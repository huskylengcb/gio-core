export interface IComplexMetric {
  id: string
  name: string
  description?: string
  expression: IExpression
  isSystem: boolean
  creatorId: string
  createdAt: string
  updaterId?: string
  updatedAt?: string
  creator: string
  updater: string
}

export interface IExpression {
  op: IExpressionOP,
  exprs: IExpression[],
  measurements: IMeasurement[]
}

export enum IExpressionOP {
  ADD = '+',
  SUBTRACT = '-',
  DIVIDE = '/'
}

export interface IMeasurement {
  __typename?: string
  id: string
  type: string
  action?: string
  filter?: any
  attribute?: string | null
  aggregator?: string
  name?: string
  attributes?: Array<{id: string, name: string, valueType: string}>
  weight?: number
}
