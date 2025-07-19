import TokenState from "@/interfaces/TokenState";
import { createSlice } from "@reduxjs/toolkit";

// Define the initial state using that type
const initialState: TokenState = {
    isToken: false,
};

export const setTokenSlice = createSlice({
    name: "setToken",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set: (state) => {
            state.isToken = true;
        },
        remove: (state) => {
            state.isToken = false;
        },
    },
});

export const { set, remove } = setTokenSlice.actions;

export default setTokenSlice.reducer;
