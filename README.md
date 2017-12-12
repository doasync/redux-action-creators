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
  TYPE, START, SUCCESS, FAILURE,
  asyncActionCreator
} from 'redux-action-creators';

// Normal action creators
export const openDrawer = actionCreator('OPEN_DRAWER');
export const closeDrawer = actionCreator('CLOSE_DRAWER');

// asyncActionCreator (included in the package)
export const asyncActionCreator = actionCreatorFactory(actionCreator, {
  START, SUCCESS, FAILURE
});

// Normal action creator with some functionality
export const openModal = actionCreator('OPEN_MODAL', payload => {
  console.log(payload);

  // You can override standard action object:
  return { type: openModal[TYPE], meta: { section: 'main' }, payload: null }
});

// Async action creator with some functionality
export const signOut = asyncActionCreator('SIGN_OUT', (payload, meta) => {
  console.log(payload, meta);
});

// Then just dispatch an action with some payload
store.dispatch(signOut({ msg: 'Bye!' }));

// Async action with redux-thunk
export const signIn = asyncActionCreator('signIn', payload => (dispatch) => {
  const { username, password } = payload;

  dispatch(signIn[START]());

  api.post(API_SIGN_IN, { username, password }).then((response) => {
    const { token, email, avatar } = response.data;
    localStorage.setItem('auth_token', token);
    dispatch(signIn[SUCCESS]({ email, avatar }));
  }).catch(({ message }) => {
    dispatch(signIn[FAILURE]({ message }));
  });
});

// Custom async action creator with sub-types
export const CREATE = Symbol('CREATE');
export const READ = Symbol('READ');
export const UPDATE = Symbol('UPDATE');
export const DELETE = Symbol('DELETE');

export const crudActionCreator = actionCreatorFactory(asyncActionCreator, {
  CREATE, READ, UPDATE, DELETE
}, '@@app/'); // You can use prefixes

export const todo = crudActionCreator('todo');

// In reducer:
switch(action.type) {
  case todo[CREATE][START][TYPE]:
    //...
  // You can use $$ alias for TYPE (import it first)
  case todo[CREATE][SUCCESS][$$]:
    //...
  case signIn[FAILURE][$$]:
    //...
  case openDrawer[TYPE]:
  //...
  case closeDrawer[TYPE]:
  //...
}
```

## Author

@doasync
