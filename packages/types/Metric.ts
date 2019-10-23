export default interface Metric {
  id: string,
  level?: LevelType,
  action?: ActionType,
  actions?: ActionType[],
  // action: imp_cuont 这种将被废弃，度量方式拆分为 measure
  // measure: 'count' | 'distinct' | 'average';
  name?: string,
  groupName?: string,
  selectKey?: string,
  type?: string
}

export type LevelType = 'expression' | 'original' | 'complex' | 'dash' | 'simple';
export type ActionType = 'page' | 'imp' | 'clck' | 'chng' | 'sbmt'
                         // 兼容旧格式
                         | 'count'
                         | 'page_count' | 'page_distinct' | 'imp_count' | 'imp_distinct'
                         | 'chng_count' | 'chng_distinct' | 'sbmt_count' | 'sbmt_distinct';
