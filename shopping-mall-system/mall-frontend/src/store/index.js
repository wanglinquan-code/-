// 根Store文件
import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import product from './product'
import cart from './cart'
import order from './order'
import admin from './admin'

Vue.use(Vuex)

// 创建Store实例
const store = new Vuex.Store({
  // 模块
  modules: {
    user, // 用户模块
    product, // 商品模块
    cart, // 购物车模块
    order, // 订单模块
    admin // 管理员模块
  }
})

export default store