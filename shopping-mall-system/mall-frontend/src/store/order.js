import Vue from 'vue'
import Vuex from 'vuex'
import {
  createOrder,
  getOrderList,
  getOrderDetail,
  payOrder,
  cancelOrder,
  confirmOrder,
  refundOrder,
  adminGetOrderList,
  adminUpdateOrderStatus,
  adminShipOrder,
  getOrderStatistics
} from '../api/order'

Vue.use(Vuex)

// 订单状态
const state = {
  orders: [], // 用户订单列表
  currentOrder: null, // 当前查看的订单详情
  adminOrders: [], // 管理员订单列表
  statistics: {}, // 订单统计信息
  total: 0, // 订单总数
  currentPage: 1, // 当前页码
  pageSize: 10, // 每页数量
  loading: false // 加载状态
}

// 订单状态映射
const orderStatusMap = {
  PENDING: '待付款',
  PAID: '待发货',
  SHIPPED: '待收货',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
  REFUNDED: '已退款'
}

// 状态修改函数
const mutations = {
  // 设置订单列表
  SET_ORDERS(state, { orders, total, currentPage }) {
    state.orders = orders
    state.total = total
    state.currentPage = currentPage
  },
  
  // 设置当前订单详情
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },
  
  // 设置管理员订单列表
  SET_ADMIN_ORDERS(state, { orders, total, currentPage }) {
    state.adminOrders = orders
    state.total = total
    state.currentPage = currentPage
  },
  
  // 设置订单统计信息
  SET_ORDER_STATISTICS(state, statistics) {
    state.statistics = statistics
  },
  
  // 更新订单状态
  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    // 更新用户订单列表中的订单状态
    const userOrderIndex = state.orders.findIndex(order => order.id === orderId)
    if (userOrderIndex !== -1) {
      Vue.set(state.orders[userOrderIndex], 'status', status)
      Vue.set(state.orders[userOrderIndex], 'statusText', orderStatusMap[status])
    }
    
    // 更新管理员订单列表中的订单状态
    const adminOrderIndex = state.adminOrders.findIndex(order => order.id === orderId)
    if (adminOrderIndex !== -1) {
      Vue.set(state.adminOrders[adminOrderIndex], 'status', status)
      Vue.set(state.adminOrders[adminOrderIndex], 'statusText', orderStatusMap[status])
    }
    
    // 更新当前查看的订单状态
    if (state.currentOrder && state.currentOrder.id === orderId) {
      Vue.set(state.currentOrder, 'status', status)
      Vue.set(state.currentOrder, 'statusText', orderStatusMap[status])
    }
  },
  
  // 设置加载状态
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

// 异步操作函数
const actions = {
  // 创建订单
  async createOrder({ commit }, orderData) {
    try {
      commit('SET_LOADING', true)
      const response = await createOrder(orderData)
      if (response.success) {
        commit('SET_CURRENT_ORDER', response.data)
      }
      return response
    } catch (error) {
      console.error('创建订单失败:', error)
      return { success: false, message: '创建订单失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取订单列表
  async getOrderList({ commit }, { page = 1, pageSize = 10, status } = {}) {
    try {
      commit('SET_LOADING', true)
      const params = { page, pageSize }
      if (status) {
        params.status = status
      }
      const response = await getOrderList(params)
      if (response.success) {
        // 为订单添加状态文本
        const orders = response.data.orders.map(order => ({
          ...order,
          statusText: orderStatusMap[order.status] || '未知状态'
        }))
        commit('SET_ORDERS', {
          orders,
          total: response.data.total,
          currentPage: page
        })
      }
      return response
    } catch (error) {
      console.error('获取订单列表失败:', error)
      return { success: false, message: '获取订单列表失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取订单详情
  async getOrderDetail({ commit }, orderId) {
    try {
      commit('SET_LOADING', true)
      const response = await getOrderDetail(orderId)
      if (response.success) {
        // 为订单添加状态文本
        const order = {
          ...response.data,
          statusText: orderStatusMap[response.data.status] || '未知状态'
        }
        commit('SET_CURRENT_ORDER', order)
      }
      return response
    } catch (error) {
      console.error('获取订单详情失败:', error)
      return { success: false, message: '获取订单详情失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 支付订单
  async payOrder({ commit }, { orderId, payMethod }) {
    try {
      commit('SET_LOADING', true)
      const response = await payOrder(orderId, payMethod)
      if (response.success) {
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'PAID' })
      }
      return response
    } catch (error) {
      console.error('支付订单失败:', error)
      return { success: false, message: '支付订单失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 取消订单
  async cancelOrder({ commit }, orderId) {
    try {
      commit('SET_LOADING', true)
      const response = await cancelOrder(orderId)
      if (response.success) {
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'CANCELLED' })
      }
      return response
    } catch (error) {
      console.error('取消订单失败:', error)
      return { success: false, message: '取消订单失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 确认收货
  async confirmOrder({ commit }, orderId) {
    try {
      commit('SET_LOADING', true)
      const response = await confirmOrder(orderId)
      if (response.success) {
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'COMPLETED' })
      }
      return response
    } catch (error) {
      console.error('确认收货失败:', error)
      return { success: false, message: '确认收货失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 申请退款
  async refundOrder({ commit }, { orderId, reason }) {
    try {
      commit('SET_LOADING', true)
      const response = await refundOrder(orderId, reason)
      if (response.success) {
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'REFUNDED' })
      }
      return response
    } catch (error) {
      console.error('申请退款失败:', error)
      return { success: false, message: '申请退款失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 管理员获取所有订单
  async adminGetOrderList({ commit }, { page = 1, pageSize = 10, status, keyword } = {}) {
    try {
      commit('SET_LOADING', true)
      const params = { page, pageSize }
      if (status) {
        params.status = status
      }
      if (keyword) {
        params.keyword = keyword
      }
      const response = await adminGetOrderList(params)
      if (response.success) {
        // 为订单添加状态文本
        const orders = response.data.orders.map(order => ({
          ...order,
          statusText: orderStatusMap[order.status] || '未知状态'
        }))
        commit('SET_ADMIN_ORDERS', {
          orders,
          total: response.data.total,
          currentPage: page
        })
      }
      return response
    } catch (error) {
      console.error('管理员获取订单列表失败:', error)
      return { success: false, message: '管理员获取订单列表失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 管理员更新订单状态
  async adminUpdateOrderStatus({ commit }, { orderId, status }) {
    try {
      commit('SET_LOADING', true)
      const response = await adminUpdateOrderStatus(orderId, status)
      if (response.success) {
        commit('UPDATE_ORDER_STATUS', { orderId, status })
      }
      return response
    } catch (error) {
      console.error('管理员更新订单状态失败:', error)
      return { success: false, message: '管理员更新订单状态失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 管理员发货
  async adminShipOrder({ commit }, { orderId, shippingInfo }) {
    try {
      commit('SET_LOADING', true)
      const response = await adminShipOrder(orderId, shippingInfo)
      if (response.success) {
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'SHIPPED' })
      }
      return response
    } catch (error) {
      console.error('管理员发货失败:', error)
      return { success: false, message: '管理员发货失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取订单统计信息
  async getOrderStatistics({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await getOrderStatistics()
      if (response.success) {
        commit('SET_ORDER_STATISTICS', response.data)
      }
      return response
    } catch (error) {
      console.error('获取订单统计信息失败:', error)
      return { success: false, message: '获取订单统计信息失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

// 状态获取函数
const getters = {
  orders: state => state.orders,
  currentOrder: state => state.currentOrder,
  adminOrders: state => state.adminOrders,
  statistics: state => state.statistics,
  total: state => state.total,
  currentPage: state => state.currentPage,
  pageSize: state => state.pageSize,
  loading: state => state.loading,
  // 获取订单状态映射
  orderStatusMap: () => orderStatusMap
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}