/**
 * 操作符
 * @author zongqi wei
 * @desc 根据设计图 https://projects.invisionapp.com/d/main#/console/13164780/293426854/inspect
 */
export interface Operator {
    id: string,
    value: string,
    zh: string,
    en: string
}
export enum eq {
    id = '1',
    value = '=',
    zh = '= 等于',
    en = '= equal to'
}
export enum lt {
    id = '2',
    value = '<',
    zh = '< 小于',
    en = '< less than'
}
export enum gt {
    id = '3',
    value = '>',
    zh = '> 大于',
    en = '> greater than'
}
export enum eqGt {
    id = '4',
    value = '>=',
    zh = '>= 大于等于',
    en = '>= greater than or equal to'
}
export enum eqLt {
    id = '5',
    value = '<=',
    zh = '<= 小于等于',
    en = '<= less than or equal to'
}
export enum neq {
    id = '6',
    value = '!=',
    zh = '!= 不等于',
    en = '!= unequal to'
}
export enum between {
    id = '7',
    value = 'between',
    zh = 'between 在m和n之间[m,n]',
    en = 'between'
}
export enum isIn {
    id = '8',
    value = 'in',
    zh = 'in 在...范围内',
    en = 'in'
}
export enum notIn {
    id = '9',
    value = 'not in',
    zh = 'not in 不在范围内',
    en = 'not in'
}
export enum glob {
    id = '10',
    value = '*',
    zh = '* 通配',
    en = '* glob'
}
export enum notGlob {
    id = '11',
    value = '!*',
    zh = '!* 不通配',
    en = '* not glob'
}
export enum like {
    id = '12',
    value = 'like',
    zh = 'like 包含',
    en = 'like'
}
export enum notLike {
    id = '13',
    value = 'not like',
    zh = 'not like 不包含',
    en = 'not like'
}
export enum ltWith0 {
    id = '14',
    value = '<',
    zh = '< 小于，包含 0，[0,X)',
    en = '< less than, [0,X)'
}
export enum eqLtWith0 {
    id = '15',
    value = '<=',
    zh = '<= 小于等于，包含 0，[0,X]',
    en = '<= less than or equal to, [0,X]'
}

export default [
    eq,
    lt,
    gt,
    eqGt,
    eqLt,
    neq,
    between,
    isIn,
    notIn,
    glob,
    notGlob,
    ltWith0,
    eqLtWith0
]

export const numberOPWith0: Operator[] = [eq, gt, ltWith0, eqGt, eqLtWith0, between]
export const eventNumberOP: Operator[] = [eq, lt, gt, eqGt, eqLt, between]
export const eventStringOP: Operator[] = [eq, neq, isIn, notIn]
export const dimensionOP: Operator[] = [eq, neq, isIn, notIn, like, notLike]
export const userFilterOP: Operator[] = [like, notLike]
export const userFilterExceptEqOp: Operator[] = [neq, isIn, notIn, like, notLike]
