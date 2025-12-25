import Vue from 'vue'
import Vuex from 'vuex'
import {
  getUserList,
  getUserDetail,
  updateUserRole,
  updateUserStatus,
  getSystemStatistics,
  getSalesStatistics,
  getProductSalesRanking,
  getUserRegisterStatistics
} from '../api/admin'

Vue.use(Vuex)

// 管理员状态
const state = {
  users: [], // 用户列表
  currentUser: null, // 当前查看的用户详情
  systemStatistics: {}, // 系统统计数据
  salesStatistics: {}, // 销售统计数据
  productSalesRanking: [], // 商品销售排行
  userRegisterStatistics: {}, // 用户注册统计
  total: 0, // 数据总数
  currentPage: 1, // 当前页码
  pageSize: 10, // 每页数量
  loading: false // 加载状态
}

// 状态修改函数
const mutations = {
  // 设置用户列表
  SET_USERS(state, { users, total, currentPage }) {
    state.users = users
    state.total = total
    state.currentPage = currentPage
  },
  
  // 设置当前用户详情
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  
  // 设置系统统计数据
  SET_SYSTEM_STATISTICS(state, statistics) {
    state.systemStatistics = statistics
  },
  
  // 设置销售统计数据
  SET_SALES_STATISTICS(state, statistics) {
    state.salesStatistics = statistics
  },
  
  // 设置商品销售排行
  SET_PRODUCT_SALES_RANKING(state, ranking) {
    state.productSalesRanking = ranking
  },
  
  // 设置用户注册统计
  SET_USER_REGISTER_STATISTICS(state, statistics) {
    state.userRegisterStatistics = statistics
  },
  
  // 更新用户角色
  UPDATE_USER_ROLE(state, { userId, role }) {
    const index = state.users.findIndex(user => user.id === userId)
    if (index !== -1) {
      Vue.set(state.users[index], 'role', role)
    }
    
    if (state.currentUser && state.currentUser.id === userId) {
      Vue.set(state.currentUser, 'role', role)
    }
  },
  
  // 更新用户状态
  UPDATE_USER_STATUS(state, { userId, status }) {
    const index = state.users.findIndex(user => user.id === userId)
    if (index !== -1) {
      Vue.set(state.users[index], 'status', status)
    }
    
    if (state.currentUser && state.currentUser.id === userId) {
      Vue.set(state.currentUser, 'status', status)
    }
  },
  
  // 设置加载状态
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

// 异步操作函数
const actions = {
  // 获取用户列表
  async getUserList({ commit }, { page = 1, pageSize = 10, keyword, role } = {}) {
    try {
      commit('SET_LOADING', true)
      const params = { page, pageSize }
      if (keyword) {
        params.keyword = keyword
      }
      if (role) {
        params.role = role
      }
      const response = await getUserList(params)
      if (response.success) {
        commit('SET_USERS', {
          users: response.data.users,
          total: response.data.total,
          currentPage: page
        })
      }
      return response
    } catch (error) {
      console.error('获取用户列表失败:', error)
      return { success: false, message: '获取用户列表失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取用户详情
  async getUserDetail({ commit }, userId) {
    try {
      commit('SET_LOADING', true)
      const response = await getUserDetail(userId)
      if (response.success) {
        commit('SET_CURRENT_USER', response.data)
      }
      return response
    } catch (error) {
      console.error('获取用户详情失败:', error)
      return { success: false, message: '获取用户详情失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 修改用户权限
  async updateUserRole({ commit }, { userId, role }) {
    try {
      commit('SET_LOADING', true)
      const response = await updateUserRole(userId, role)
      if (response.success) {
        commit('UPDATE_USER_ROLE', { userId, role })
      }
      return response
    } catch (error) {
      console.error('修改用户权限失败:', error)
      return { success: false, message: '修改用户权限失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 禁用/启用用户
  async updateUserStatus({ commit }, { userId, status }) {
    try {
      commit('SET_LOADING', true)
      const response = await updateUserStatus(userId, status)
      if (response.success) {
        commit('UPDATE_USER_STATUS', { userId, status })
      }
      return response
    } catch (error) {
      console.error('禁用/启用用户失败:', error)
      return { success: false, message: '禁用/启用用户失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取系统统计数据
  async getSystemStatistics({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await getSystemStatistics()
      if (response.success) {
        commit('SET_SYSTEM_STATISTICS', response.data)
      }
      return response
    } catch (error) {
      console.error('获取系统统计数据失败:', error)
      return { success: false, message: '获取系统统计数据失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取销售统计数据
  async getSalesStatistics({ commit }, { startTime, endTime, interval } = {}) {
    try {
      commit('SET_LOADING', true)
      const params = {}
      if (startTime) {
        params.startTime = startTime
      }
      if (endTime) {
        params.endTime = endTime
      }
      if (interval) {
        params.interval = interval
      }
      const response = await getSalesStatistics(params)
      if (response.success) {
        commit('SET_SALES_STATISTICS', response.data)
      }
      return response
    } catch (error) {
      console.error('获取销售统计数据失败:', error)
      return { success: false, message: '获取销售统计数据失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取商品销售排行
  async getProductSalesRanking({ commit }, { limit = 10, startTime, endTime } = {}) {
    try {
      commit('SET_LOADING', true)
      const params = { limit }
      if (startTime) {
        params.startTime = startTime
      }
      if (endTime) {
        params.endTime = endTime
      }
      const response = await getProductSalesRanking(params)
      if (response.success) {
        commit('SET_PRODUCT_SALES_RANKING', response.data)
      }
      return response
    } catch (error) {
      console.error('获取商品销售排行失败:', error)
      return { success: false, message: '获取商品销售排行失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取用户注册统计
  async getUserRegisterStatistics({ commit }, { startTime, endTime, interval } = {}) {
    try {
      commit('SET_LOADING', true)
      const params = {}
      if (startTime) {
        params.startTime = startTime
      }
      if (endTime) {
        params.endTime = endTime
      }
      if (interval) {
        params.interval = interval
      }
      const response = await getUserRegisterStatistics(params)
      if (response.success) {
        commit('SET_USER_REGISTER_STATISTICS', response.data)
      }
      return response
    } catch (error) {
      console.error('获取用户注册统计失败:', error)
      return { success: false, message: '获取用户注册统计失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

// 状态获取函数
const getters = {
  users: state => state.users,
  currentUser: state => state.currentUser,
  systemStatistics: state => state.systemStatistics,
  salesStatistics: state => state.salesStatistics,
  productSalesRanking: state => state.productSalesRanking,
  userRegisterStatistics: state => state.userRegisterStatistics,
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