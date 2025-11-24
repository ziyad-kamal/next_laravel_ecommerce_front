import TokenState from "@/interfaces/states/TokenState";
import { createSlice } from "@reduxjs/toolkit";

// Define the initial state using that type
const initialState: TokenState = {
    isUserToken: false,
    isAdminToken: false,
    isVendorToken: false,
};

export const setTokenSlice = createSlice({
    name: "setToken",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        userTokenSet: (state) => {
            state.isUserToken = true;
        },
        userTokenRemove: (state) => {
            state.isUserToken = false;
        },
        adminTokenSet: (state) => {
            state.isAdminToken = true;
        },
        adminTokenRemove: (state) => {
            state.isAdminToken = false;
        },
        VendorTokenSet: (state) => {
            state.isVendorToken = true;
        },
        VendorTokenRemove: (state) => {
            state.isVendorToken = false;
        },
    },
});

export const {
    userTokenSet,
    userTokenRemove,
    adminTokenSet,
    adminTokenRemove,
    VendorTokenSet,
    VendorTokenRemove,
} = setTokenSlice.actions;

export default setTokenSlice.reducer;
