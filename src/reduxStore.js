import * as redux from 'redux';

import reducer from './redux';

let reduxStore;

/**
 * Get a reference to our redux store. If it doesn't exist yet, create it.
 */
export function getStore() {
  if (!reduxStore) {
    reduxStore = redux.createStore(reducer);
  }

  return reduxStore;
}
