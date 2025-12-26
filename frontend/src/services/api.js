// API请求封装
const API_BASE_URL = 'http://localhost:3001/api';

// 商品相关
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('请求失败');
    return await response.json();
  } catch (error) {
    console.error('获取商品失败:', error);
    throw error;
  }
};

export const searchProducts = async (keyword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?keyword=${keyword}`);
    if (!response.ok) throw new Error('搜索失败');
    return await response.json();
  } catch (error) {
    console.error('搜索商品失败:', error);
    throw error;
  }
};

// 用户相关
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || '登录失败');
    
    // 保存token和用户信息
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

export const register = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || '注册失败');
    return data;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};