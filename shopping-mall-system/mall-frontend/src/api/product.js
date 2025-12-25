import request from './request'

// 获取商品列表
export function getProductList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

// 获取商品详情
export function getProductDetail(id) {
  return request({
    url: `/product/detail/${id}`,
    method: 'get'
  })
}

// 搜索商品
export function searchProduct(keyword, params) {
  return request({
    url: `/product/search?keyword=${encodeURIComponent(keyword)}`,
    method: 'get',
    params
  })
}

// 根据分类获取商品
export function getProductsByCategory(categoryId, params) {
  return request({
    url: `/product/category/${categoryId}`,
    method: 'get',
    params
  })
}

// 管理员添加商品
export function addProduct(data) {
  return request({
    url: '/admin/product/add',
    method: 'post',
    data
  })
}

// 管理员更新商品
export function updateProduct(id, data) {
  return request({
    url: `/admin/product/update/${id}`,
    method: 'put',
    data
  })
}

// 管理员删除商品
export function deleteProduct(id) {
  return request({
    url: `/admin/product/delete/${id}`,
    method: 'delete'
  })
}

// 管理员更新商品状态
export function updateProductStatus(id, status) {
  return request({
    url: `/admin/product/status/${id}`,
    method: 'put',
    data: { status }
  })
}

// 获取商品分类列表
export function getCategoryList() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}