import { combineReducers, configureStore } from '@reduxjs/toolkit';
import dataSlice from './dataSlice';

const reducer = combineReducers({
  dataSlice: dataSlice.reducer,
});

const store = configureStore({
  reducer,
});

export default store;

export type IRootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
