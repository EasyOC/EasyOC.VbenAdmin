import React from 'react';
import {Provider} from 'mobx-react';
import {toast, alert, confirm} from 'amis';
import axios from 'axios';
import {MainStore} from './store/index';
import RootRoute from './route/index';
import copy from 'copy-to-clipboard';

export default function(): JSX.Element {
    const store = ((window as any).store = MainStore.create(
        {},
        {
            fetcher: ({url, method, data, config}: any) => {

                // alert(11111)
                // console.log('url: ', url);
                // console.log('method: ', method);
                // console.log('data: ', data);
                // console.log('config: ', config);
                config = config || {};
                config.headers = config.headers || {};
                config.withCredentials = true;

                const token = window.localStorage.getItem('token');
                const timeout = window.localStorage.getItem('timeout');
                if ((!(token && timeout)) || new Date(timeout) <new Date()) {
                    window.location.href = '/login';
                    return;
                }
                config.headers.Authorization = 'Bearer ' + token;

                if (method !== 'post' && method !== 'put' && method !== 'patch') {
                    if (data) {
                        config.params = data;
                    }
                    return (axios as any)[method](url, config);
                } else if (data && data instanceof FormData) {
                    // config.headers = config.headers || {};
                    // config.headers['Content-Type'] = 'multipart/form-data';
                } else if (
                    data &&
                    typeof data !== 'string' &&
                    !(data instanceof Blob) &&
                    !(data instanceof ArrayBuffer)
                ) {
                    data = JSON.stringify(data);
                    config.headers['Content-Type'] = 'application/json';
                }

                return (axios as any)[method](url, data, config);
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
