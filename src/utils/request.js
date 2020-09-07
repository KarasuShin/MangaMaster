import axios from 'axios';

const request = axios.create({
  // API 请求的默认前缀
  baseURL: 'https://api.karasu.cn/manga',
  timeout: 6000, // 请求超时时间
});

// response interceptor
request.interceptors.response.use((response) => response.data);

export default request;
