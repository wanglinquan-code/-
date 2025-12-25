import request from './request'

// 创建订单
export function createOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data
  })
}

// 获取订单列表
export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetail(orderId) {
  return request({
    url: `/order/detail/${orderId}`,
    method: 'get'
  })
}

// 支付订单
export function payOrder(orderId, payMethod) {
  return request({
    url: `/order/pay/${orderId}`,
    method: 'post',
    data: {
      payMethod
    }
  })
}

// 取消订单
export function cancelOrder(orderId) {
  return request({
    url: `/order/cancel/${orderId}`,
    method: 'put'
  })
}

// 确认收货
export function confirmOrder(orderId) {
  return request({
    url: `/order/confirm/${orderId}`,
    method: 'put'
  })
}

// 申请退款
export function refundOrder(orderId, reason) {
  return request({
    url: `/order/refund/${orderId}`,
    method: 'post',
    data: {
      reason
    }
  })
}

// 管理员获取所有订单
export function adminGetOrderList(params) {
  return request({
    url: '/admin/order/list',
    method: 'get',
    params
  })
}

// 管理员更新订单状态
export function adminUpdateOrderStatus(orderId, status) {
  return request({
    url: `/admin/order/status/${orderId}`,
    method: 'put',
    data: {
      status
    }
  })
}

// 管理员发货
export function adminShipOrder(orderId, shippingInfo) {
  return request({
    url: `/admin/order/ship/${orderId}`,
    method: 'put',
    data: {
      shippingInfo
    }
  })
}

// 获取订单统计信息
export function getOrderStatistics() {
  return request({
    url: '/admin/order/statistics',
    method: 'get'
  })
}