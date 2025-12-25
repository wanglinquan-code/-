import Vue from 'vue'
import Vuex from 'vuex'
import {
  getCartList,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  selectCartItem,
  selectAllCartItems
} from '../api/cart'

Vue.use(Vuex)

// 购物车状态
const state = {
  cartItems: [], // 购物车商品列表
  totalPrice: 0, // 购物车总价格
  selectedCount: 0, // 已选择商品数量
  loading: false // 加载状态
}

// 计算购物车总价格和已选择商品数量
function calculateCartSummary(state) {
  let totalPrice = 0
  let selectedCount = 0
  
  state.cartItems.forEach(item => {
    if (item.selected) {
      totalPrice += item.product.price * item.quantity
      selectedCount += item.quantity
    }
  })
  
  state.totalPrice = parseFloat(totalPrice.toFixed(2))
  state.selectedCount = selectedCount
}

// 状态修改函数
const mutations = {
  // 设置购物车列表
  SET_CART_ITEMS(state, cartItems) {
    state.cartItems = cartItems
    calculateCartSummary(state)
  },
  
  // 添加购物车商品
  ADD_CART_ITEM(state, cartItem) {
    const existingItem = state.cartItems.find(item => item.product.id === cartItem.product.id)
    if (existingItem) {
      // 如果商品已存在，增加数量
      existingItem.quantity += cartItem.quantity
    } else {
      // 否则添加新商品
      state.cartItems.push(cartItem)
    }
    calculateCartSummary(state)
  },
  
  // 更新购物车商品数量
  UPDATE_CART_ITEM_QUANTITY(state, { cartItemId, quantity }) {
    const item = state.cartItems.find(item => item.id === cartItemId)
    if (item) {
      item.quantity = quantity
      calculateCartSummary(state)
    }
  },
  
  // 删除购物车商品
  DELETE_CART_ITEM(state, cartItemId) {
    const index = state.cartItems.findIndex(item => item.id === cartItemId)
    if (index !== -1) {
      state.cartItems.splice(index, 1)
      calculateCartSummary(state)
    }
  },
  
  // 清空购物车
  CLEAR_CART(state) {
    state.cartItems = []
    calculateCartSummary(state)
  },
  
  // 选择/取消选择购物车商品
  TOGGLE_CART_ITEM_SELECT(state, cartItemId) {
    const item = state.cartItems.find(item => item.id === cartItemId)
    if (item) {
      item.selected = !item.selected
      calculateCartSummary(state)
    }
  },
  
  // 设置购物车商品选择状态
  SET_CART_ITEM_SELECT(state, { cartItemId, selected }) {
    const item = state.cartItems.find(item => item.id === cartItemId)
    if (item) {
      item.selected = selected
      calculateCartSummary(state)
    }
  },
  
  // 全选/取消全选购物车商品
  TOGGLE_ALL_CART_ITEMS_SELECT(state, selected) {
    state.cartItems.forEach(item => {
      item.selected = selected
    })
    calculateCartSummary(state)
  },
  
  // 设置加载状态
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

// 异步操作函数
const actions = {
  // 获取购物车列表
  async getCartList({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await getCartList()
      if (response.success) {
        commit('SET_CART_ITEMS', response.data)
      }
      return response
    } catch (error) {
      console.error('获取购物车列表失败:', error)
      return { success: false, message: '获取购物车列表失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 添加商品到购物车
  async addToCart({ commit }, { productId, quantity = 1 }) {
    try {
      const response = await addToCart(productId, quantity)
      if (response.success) {
        commit('ADD_CART_ITEM', response.data)
      }
      return response
    } catch (error) {
      console.error('添加到购物车失败:', error)
      return { success: false, message: '添加到购物车失败' }
    }
  },
  
  // 更新购物车商品数量
  async updateCartItem({ commit }, { cartItemId, quantity }) {
    try {
      const response = await updateCartItem(cartItemId, quantity)
      if (response.success) {
        commit('UPDATE_CART_ITEM_QUANTITY', { cartItemId, quantity: response.data.quantity })
      }
      return response
    } catch (error) {
      console.error('更新购物车商品数量失败:', error)
      return { success: false, message: '更新购物车商品数量失败' }
    }
  },
  
  // 删除购物车商品
  async deleteCartItem({ commit }, cartItemId) {
    try {
      const response = await deleteCartItem(cartItemId)
      if (response.success) {
        commit('DELETE_CART_ITEM', cartItemId)
      }
      return response
    } catch (error) {
      console.error('删除购物车商品失败:', error)
      return { success: false, message: '删除购物车商品失败' }
    }
  },
  
  // 清空购物车
  async clearCart({ commit }) {
    try {
      const response = await clearCart()
      if (response.success) {
        commit('CLEAR_CART')
      }
      return response
    } catch (error) {
      console.error('清空购物车失败:', error)
      return { success: false, message: '清空购物车失败' }
    }
  },
  
  // 选择/取消选择购物车商品
  async toggleCartItemSelect({ commit }, cartItemId) {
    try {
      const item = this.state.cart.cartItems.find(item => item.id === cartItemId)
      if (item) {
        const newSelected = !item.selected
        const response = await selectCartItem(cartItemId, newSelected)
        if (response.success) {
          commit('SET_CART_ITEM_SELECT', { cartItemId, selected: newSelected })
        }
        return response
      }
    } catch (error) {
      console.error('选择购物车商品失败:', error)
      return { success: false, message: '选择购物车商品失败' }
    }
  },
  
  // 全选/取消全选购物车商品
  async toggleAllCartItemsSelect({ commit }, selected) {
    try {
      const response = await selectAllCartItems(selected)
      if (response.success) {
        commit('TOGGLE_ALL_CART_ITEMS_SELECT', selected)
      }
      return response
    } catch (error) {
      console.error('全选购物车商品失败:', error)
      return { success: false, message: '全选购物车商品失败' }
    }
  }
}

// 状态获取函数
const getters = {
  cartItems: state => state.cartItems,
  totalPrice: state => state.totalPrice,
  selectedCount: state => state.selectedCount,
  loading: state => state.loading,
  // 获取已选择的购物车商品
  selectedCartItems: state => state.cartItems.filter(item => item.selected),
  // 判断是否全选
  isAllSelected: state => state.cartItems.length > 0 && state.cartItems.every(item => item.selected),
  // 购物车商品总数
  cartItemCount: state => state.cartItems.reduce((total, item) => total + item.quantity, 0)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}