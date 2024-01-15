import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userGlobalStateSlice } from './user-slice';
import { createAPI } from '../api/api';


export const api = createAPI();

export const store = configureStore({
    reducer: {
        [userGlobalStateSlice.name]: userGlobalStateSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
