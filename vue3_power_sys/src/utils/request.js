import axios from "axios";
import { getToken } from "../utils/auth";

// 创建axios实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:7003', // 直接设置baseURL
  timeout: 10000, // 设置超时时间
  withCredentials: true // 允许携带cookie（如果需要）
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    console.log(config);
    
    // 直接从sessionStorage获取token
    const token = getToken();
    if (token) {
      // 如果token存在，则将其放入请求头中
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    console.error("请求错误：", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    console.log(response);
    
    return response.data; // 直接返回数据部分
  },
  error => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          console.log(error);
          // router.push("/404")
          
          console.warn("未授权，请登录");
          break;
        case 403:
          console.warn("权限不足");
          break;
        case 500:
          console.error("服务器错误，请稍后再试");
          break;
        default:
          console.error(`错误状态码：${status}`);
      }
    } else {
      console.error("网络错误，请检查您的网络连接");
    }
    return Promise.reject(error);
  }
);

export default service;
