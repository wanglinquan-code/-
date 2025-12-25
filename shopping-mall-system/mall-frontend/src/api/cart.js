import request from './request'

// 获取购物车列表
export function getCartList() {
  return request({
    url: '/cart/list',
    method: 'get'
  })
}

// 添加商品到购物车
export function addToCart(productId, quantity = 1) {
  return request({
    url: '/cart/add',
    method: 'post',
    data: {
      productId,
      quantity
    }
  })
}

// 更新购物车商品数量
export function updateCartItem(cartItemId, quantity) {
  return request({
    url: `/cart/update/${cartItemId}`,
    method: 'put',
    data: {
      quantity
    }
  })
}

// 删除购物车商品
export function deleteCartItem(cartItemId) {
  return request({
    url: `/cart/delete/${cartItemId}`,
    method: 'delete'
  })
}

// 清空购物车
export function clearCart() {
  return request({
    url: '/cart/clear',
    method: 'delete'
  })
}

// 选择/取消选择购物车商品
export function selectCartItem(cartItemId, selected) {
  return request({
    url: `/cart/select/${cartItemId}`,
    method: 'put',
    data: {
      selected
    }
  })
}

// 全选/取消全选购物车商品
export function selectAllCartItems(selected) {
  return request({
    url: '/cart/selectAll',
    method: 'put',
    data: {
      selected
    }
  })
}