import { createSlice } from '@reduxjs/toolkit';
import { IUserState } from './types/user-interfaces';
import { createUser } from './api-actions';

export const initialState: IUserState = {
    username: 'unknown name',
    avatarUrl: 'some url',
};

export const userGlobalStateSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(createUser.fulfilled, (state, action) => {
            state.username = action.payload.username;
            state.avatarUrl = action.payload.avatarUrl;
        });
    }
});

export default userGlobalStateSlice.reducer;
