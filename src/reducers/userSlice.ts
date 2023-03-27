import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Keychain from 'react-native-keychain';
import type {AxiosError} from 'axios';
import type {TLogin} from '../api/types/user';

import {interceptor, instance} from '../api';
import userApi from '../api/userApi';
import {TResponseError} from '../api/types/responseError';

export const getAccessToken = async () => {
  const result = await EncryptedStorage.getItem('AT');
  const at = result != null ? JSON.parse(result) : null;
  return at ? at : null;
};

export const getRefreshToken = async () => {
  const credentials = await Keychain.getGenericPassword();
  const rt = credentials != null ? credentials : null;

  return rt ? rt.password : null;
};

export const userLogIn = createAsyncThunk(
  '/login',
  async (data: TLogin | undefined, {rejectWithValue}) => {
    try {
      if (data) {
        const {id, password} = data;

        const res = await instance({
          url: '/login',
          method: 'POST',
          data: {
            id,
            password,
          },
        });

        const headers = res.headers;
        if (res.data.success) {
          let sessionCookie = headers['set-cookie'];

          // cookie가 안오는 경우가 간혹 있어 처리
          if (!sessionCookie) {
            const isATLogin = await getAccessToken();

            if (isATLogin) {
              sessionCookie = isATLogin.setCookie;
            } else {
              return rejectWithValue({
                errorMsg: 'error',
              });
            }
          }

          const jsonValue = JSON.stringify({
            at: res.data.data.access_token,
            cookie: sessionCookie,
          });

          // access는 encryptedStorage에 담음
          await EncryptedStorage.setItem('AT', jsonValue);
          // refresh는 keychain에 담음
          //   await Keychain.setGenericPassword(res.data.data.refresh_token);
          instance.defaults.headers.Cookies = sessionCookie!!;
          instance.defaults.headers.common.authorization =
            res.data.data.access_token;

          interceptor({
            rt: res.data.rt,
          });

          return {};
        } else {
          const errorMessage = res.data.data.message;
          return rejectWithValue({errorMsg: errorMessage});
        }
      } else {
        // 자동 로그인
        const isATLogin = await getAccessToken();
        const isRTLogin = await getRefreshToken();

        if (isRTLogin && isATLogin) {
          instance.defaults.headers.Cookies = isATLogin.setCookie;
          instance.defaults.headers.common.authorization = isATLogin.at;

          interceptor({
            rt: isRTLogin,
          });

          return {};
        } else {
          return rejectWithValue({errorMsg: null});
        }
      }
    } catch (err) {
      const error: AxiosError<TResponseError> = err as any;

      return rejectWithValue({errorMsg: `[${error.code}] ${error.message}`});
    }
  },
);

export const userLogout = createAsyncThunk(
  '/logout',
  async (_, {rejectWithValue}) => {
    try {
      const res = await userApi.postLogout();
      if (res.data.success) {
        await EncryptedStorage.clear();
        await Keychain.resetGenericPassword();
        return res.data.data.message;
      }
    } catch (err) {
      const error: AxiosError<TResponseError> = err as any;
      return rejectWithValue({errorMsg: `${error.message}`});
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogInLoading: false,
    isLogInSuccess: false,
    errorMsg: '',
    isLogoutLoading: false,
    isLogoutSuccess: false,
  },
  reducers: {
    clearState: state => {
      state.isLogInSuccess = false;
      state.errorMsg = '';
      return state;
    },
    setIsLogin: state => {
      state.isLogInSuccess = true;
      state.isLogInLoading = false;
      return state;
    },
    setIsLogout: state => {
      state.isLogoutLoading = false;
      state.isLogoutSuccess = true;
      state.isLogInSuccess = false;
      state.errorMsg = '';
      return state;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userLogIn.pending, state => {
        state.isLogInLoading = true;
        state.isLogInSuccess = false;
      })
      .addCase(userLogIn.fulfilled, state => {
        state.errorMsg = '';
        state.isLogInLoading = false;
        state.isLogInSuccess = true;
      })
      .addCase(userLogIn.rejected, (state, action: any) => {
        state.isLogInLoading = false;
        state.isLogInSuccess = false;
        state.errorMsg = action.payload.errorMsg;
      })
      .addCase(userLogout.pending, state => {
        state.isLogoutLoading = true;
        state.isLogoutSuccess = false;
      })
      .addCase(userLogout.fulfilled, state => {
        state.isLogoutLoading = false;
        state.isLogoutSuccess = true;
        state.isLogInSuccess = false;
        state.errorMsg = '';

        return state;
      })
      .addCase(userLogout.rejected, (state, action: any) => {
        state.isLogoutLoading = false;
        state.errorMsg = '로그아웃에 실패했습니다. ' + action.payload;
        return state;
      });
  },
});

export const {clearState, setIsLogout, setIsLogin} = userSlice.actions;

export default userSlice.reducer;
