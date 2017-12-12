
export const actionCreator = (type, fn) => {
  if (typeof type !== 'string' || !type) {
    throw new Error('Action type string is required');
  }
  const $actionCreator = (payload, meta) => {
    const action = { type, payload, meta };
    return fn ? fn(action) || action : action;
  };
  return Object.defineProperty(
    $actionCreator,
    'type',
    { value: type }
  );
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

export const START = Symbol('START');
export const SUCCESS = Symbol('SUCCESS');
export const FAILURE = Symbol('FAILURE');

export const asyncActionCreator = actionCreatorFactory(actionCreator, {
  START, SUCCESS, FAILURE
});
