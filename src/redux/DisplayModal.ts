import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ModalState from "../interfaces/states/ModalState";

// Define the initial state using that type
const initialState: ModalState = {
    isVisible: false,
    type: "update",
    disable: false,
};

export const displayModalSlice = createSlice({
    name: "displayModal",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        displayModal: (state, action: PayloadAction<ModalState>) => {
            state.isVisible = action.payload.isVisible;
            state.type = action.payload.type;
            state.disable = action.payload.disable;
        },
        hide: (state) => {
            state.isVisible = false;
        },
    },
});

export const { displayModal, hide } = displayModalSlice.actions;

export default displayModalSlice.reducer;
