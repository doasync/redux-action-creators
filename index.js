
export const TYPE = Symbol('TYPE');
export const $$ = TYPE;

export const actionCreator = (type, fn) => {
  if (typeof type !== 'string' || !type) {
    throw new Error('Action type should be a non-empty string');
  }
  const $actionCreator = (payload, meta) => {
    const action = meta !== undefined ? { type, payload, meta } : { type, payload };
    const result = fn !== undefined ? fn(payload, meta) : undefined;
    return result !== undefined ? result : action;
  };
  return Object.defineProperty($actionCreator, TYPE, { value: type });
};

const createSubs = (subCreator, subTypes, parentType) => Object.entries(subTypes).reduce(
  (result, [symbolName, symbol]) => {
    if (typeof symbolName === 'string' && typeof symbol === 'symbol') {
      result[symbol] = subCreator(`${parentType}[${symbolName}]`);
    } else {
      throw new Error('Sub-type item should have a string key and a symbol value');
    }
    return result;
  },
  {}
);

export const actionCreatorFactory = (params = {}) => (type, fn) => {
  const {
    actionsCreator: subCreator = actionCreator,
    subTypes,
    prefix = ''
  } = params;

  const parentType = `${prefix}${type}`;
  const $actionCreator = actionCreator(parentType, fn);

  if (Array.isArray(subTypes)) {
    const subs = subTypes.reduce((result, [specSubCreator, specSubTypes]) => {
      const specSubs = createSubs(specSubCreator, specSubTypes, parentType);
      return Object.assign(result, specSubs);
    }, {});
    Object.assign($actionCreator, subs);
  } else if (typeof subTypes === 'object' && subTypes !== null) {
    const subs = createSubs(subCreator, subTypes, parentType);
    Object.assign($actionCreator, subs);
  } else {
    throw new Error('subTypes should be an object or array');
  }
  return $actionCreator;
};
