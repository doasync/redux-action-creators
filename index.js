
export const TYPE = Symbol('TYPE');
export const $$ = TYPE;

export const actionCreator = (type, fn) => {
  if (typeof type !== 'string' || !type) {
    throw new Error('Action type is required [string]');
  }
  const $actionCreator = (payload, meta) => {
    const action = { type, payload, meta };
    const result = fn ? fn(action) : undefined;
    return result !== undefined ? result : action;
  };
  return Object.defineProperty($actionCreator, TYPE, { value: type });
};

export const actionCreatorFactory = (params = {}) => (type, fn) => {
  const { actionsCreator: subActionsCreator, subTypes, prefix } = params;
  const $actionCreator = actionCreator(`${prefix}${type}`, fn);
  const subs = Object.entries(subTypes).reduce((result, [symbolName, symbol]) => {
    if (typeof symbol === 'symbol') {
      result[symbol] = subActionsCreator(`${prefix}${type}[${symbolName}]`);
    } else {
      throw new Error('You should use symbols for subTypes');
    }
    return result;
  }, {});
  return Object.assign($actionCreator, subs);
};
