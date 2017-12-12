
export const TYPE = Symbol('TYPE');
export const $$ = TYPE;

export const actionCreator = (type, fn) => {
  if (typeof type !== 'string' || !type) {
    throw new Error('Action type should be a non-empty string');
  }
  const $actionCreator = (payload, meta) => {
    const action = meta !== undefined ? { type, payload, meta } : { type, payload };
    const result = fn !== undefined ? fn(action) : undefined;
    return result !== undefined ? result : action;
  };
  return Object.defineProperty($actionCreator, TYPE, { value: type });
};

export const actionCreatorFactory = (params = {}) => (type, fn) => {
  const {
    actionsCreator: subActionsCreator = actionCreator,
    subTypes,
    prefix = ''
  } = params;
  const $actionCreator = actionCreator(`${prefix}${type}`, fn);
  const subs = Object.entries(subTypes).reduce((result, [symbolName, symbol]) => {
    if (typeof symbol === 'symbol') {
      result[symbol] = subActionsCreator(`${prefix}${type}[${symbolName}]`);
    } else {
      throw new Error(`Sub-type ${symbolName} should be a symbol`);
    }
    return result;
  }, {});
  return Object.assign($actionCreator, subs);
};
