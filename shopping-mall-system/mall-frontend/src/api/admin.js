import request from './request'

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params
  })
}

// 获取用户详情
export function getUserDetail(userId) {
  return request({
    url: `/admin/user/detail/${userId}`,
    method: 'get'
  })
}

// 修改用户权限
export function updateUserRole(userId, role) {
  return request({
    url: `/admin/user/role/${userId}`,
    method: 'put',
    data: {
      role
    }
  })
}

// 禁用/启用用户
export function updateUserStatus(userId, status) {
  return request({
    url: `/admin/user/status/${userId}`,
    method: 'put',
    data: {
      status
    }
  })
}

// 获取系统统计数据
export function getSystemStatistics() {
  return request({
    url: '/admin/statistics/system',
    method: 'get'
  })
}

// 获取销售统计数据
export function getSalesStatistics(params) {
  return request({
    url: '/admin/statistics/sales',
    method: 'get',
    params
  })
}

// 获取商品销售排行
export function getProductSalesRanking(params) {
  return request({
    url: '/admin/statistics/product/ranking',
    method: 'get',
    params
  })
}

// 获取用户注册统计
export function getUserRegisterStatistics(params) {
  return request({
    url: '/admin/statistics/user/register',
    method: 'get',
    params
  })
}