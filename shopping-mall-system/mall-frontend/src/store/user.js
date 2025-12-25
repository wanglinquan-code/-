// 用户状态管理模块
import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import { 
  login as apiLogin, 
  register as apiRegister, 
  getAddressList as apiGetAddressList,
  addAddress as apiAddAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress as apiSetDefaultAddress
} from '../api/user'

Vue.use(Vuex)

// 用户状态
const state = {
  isLoggedIn: false,
  userName: '',
  userId: '',
  role: '',
  token: '',
  // 收货地址相关状态
  addresses: [],
  defaultAddress: null,
  addressLoading: false
}

// 状态修改函数
const mutations = {
  // 设置用户登录状态
  SET_LOGIN_STATUS(state, { isLoggedIn, userName, userId, role, token }) {
    state.isLoggedIn = isLoggedIn
    state.userName = userName
    state.userId = userId
    state.role = role
    state.token = token
    
    // 保存token到cookie
    if (token) {
      Cookies.set('token', token, { expires: 7 }) // 过期时间7天
    } else {
      Cookies.remove('token')
    }
  },
  
  // 登出
  LOGOUT(state) {
    state.isLoggedIn = false
    state.userName = ''
    state.userId = ''
    state.role = ''
    state.token = ''
    state.addresses = []
    state.defaultAddress = null
    Cookies.remove('token')
  },
  
  // 设置收货地址列表
  SET_ADDRESSES(state, addresses) {
    state.addresses = addresses
    // 设置默认地址
    state.defaultAddress = addresses.find(address => address.isDefault) || null
  },
  
  // 添加收货地址
  ADD_ADDRESS(state, address) {
    state.addresses.push(address)
    if (address.isDefault) {
      state.defaultAddress = address
      // 将其他地址的默认状态设为false
      state.addresses.forEach(addr => {
        if (addr.id !== address.id) {
          addr.isDefault = false
        }
      })
    }
  },
  
  // 更新收货地址
  UPDATE_ADDRESS(state, updatedAddress) {
    const index = state.addresses.findIndex(addr => addr.id === updatedAddress.id)
    if (index !== -1) {
      state.addresses[index] = updatedAddress
      if (updatedAddress.isDefault) {
        state.defaultAddress = updatedAddress
        // 将其他地址的默认状态设为false
        state.addresses.forEach(addr => {
          if (addr.id !== updatedAddress.id) {
            addr.isDefault = false
          }
        })
      } else if (state.defaultAddress && state.defaultAddress.id === updatedAddress.id) {
        state.defaultAddress = null
      }
    }
  },
  
  // 删除收货地址
  DELETE_ADDRESS(state, addressId) {
    const index = state.addresses.findIndex(addr => addr.id === addressId)
    if (index !== -1) {
      if (state.defaultAddress && state.defaultAddress.id === addressId) {
        state.defaultAddress = null
      }
      state.addresses.splice(index, 1)
    }
  },
  
  // 设置默认收货地址
  SET_DEFAULT_ADDRESS(state, addressId) {
    state.addresses.forEach(address => {
      address.isDefault = address.id === addressId
      if (address.isDefault) {
        state.defaultAddress = address
      }
    })
  },
  
  // 设置地址加载状态
  SET_ADDRESS_LOADING(state, loading) {
    state.addressLoading = loading
  }
}

// 异步操作函数
const actions = {
  // 登录
  async login({ commit }, { username, password }) {
    try {
      const response = await apiLogin(username, password)
      if (response.success) {
        commit('SET_LOGIN_STATUS', {
          isLoggedIn: true,
          userName: response.data.userName,
          userId: response.data.userId,
          role: response.data.role,
          token: response.data.token
        })
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: '登录失败，请稍后重试' }
    }
  },
  
  // 注册
  async register({ commit }, { username, password, email }) {
    try {
      const response = await apiRegister(username, password, email)
      if (response.success) {
        // 注册成功后自动登录
        return await this.dispatch('user/login', { username, password })
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: '注册失败，请稍后重试' }
    }
  },
  
  // 退出登录
  logout({ commit }) {
    commit('LOGOUT')
  },
  
  // 检查登录状态
  checkLoginStatus({ commit }) {
    const token = Cookies.get('token')
    if (token) {
      // 这里可以添加验证token有效性的逻辑
      // 暂时假设token有效
      commit('SET_LOGIN_STATUS', {
        isLoggedIn: true,
        userName: '测试用户', // 实际应用中应该从后端获取用户信息
        userId: '1',
        role: 'USER',
        token: token
      })
    }
  },
  
  // 获取收货地址列表
  async getAddressList({ commit }) {
    try {
      commit('SET_ADDRESS_LOADING', true)
      const response = await apiGetAddressList()
      if (response.success) {
        commit('SET_ADDRESSES', response.data)
      }
      return response
    } catch (error) {
      console.error('获取收货地址列表失败:', error)
      return { success: false, message: '获取收货地址列表失败' }
    } finally {
      commit('SET_ADDRESS_LOADING', false)
    }
  },
  
  // 添加收货地址
  async addAddress({ commit }, addressData) {
    try {
      const response = await apiAddAddress(addressData)
      if (response.success) {
        commit('ADD_ADDRESS', response.data)
      }
      return response
    } catch (error) {
      console.error('添加收货地址失败:', error)
      return { success: false, message: '添加收货地址失败' }
    }
  },
  
  // 更新收货地址
  async updateAddress({ commit }, { addressId, addressData }) {
    try {
      const response = await apiUpdateAddress(addressId, addressData)
      if (response.success) {
        commit('UPDATE_ADDRESS', response.data)
      }
      return response
    } catch (error) {
      console.error('更新收货地址失败:', error)
      return { success: false, message: '更新收货地址失败' }
    }
  },
  
  // 删除收货地址
  async deleteAddress({ commit }, addressId) {
    try {
      const response = await apiDeleteAddress(addressId)
      if (response.success) {
        commit('DELETE_ADDRESS', addressId)
      }
      return response
    } catch (error) {
      console.error('删除收货地址失败:', error)
      return { success: false, message: '删除收货地址失败' }
    }
  },
  
  // 设置默认收货地址
  async setDefaultAddress({ commit }, addressId) {
    try {
      const response = await apiSetDefaultAddress(addressId)
      if (response.success) {
        commit('SET_DEFAULT_ADDRESS', addressId)
      }
      return response
    } catch (error) {
      console.error('设置默认收货地址失败:', error)
      return { success: false, message: '设置默认收货地址失败' }
    }
  }
}

// 状态获取函数
const getters = {
  isLoggedIn: state => state.isLoggedIn,
  userName: state => state.userName,
  userId: state => state.userId,
  role: state => state.role,
  token: state => state.token
}

export default {
  namespaced: true, // 启用命名空间
  state,
  mutations,
  actions,
  getters
}