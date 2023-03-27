import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userSelector from '../reducers/userSlice';

const combinedReducer = combineReducers({
  user: userSelector,
});

// 로그아웃 했을 경우에만 state 초기화
const rootReducer = (state: any, action: any) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
