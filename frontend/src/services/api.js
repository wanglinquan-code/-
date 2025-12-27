// API服务模块
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8081/api', // 后端API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data;
  },
  error => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

// API接口

// 获取商品列表
export const fetchProducts = async (params = {}) => {
  try {
    // 实际项目中应该调用真实API
    // return await api.get('/products', { params });
    
    // 模拟API响应
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '智能手表', price: 1999.00, imageUrl: 'https://via.placeholder.com/200' },
          { id: 2, name: '无线耳机', price: 999.00, imageUrl: 'https://via.placeholder.com/200' },
          { id: 3, name: '智能手机', price: 5999.00, imageUrl: 'https://via.placeholder.com/200' },
          { id: 4, name: '平板电脑', price: 3999.00, imageUrl: 'https://via.placeholder.com/200' },
          { id: 5, name: '笔记本电脑', price: 7999.00, imageUrl: 'https://via.placeholder.com/200' },
          { id: 6, name: '智能音箱', price: 499.00, imageUrl: 'https://via.placeholder.com/200' }
        ]);
      }, 500);
    });
  } catch (error) {
    console.error('获取商品列表失败:', error);
    throw error;
  }
};

// 获取商品详情
export const fetchProductDetail = async (productId) => {
  try {
    // 实际项目中应该调用真实API
    // return await api.get(`/products/${productId}`);
    
    // 模拟API响应
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: productId,
          name: '智能手表',
          price: 1999.00,
          imageUrl: 'https://via.placeholder.com/200',
          description: '这是一款功能强大的智能手表，支持心率监测、运动追踪等功能。',
          specifications: [
            '屏幕尺寸：1.78英寸',
            '电池容量：300mAh',
            '防水等级：IP68',
            '连接方式：蓝牙5.0'
          ]
        });
      }, 500);
    });
  } catch (error) {
    console.error('获取商品详情失败:', error);
    throw error;
  }
};

// 搜索商品
export const searchProducts = async (keyword) => {
  try {
    // 实际项目中应该调用真实API
    // return await api.get('/products/search', { params: { keyword } });
    
    // 模拟API响应
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '智能手表', price: 1999.00, imageUrl: 'https://via.placeholder.com/200' },
          { id: 2, name: '无线耳机', price: 999.00, imageUrl: 'https://via.placeholder.com/200' }
        ]);
      }, 500);
    });
  } catch (error) {
    console.error('搜索商品失败:', error);
    throw error;
  }
};
