import axios from "axios";
import { getToken } from "../auth";
import globalConfig from "../../global.config";
import { base64 } from "js-base64";

const service = axios.create({
    baseURL:'http://127.0.0.1:7003',
    timeout:30 * 1000,
    responseType:'json',
    withCredentials:false, // 是否允许携带cookie
})

service.interceptors.use(config => {
    // 判断是否携带token
    const whiteList = globalConfig.whiteListApi
    const url = config.url;
    const token = getToken();
    if(whiteList.indexOf(url)=== -1 && token) {
        config.header.Authorization = `Bearer ${token}`;
    }
    // 密钥  ===>  secretId + 特殊算法
    const secretKey = base64.enCode(globalConfig.secretId + new Date().toString());
    config.header.secretKey = secretKey;


    return config;

},error => {
    return Promise.reject(error)
})

service.interceptors.response.use(res => {
    // 响应的统一处理
    const status = res.data.code || 200;
    const message = res.data.message || "未知错误";
    
},error => {
    // 实际会有相应的错误页面或组件
    alert(error);
    switch(error.status){
        case 401:
            alert(error.response.data);
    }

    return Promise.reject(error)
})