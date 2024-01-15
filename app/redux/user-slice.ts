import { createSlice } from '@reduxjs/toolkit';
import { IUserState } from './types/user-interfaces';
import { getUser } from './api-actions';

export const initialState: IUserState = {
    username: 'unknown name',
    avatarUrl: 'some url',
    error: null,
};

export const userGlobalStateSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getUser.fulfilled, (state, action) => {
            state.username = action.payload.username;
            state.avatarUrl = action.payload.avatarUrl;
            state.error = null;
        });
    }
});

export default userGlobalStateSlice.reducer;
