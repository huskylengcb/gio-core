export const baseOperationSelects = [
  {
    key: '=',
    name: '= 等于'
  },
  {
    key: '!=',
    name: '!= 不等于'
  },
  {
    key: '<',
    name: '< 小于'
  },
  {
    key: '<=',
    name: '<= 小于等于'
  },
  {
    key: '>',
    name: '> 大于'
  },
  {
    key: '>=',
    name: '>= 大于等于'
  },
  {
    key: 'between',
    name: 'between 区间'
  },
]
export const IntOperationSelects = [
  ...baseOperationSelects,
  {
    key: 'isNotNaN',
    name: '有值'
  },
  {
    key: 'isNaN',
    name: '没值'
  }
]

export const DateOperationSelects = [
  {
    key: '=',
    name: '= 等于'
  },
  {
    key: '!=',
    name: '!= 不等于'
  },
  {
    key: '<',
    name: '< 在某天之前'
  },
  {
    key: '<=',
    name: '<= 在某天之前（包括当天）'
  },
  {
    key: '>',
    name: '> 在某天之后'
  },
  {
    key: '>=',
    name: '>= 在某天之后（包括当天）'
  },
  {
    key: 'between',
    name: 'between 区间'
  },
  {
    key: 'relativeNow',
    name: '相对现在'
  },
  {
    key: 'relativeBetween',
    name: '相对区间'
  },
  {
    key: 'isNotNaN',
    name: '有值'
  },
  {
    key: 'isNaN',
    name: '没值'
  }
]

export const StringOperationSelections = [
  {
    key: '=',
    name: '= 等于'
  },
  {
    key: '!=',
    name: '!= 不等于'
  },
  {
    key: 'in',
    name: 'in 在…范围内'
  },
  {
    key: 'not in',
    name: 'not in 不在范围内'
  },
  {
    key: 'like',
    name: 'like 包含'
  },
  {
    key: 'not like',
    name: 'not like 不包含'
  },
  {
    key: 'isNotNaN',
    name: '有值'
  },
  {
    key: 'isNaN',
    name: '没值'
  }
]


export const OperationSelects = [
  {
    key: '=',
    name: '= 等于'
  },
  {
    key: '!=',
    name: '!= 不等于'
  },
  {
    key: 'in',
    name: 'in 在…范围内'
  },
  {
    key: 'not in',
    name: 'not in 不在范围内'
  },
  {
    key: 'like',
    name: 'like 包含'
  },
  {
    key: 'not like',
    name: 'not like 不包含'
  }
]
