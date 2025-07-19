import { configureStore } from "@reduxjs/toolkit";
import displayToastReducer from "../redux/DisplayToast";
import setTokenReducer from "../redux/SetToken";

// ...

export const makeStore = () => {
    return configureStore({
        reducer: {
            displayToast: displayToastReducer,
            setToken: setTokenReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
