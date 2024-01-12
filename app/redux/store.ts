import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userGlobalStateSlice } from './user-slice';


export const store = configureStore({
    reducer: {
        [userGlobalStateSlice.name]: userGlobalStateSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
