import { configureStore } from "@reduxjs/toolkit";
import displayToastReducer from "../redux/DisplayToast";
import displayModalReducer from "../redux/DisplayModal";
import setTokenReducer from "../redux/SetToken";
import setLocaleReducer from "../redux/setLocale";

// ...

export const makeStore = () => {
    return configureStore({
        reducer: {
            displayToast: displayToastReducer,
            displayModal: displayModalReducer,
            setToken: setTokenReducer,
            setLocale: setLocaleReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
