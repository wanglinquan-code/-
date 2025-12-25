// API请求配置
import axios from 'axios'
import Cookies from 'js-cookie'
import store from '../store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:8080/api', // API基础路径
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 获取token
    const token = Cookies.get('token')
    // 如果token存在，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 处理不同的响应状态
    if (res.success) {
      // 请求成功
      return res
    } else {
      // 请求失败
      console.error('请求失败:', res.message)
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    console.error('响应错误:', error)
    // 处理401未授权
    if (error.response && error.response.status === 401) {
      // 清除登录状态
      store.dispatch('user/logout')
      // 跳转到登录页面
      window.location.href = '/user/login'
    }
    return Promise.reject(error)
  }
)

export default service