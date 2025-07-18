import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import gridReducer from "./reducer";
import rootSaga from "./sagas";
import { combineReducers } from "redux";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  grid: gridReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
