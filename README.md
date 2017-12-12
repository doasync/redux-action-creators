# Redux action creators

Configurable action creators for redux with sub-types

[![NPM Version][npm-image]][npm-url] ![NPM Downloads][downloads-image] [![GitHub issues][issues-image]][issues-url] [![Licence][license-image]][license-url]

[npm-image]: https://img.shields.io/npm/v/redux-action-creators.svg
[npm-url]: https://www.npmjs.com/package/redux-action-creators
[downloads-image]: https://img.shields.io/npm/dw/redux-action-creators.svg
[deps-image]: https://david-dm.org/doasync/redux-action-creators.svg
[issues-image]: https://img.shields.io/github/issues/doasync/redux-action-creators.svg
[issues-url]: https://github.com/doasync/redux-action-creators/issues
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/doasync/redux-action-creators/master/LICENSE

See source code for more information ;)

## Installation

Install it globally:

```bash
npm install --save redux-action-creators
```

## Usage

```javascript

import {
  actionCreator,
  START, SUCCESS, FAILURE,
  asyncActionCreator
} from 'redux-action-creators';

// Normal action creators
export const openDrawer = actionCreator('openDrawer');
export const closeDrawer = actionCreator('closeDrawer');

// asyncActionCreator (included in the package)
export const asyncActionCreator = actionCreatorFactory(actionCreator, {
  START, SUCCESS, FAILURE
});

// Async action creator with some functionality
export const signOut = asyncActionCreator('signOut', ({ payload }) => {
  console.log(payload);
});

// Then just dispatch an action with some payload
store.dispatch(signOut({ msg: 'Bye!' }));

// With redux-thunk
export const signIn = asyncActionCreator('signIn', ({ type, payload }) => (dispatch) => {
  const { username, password } = payload;

  dispatch(type[START]());

  return api.post(API_SIGN_IN, { username, password }).then((response) => {
    const { token, email, avatar } = response.data;
    localStorage.setItem('auth_token', token);
    dispatch(type[SUCCESS]({ email, avatar }));
  }).catch(({ message }) => {
    dispatch(type[FAILURE]({ message }));
  });
});

// Custom async action creator with sub-types
export const CREATE = Symbol('CREATE');
export const READ = Symbol('READ');
export const UPDATE = Symbol('UPDATE');
export const DELETE = Symbol('DELETE');

export const crudActionCreator = actionCreatorFactory(asyncActionCreator, {
  CREATE, READ, UPDATE, DELETE
});

export const todo = crudActionCreator('todo');

// In reducer:
switch(action.type) {
  case todo[CREATE][START]:
    //...
  case todo[CREATE][SUCCESS]:
    //...
  case signIn[FAILURE]:
    //...
  case openDrawer:
  //...
  case closeDrawer:
  //...
}
```

## Author

@doasync
