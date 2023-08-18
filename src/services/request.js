/* eslint-disable no-unused-vars */
import axios from 'axios';
import {environment} from '../environments/environment';

const request = axios.create({
  baseURL: environment.baseURL,
  timeout: 1000000,
});
let requests = [];
request.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (store.getState().user?.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual LOgin
    //   config.headers.Authorization = `${store.getState().user?.token}`;
    // config.headers['host'] = localStorage.getItem('user');
    // }
    // store.dispatch(actions.setLoading(true));

    requests.push(config);

    // if (!axiosInterceptor) {
    //     axiosInterceptor = !axiosInterceptor;

    //     const token = store.getState().user?.token;
    //     axiosInterceptor = !axiosInterceptor;
    //     requests.map((req: any) => {
    //         req.headers.Authorization = token;
    //         return request(req);
    //     });
    // }
    // requests = [];
    // return {
    //     ...config,
    //     cancelToken: new CancelToken((cancel) =>
    //         cancel('Cancel repeated request'),
    //     ),
    // };
    return config;
  },
  error => {
    console.log(error);
    // do something with request error
    return Promise.reject(error);
  },
);
request.interceptors.response.use(
  function (response) {
    // store.dispatch(actions.setLoading(false));
    // Do something with response data

    return response;
  },
  function (error) {
    // store.dispatch(actions.setLoading(false));

    // Do something with response error
    return Promise.reject(error);
  },
);

export default request;
