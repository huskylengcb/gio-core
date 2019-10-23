import shallowEqualArray from './shallowEqualArray';
import deepEqualArray from './deepEqualArray';

export default (func: (...args: any[]) => any, isDeep: boolean = false): (...args: any[]) => any => {
  let lastArgs: any[];
  let lastValue: any;

  return (...args) => {
    if (isDeep ? deepEqualArray(args, lastArgs) : shallowEqualArray(args, lastArgs)) {
      return lastValue;
    }
    lastArgs = args;
    lastValue = func(...Array.from(args));
    return lastValue;
  }
}
