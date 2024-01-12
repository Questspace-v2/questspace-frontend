import { createSlice } from '@reduxjs/toolkit';
import { IUserState } from './types/user-interfaces';
import { createUser, getUser } from './api-actions';

export const initialState: IUserState = {
    username: 'svayp11',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg',
};

export const userGlobalStateSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getUser.fulfilled, (state, action) => {
            state.username = action.payload.username;
            state.avatarUrl = action.payload.avatarUrl ?? 'haha';
        });
    }
});

export default userGlobalStateSlice.reducer;