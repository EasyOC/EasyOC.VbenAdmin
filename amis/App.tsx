import React from 'react';
import {Provider} from 'mobx-react';
import {toast, alert, confirm} from 'amis';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {MainStore} from './store/index';
import RootRoute from './route/index';
import copy from 'copy-to-clipboard';

export default function (): JSX.Element {
    const store = ((window as any).store = MainStore.create(
        {},
        {
            fetcher: async (config: AxiosRequestConfig) => {
                console.log('config: ', config);
                const {url, method, data} = config;
                // alert(11111)
                console.log('url: ', url);
                // console.log('method: ', method);
                // console.log('data: ', data);
                // console.log('config: ', config);
                const apiUrl = window.localStorage.getItem('apiUrl');
                console.log('apiurl', apiUrl);

                config = config || {};
                config.baseURL = apiUrl || '';
                config.headers = config.headers || {};
                config.timeout = 10 * 1000;
                const token = window.localStorage.getItem('token');
                console.log('token: ', token);
                const timeout = window.localStorage.getItem('timeout');
                console.log('timeout: ', timeout);
                console.log('timeout: ', new Date(timeout ? timeout : new Date()));
                if (!(token && timeout) || new Date(timeout) < new Date()) {
                    0;
                    window.location.href = '/login';
                    return;
                }
                config.headers.Authorization = 'Bearer ' + token;

                if (method !== 'post' && method !== 'put' && method !== 'patch') {
                    if (data) {
                        config.params = data;
                    }
                    // return axiosInstance.request({url,method,data });
                } else if (data && data instanceof FormData) {
                    config.headers = config.headers || {};
                    config.headers['Content-Type'] = 'multipart/form-data';
                } else if (
                    data &&
                    typeof data !== 'string' &&
                    !(data instanceof Blob) &&
                    !(data instanceof ArrayBuffer)
                ) {
                    config.data = JSON.stringify(data);
                config.headers['Content-Type'] = 'application/json';
                }
               
                const axiosInstance: AxiosInstance = axios.create(config);
                console.log('configconfigconfigconfig: ', config);
                return await axiosInstance(config);
            },
            responseAdaptor: (api, response, query, request) => {
                console.log('response: api', api);
                console.log('response: response', response);
                console.log('response: query', query);
                console.log('response:request ', request);
                if (response.status === 401) {
                    window.location.href = '/login';
                }

                return response;
            },
            isCancel: (e: any) => axios.isCancel(e),
            notify: (type: 'success' | 'error' | 'info', msg: string) => {
                toast[type]
                    ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
                    : console.warn('[Notify]', type, msg);
                console.log('[notify]', type, msg);
            },
            alert,
            confirm,
            copy: (contents: string, options: any = {}) => {
                const ret = copy(contents, options);
                ret && (!options || options.shutup !== true) && toast.info('内容已拷贝到剪切板1111');
                return ret;
            }
        }
    ));

    return (
        <Provider store={store}>
            <RootRoute store={store} />
        </Provider>
    );
}
