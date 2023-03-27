import axios, {AxiosError, AxiosResponse, AxiosInstance} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {TResponseError} from './types/responseError';

export const instance: AxiosInstance = axios.create({
  baseURL: '',
  headers: {
    'User-Agent': '',
  },
  validateStatus: function (status) {
    return status < 300;
  },
  withCredentials: true,
  params: {
    t: new Date().getTime(), // 304 error 방지용
  },
  timeout: 30000,
});

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

// 처음에 로그인 할때, axios setting을 위해 함수로 생성
export const interceptor = (store: {rt: string}) => {
  instance.interceptors.response.use(
    onResponse,
    async (error: AxiosError<TResponseError>) => {
      if (error.response) {
        const {config} = error;
        const status = error.response?.status;

        if (status === 401) {
          // access token expired refreshToken
          const originalRequest = config;

          const {data} = await instance({
            // url: '/refresh',
            method: 'POST',
            data: {
              refresh: store.rt,
            },
          });

          if (data.at) {
            // let sessionCookie = await getAccessToken();

            const jsonValue = JSON.stringify({
              at: data.at,
              //   setCookie: sessionCookie.setCookie,
            });

            // encryptedStorage에 accessToken과 Cookie
            EncryptedStorage.setItem('AT', jsonValue);

            // instance.defaults.headers.Cookies = sessionCookie.setCookie;
            // instance.defaults.headers.common.authorization = data.at;

            // 만료되어서 진행 못한 api 재호출
            originalRequest!!.headers.authorization = data.data.accessToken;
            return axios(originalRequest!!);
          }
        } else {
          return Promise.reject({
            code: status,
            message: 'error',
          });
        }
      } else {
        // client error? or network error?
        return Promise.reject({
          code: '',
          message: '',
        });
      }
    },
  );
};
