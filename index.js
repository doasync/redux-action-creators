import { TYPE, START, SUCCESS, FAILURE } from './symbols';

export const actionCreator = (type, fn) => {
  if (typeof type !== 'string' || !type) {
    throw new Error('Action type is required [string]');
  }
  const $actionCreator = (payload, meta) => {
    const action = { type, payload, meta };
    return fn ? fn(action) || action : action;
  };
  return Object.defineProperty($actionCreator, TYPE, { value: type });
};

export const actionCreatorFactory = (customActionCreator, subTypes, prefix = '') => (type, fn) => {
  const $actionCreator = actionCreator(`${prefix}${type}`, fn);
  const subs = Object.entries(subTypes).reduce((result, [symbolName, symbol]) => {
    if (typeof symbol === 'symbol') {
      result[symbol] = customActionCreator(`${prefix}${type}[${symbolName}]`);
    } else {
      throw new Error('You should use symbols for subTypes');
    }
    return result;
  }, {});
  return Object.assign($actionCreator, subs);
};

export const asyncActionCreator = actionCreatorFactory(actionCreator, {
  START, SUCCESS, FAILURE
});
