import LocaleState from "@/interfaces/states/LocaleState";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state using that type
const initialState: LocaleState = {
    locale: "en",
};

export const setLocaleSlice = createSlice({
    name: "setLocale",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setLocale: (state, action: PayloadAction<LocaleState>) => {
            state.locale = action.payload.locale;
        },
    },
});

export const { setLocale } = setLocaleSlice.actions;

export default setLocaleSlice.reducer;
