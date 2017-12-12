
export const actionCreatorFactory = (actionCreator, subTypes) => (name, fn) => {
  const $actionCreator = actionCreator(name, fn);
  const subs = Object.entries(subTypes).reduce((result, [symbolName, symbol]) => {
    if (typeof symbol === 'symbol') {
      result[symbol] = actionCreator(`${name}[${symbolName}]`);
    } else {
      throw new Error('You should use symbols for subTypes');
    }
    return result;
  }, {});
  return Object.assign($actionCreator, subs);
};

export const actionCreator = (name, fn) => {
  const $actionCreator = (payload) => {
    const action = { type: $actionCreator, payload };
    return fn ? fn(action) || action : action;
  };
  $actionCreator.displayName = name;
  return $actionCreator;
};

export const START = Symbol('START');
export const SUCCESS = Symbol('SUCCESS');
export const FAILURE = Symbol('FAILURE');

export const asyncActionCreator = actionCreatorFactory(actionCreator, {
  START, SUCCESS, FAILURE
});
