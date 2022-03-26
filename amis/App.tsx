import React from 'react';
import {Provider} from 'mobx-react';
import {toast, alert, confirm} from 'amis';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {MainStore} from './store/index';
import RootRoute from './route/index';
import copy from 'copy-to-clipboard';
import { requestApi } from 'service/api';

export default function (): JSX.Element {
    const store = ((window as any).store = MainStore.create(
        {},
        {
            fetcher: requestApi,
            // adaptor: (payload, response, api) => {
            //     return response.data;
            // },
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
                ret && (!options || options.shutup !== true) && toast.info('内容已拷贝到剪切板');
                return ret;
            },
            enableAMISDebug: true
        }
    ));

    return (
        <Provider store={store}>
            <RootRoute store={store} />
        </Provider>
    );
}
