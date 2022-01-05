import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
    name: "loginState",
    initialState: false,
    reducer: {
        login: (state) => {
            state = true;
        },
        logout: (state) => {
            state = false;
        }
    },


});

export const {login, logout} = loginSlice.actions;
export default loginSlice.reducer;