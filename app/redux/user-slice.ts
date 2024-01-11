import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserGlobalState } from './types/user-global-state';
import { createUser, getUser } from './api-actions';

export const initialState: IUserGlobalState = {
    username: '',
    avatarUrl: '',
};

export const userGlobalStateSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getUser.fulfilled, (state, action) => {
            state.username = action.payload.username;
            state.avatarUrl = action.payload.avatarUrl ?? '';
        })
        .addCase(createUser.fulfilled, (state) => {
            
        })
    }
});

export default userGlobalStateSlice.reducer;