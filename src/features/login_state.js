import { createSlice } from "@reduxjs/toolkit";

const initialState = { loginState: false }
export const loginSlice = createSlice({
    name: "loginState",
    initialState,
    reducer: {
        login: (state) => {
            state.loginState = true;
        },
        logout: (state) => {
            state.loginState = false;
        }
    }
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;