import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserGlobalState } from './types/user-global-state';

export const initialState: IUserGlobalState = {
    userName: '',
    avatarUrl: '',
};

export const userGlobalStateSlice = createSlice({
    name: 'user_global_state_slice',
    initialState,
    reducers: {
        updateUser(state, action: PayloadAction<IUserGlobalState>) {
            state.userName = action.payload.userName;
            state.avatarUrl = action.payload.avatarUrl;
        },
    }
});

export default userGlobalStateSlice.reducer;