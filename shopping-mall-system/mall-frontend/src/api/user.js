// 用户相关API请求
import request from './request'

// 登录
export const login = (username, password) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 注册
export const register = (username, password, email) => {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      username,
      password,
      email
    }
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export const updateUserInfo = (userInfo) => {
  return request({
    url: '/user/update',
    method: 'post',
    data: userInfo
  })
}

// 修改密码
export const changePassword = (oldPassword, newPassword) => {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data: {
      oldPassword,
      newPassword
    }
  })
}

// 获取收货地址列表
export const getAddressList = () => {
  return request({
    url: '/user/address/list',
    method: 'get'
  })
}

// 添加收货地址
export const addAddress = (addressData) => {
  return request({
    url: '/user/address/add',
    method: 'post',
    data: addressData
  })
}

// 更新收货地址
export const updateAddress = (addressId, addressData) => {
  return request({
    url: `/user/address/update/${addressId}`,
    method: 'post',
    data: addressData
  })
}

// 删除收货地址
export const deleteAddress = (addressId) => {
  return request({
    url: `/user/address/delete/${addressId}`,
    method: 'delete'
  })
}

// 设置默认收货地址
export const setDefaultAddress = (addressId) => {
  return request({
    url: `/user/address/setDefault/${addressId}`,
    method: 'post'
  })
}