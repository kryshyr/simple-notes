import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    username: string | null;
}

// initial state for authentication
const initialState: AuthState = {
    isAuthenticated: false,
    username: null,
};

// Redux slice for authentication
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // action to log in user
        login: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = true;
            state.username = action.payload; // set username from payload
        },
        // action to log out user
        logout: (state) => {
            state.isAuthenticated = false;
            state.username = null; // Clear username
        },
    },
});

// to export the actions for use in components
export const { login, logout } = authSlice.actions;
// to export the reducer to be included in the store
export default authSlice.reducer;
