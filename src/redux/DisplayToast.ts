import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ToastState from "@/interfaces/ToastState";
import ToastPayload from "@/interfaces/ToastPayload";

// Define the initial state using that type
const initialState: ToastState = {
    isVisible: false,
    type: "success",
    message: "",
};

export const displayToastSlice = createSlice({
    name: "displayToast",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        display: (state, action: PayloadAction<ToastPayload>) => {
            state.isVisible = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        hide: (state) => {
            state.isVisible = false;
        },
    },
});

export const { display, hide } = displayToastSlice.actions;

export default displayToastSlice.reducer;
