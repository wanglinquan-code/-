import Vue from 'vue'
import Vuex from 'vuex'
import {
  getProductList,
  getProductDetail,
  searchProduct,
  getProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getCategoryList
} from '../api/product'

Vue.use(Vuex)

// 商品状态
const state = {
  products: [], // 商品列表
  currentProduct: null, // 当前查看的商品详情
  categories: [], // 商品分类
  searchResults: [], // 搜索结果
  total: 0, // 商品总数
  currentPage: 1, // 当前页码
  pageSize: 10, // 每页数量
  loading: false // 加载状态
}

// 状态修改函数
const mutations = {
  // 设置商品列表
  SET_PRODUCTS(state, { products, total, currentPage }) {
    state.products = products
    state.total = total
    state.currentPage = currentPage
  },
  
  // 设置当前商品详情
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
  },
  
  // 设置搜索结果
  SET_SEARCH_RESULTS(state, { products, total, currentPage }) {
    state.searchResults = products
    state.total = total
    state.currentPage = currentPage
  },
  
  // 设置商品分类
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  
  // 设置加载状态
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  // 添加商品（管理员）
  ADD_PRODUCT(state, product) {
    state.products.unshift(product)
    state.total++
  },
  
  // 更新商品（管理员）
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      Vue.set(state.products, index, updatedProduct)
    }
    
    // 如果当前查看的商品是被更新的商品，也更新详情
    if (state.currentProduct && state.currentProduct.id === updatedProduct.id) {
      state.currentProduct = updatedProduct
    }
  },
  
  // 删除商品（管理员）
  DELETE_PRODUCT(state, productId) {
    const index = state.products.findIndex(p => p.id === productId)
    if (index !== -1) {
      state.products.splice(index, 1)
      state.total--
    }
  }
}

// 异步操作函数
const actions = {
  // 获取商品列表
  async getProductList({ commit }, { page = 1, pageSize = 10, categoryId } = {}) {
    try {
      commit('SET_LOADING', true)
      const params = { page, pageSize }
      if (categoryId) {
        params.categoryId = categoryId
      }
      const response = await getProductList(params)
      if (response.success) {
        commit('SET_PRODUCTS', {
          products: response.data.products,
          total: response.data.total,
          currentPage: page
        })
      }
      return response
    } catch (error) {
      console.error('获取商品列表失败:', error)
      return { success: false, message: '获取商品列表失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取商品详情
  async getProductDetail({ commit }, id) {
    try {
      commit('SET_LOADING', true)
      const response = await getProductDetail(id)
      if (response.success) {
        commit('SET_CURRENT_PRODUCT', response.data)
      }
      return response
    } catch (error) {
      console.error('获取商品详情失败:', error)
      return { success: false, message: '获取商品详情失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 搜索商品
  async searchProduct({ commit }, { keyword, page = 1, pageSize = 10 } = {}) {
    try {
      commit('SET_LOADING', true)
      const response = await searchProduct(keyword, { page, pageSize })
      if (response.success) {
        commit('SET_SEARCH_RESULTS', {
          products: response.data.products,
          total: response.data.total,
          currentPage: page
        })
      }
      return response
    } catch (error) {
      console.error('搜索商品失败:', error)
      return { success: false, message: '搜索商品失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 根据分类获取商品
  async getProductsByCategory({ commit }, { categoryId, page = 1, pageSize = 10 } = {}) {
    try {
      commit('SET_LOADING', true)
      const response = await getProductsByCategory(categoryId, { page, pageSize })
      if (response.success) {
        commit('SET_PRODUCTS', {
          products: response.data.products,
          total: response.data.total,
          currentPage: page
        })
      }
      return response
    } catch (error) {
      console.error('根据分类获取商品失败:', error)
      return { success: false, message: '根据分类获取商品失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取商品分类列表
  async getCategoryList({ commit }) {
    try {
      const response = await getCategoryList()
      if (response.success) {
        commit('SET_CATEGORIES', response.data)
      }
      return response
    } catch (error) {
      console.error('获取商品分类失败:', error)
      return { success: false, message: '获取商品分类失败' }
    }
  },
  
  // 管理员添加商品
  async addProduct({ commit }, productData) {
    try {
      const response = await addProduct(productData)
      if (response.success) {
        commit('ADD_PRODUCT', response.data)
      }
      return response
    } catch (error) {
      console.error('添加商品失败:', error)
      return { success: false, message: '添加商品失败' }
    }
  },
  
  // 管理员更新商品
  async updateProduct({ commit }, { id, productData }) {
    try {
      const response = await updateProduct(id, productData)
      if (response.success) {
        commit('UPDATE_PRODUCT', response.data)
      }
      return response
    } catch (error) {
      console.error('更新商品失败:', error)
      return { success: false, message: '更新商品失败' }
    }
  },
  
  // 管理员删除商品
  async deleteProduct({ commit }, id) {
    try {
      const response = await deleteProduct(id)
      if (response.success) {
        commit('DELETE_PRODUCT', id)
      }
      return response
    } catch (error) {
      console.error('删除商品失败:', error)
      return { success: false, message: '删除商品失败' }
    }
  },
  
  // 管理员更新商品状态
  async updateProductStatus({ commit }, { id, status }) {
    try {
      const response = await updateProductStatus(id, status)
      if (response.success) {
        commit('UPDATE_PRODUCT', response.data)
      }
      return response
    } catch (error) {
      console.error('更新商品状态失败:', error)
      return { success: false, message: '更新商品状态失败' }
    }
  }
}

// 状态获取函数
const getters = {
  products: state => state.products,
  currentProduct: state => state.currentProduct,
  categories: state => state.categories,
  searchResults: state => state.searchResults,
  total: state => state.total,
  currentPage: state => state.currentPage,
  pageSize: state => state.pageSize,
  loading: state => state.loading
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}