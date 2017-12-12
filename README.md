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
  TYPE
  actionCreator,
  actionCreatorFactory
} from 'redux-action-creators';

// Normal action creators
export const openDrawer = actionCreator('OPEN_DRAWER');
export const closeDrawer = actionCreator('CLOSE_DRAWER');

// Normal action creator with some functionality
export const openModal = actionCreator('OPEN_MODAL', payload => {
  console.log(payload);

  // You can override standard action object here:
  // return { type: openModal[TYPE], meta: { section: 'main' } }
});

// Then just dispatch an action with some payload
store.dispatch(signOut({ msg: 'Bye!' }));

// asyncActionCreator
export const START = Symbol('START');
export const END = Symbol('END');
export const SUCCESS = Symbol('SUCCESS');
export const FAILURE = Symbol('FAILURE');

export const asyncActionCreator = actionCreatorFactory({
  subTypes: { START, END, SUCCESS, FAILURE }
});

// Async action with redux-thunk
export const signIn = asyncActionCreator('signIn', payload => (dispatch) => {
  const { username, password } = payload;

  dispatch(signIn[START]());

  // api is an axios instance with interceptors: const api = axios.create({ baseURL: apiRoot });
  api.post(API_SIGN_IN, { username, password }).then(
    (response) => {
      const { token, email, avatar } = response.data;
      localStorage.setItem('auth_token', token);
      dispatch(signIn[END]());
      dispatch(signIn[SUCCESS]({ email, avatar }));
    },
    (error) => {
      dispatch(signIn[END]());
      dispatch(signIn[FAILURE]({ error.message }));
    }
  );
});

// Sync thunkActionCreator
export const CALL = Symbol('CALL');
export const thunkActionCreator = actionCreatorFactory({
  subTypes: { CALL }
});

// Later in your code...
export const displayError = thunkActionCreator('DISPLAY_ERROR', payload => (dispatch) => {
  const { error, message } = payload;
  dispatch(displayError[CALL]());
  dispatch(openSnackbar({
    message: error
      ? String(error)
      : message || 'Unknown error'
  }));
});

// Custom async action creator with sub-types and prefix
export const CREATE = Symbol('CREATE');
export const READ = Symbol('READ');
export const UPDATE = Symbol('UPDATE');
export const DELETE = Symbol('DELETE');

export const crudActionCreator = actionCreatorFactory({
  actionCreator: asyncActionCreator, {
  subTypes: { CREATE, READ, UPDATE, DELETE }
  prefix: '@@app/'
}); // You can use prefixes

// Create async crud actionCreator
const todo = crudActionCreator('todo');

// Complex ajax action creator with map of sub-types
export const REQUEST = Symbol('REQUEST');
export const ERROR = Symbol('ERROR');
export const NORMAL = Symbol('NORMAL');
export const TIMEOUT = Symbol('TIMEOUT');
export const CANCEL = Symbol('CANCEL');

const _requestActionCreator = actionCreatorFactory({
  subTypes: { START, SUCCESS, END }
});

const _errorActionCreator = actionCreatorFactory({
  subTypes: { NORMAL, TIMEOUT, CANCEL, FAILURE }
});

export const ajaxActionCreator = actionCreatorFactory({
  subTypes: [
    [_requestActionCreator, { REQUEST }],
    [_errorActionCreator, { ERROR }],
  ]
});

const fetchUser = ajaxActionCreator('FETCH_USER')

// In reducer:
switch(action.type) {
  case todo[CREATE][START][TYPE]:
    //...
  // You can use $$ alias for TYPE (import it first)
  case todo[CREATE][SUCCESS][$$]:
    //...
  case signIn[START][$$]:
    return { ...state, fetching: true };
  case signIn[END][$$]:
    return { ...state, fetching: false };
  case signIn[SUCCESS][$$]:
    return { ...state, user: action.payload };
  case displayError[CALL][TYPE]:
    //...
  case openSnackbar[TYPE]:
    //...
  case openDrawer[TYPE]:
    //...
  case closeDrawer[TYPE]:
    //...
  case fetchUser[REQUEST][START][$$]:
    //...
  case fetchUser[ERROR][NORMAL][$$]:
    //...
}
```

## Author

@doasync
