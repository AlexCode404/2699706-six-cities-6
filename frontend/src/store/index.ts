import { configureStore } from '@reduxjs/toolkit';

import { createAPI } from '../api';
import { rootReducer } from './root-reducer';
import { fetchOffers, fetchFavoriteOffers, fetchUserStatus } from './action';
import history from '../history';
import { Token } from '../utils';
import { AuthorizationStatus } from '../const';
import { setAuthorizationStatus } from './user-process/user-process';

const api = createAPI();
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        api,
        history
      },
    },
  }),
});

store.dispatch(fetchOffers());

if (Token.get()) {
  store.dispatch(fetchUserStatus());
  store.dispatch(fetchFavoriteOffers());
} else {
  store.dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
}

export default store;
