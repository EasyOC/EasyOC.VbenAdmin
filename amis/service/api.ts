import axios, {AxiosRequestConfig, AxiosInstance} from 'axios';

export async function requestApi(config: AxiosRequestConfig) {
    console.log('config: ', config);
    const {url, method, data} = config;
    console.log('url: ', url);
    const apiUrl = window.localStorage.getItem('apiUrl');
    console.log('apiurl', apiUrl);

    config = config || {};
    config.baseURL = apiUrl || '';
    config.headers = config.headers || {};
    config.timeout = 10 * 1000;
    const token = window.localStorage.getItem('token');
    // console.log('token: ', token);
    const timeout = window.localStorage.getItem('timeout');
    // console.log('timeout: ', timeout);
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
    } else if (data && typeof data !== 'string' && !(data instanceof Blob) && !(data instanceof ArrayBuffer)) {
        config.data = JSON.stringify(data);
        config.headers['Content-Type'] = 'application/json';
    }

    const axiosInstance: AxiosInstance = axios.create(config);
    const result = await axiosInstance(config);
    console.log('axiosInstance:result ', result);
    if (config.url?.toLocaleLowerCase().startsWith('/api/graphql')) {
        console.log('graphql result', result);
        const finalResult = {
            data: result.data.data,
            status: result.status == 200 ? 0 : result.status,
            msg: result.statusText
        };
        console.log('graphql finalResult', finalResult);
        return finalResult;
    } else {
        console.log('defaultRequest result ', result);
        const finalResult = {
            ...result,
            data: result.data
        };
        console.log('defaultRequest finalResult', finalResult);
        return finalResult;
    }
}
