import {instance} from './';
import type {TLogin} from './types/user';

export default {
  postLogout() {
    return instance({
      url: '/logout',
      method: 'POST',
    });
  },
  postLogin({id, password}: TLogin) {
    return instance({
      url: '/login',
      method: 'POST',
      data: {
        id,
        password,
      },
    });
  },
};
