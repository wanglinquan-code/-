import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie-js'
import { Message } from 'element-ui'

// 导入页面组件
import Home from '@/views/Home'
import ProductList from '@/views/product/ProductList'
import ProductDetail from '@/views/product/ProductDetail'
import Cart from '@/views/cart/Cart'
import OrderList from '@/views/order/OrderList'
import OrderConfirm from '@/views/order/OrderConfirm'

// 用户相关页面
import UserLogin from '@/views/user/UserLogin'
import UserRegister from '@/views/user/UserRegister'
import UserCenter from '@/views/user/UserCenter'

// 管理员页面
import AdminIndex from '@/views/admin/AdminIndex'
import AdminProduct from '@/views/admin/AdminProduct'
import AdminOrder from '@/views/admin/AdminOrder'
import AdminUser from '@/views/admin/AdminUser'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/product/list', component: ProductList },
    { path: '/product/detail/:id', component: ProductDetail },
    { 
      path: '/cart', 
      component: Cart,
      meta: { requiresAuth: true } // 需要登录
    },
    { 
      path: '/order/list', 
      component: OrderList,
      meta: { requiresAuth: true }
    },
    { 
      path: '/order/confirm', 
      component: OrderConfirm,
      meta: { requiresAuth: true }
    },
    { path: '/user/login', component: UserLogin },
    { path: '/user/register', component: UserRegister },
    { 
      path: '/user/center', 
      component: UserCenter,
      meta: { requiresAuth: true }
    },
    { 
      path: '/admin/index', 
      component: AdminIndex,
      meta: { requiresAuth: true, requiresAdmin: true }, // 需要管理员权限
      children: [
        { path: 'product', component: AdminProduct },
        { path: 'order', component: AdminOrder },
        { path: 'user', component: AdminUser },
        { path: '', redirect: 'product' }
      ]
    }
  ]
})

// 路由守卫：验证登录和权限
router.beforeEach((to, from, next) => {
  const token = VueCookie.get('token')
  // 需要登录的页面
  if (to.meta.requiresAuth) {
    if (!token) {
      Message.warning('请先登录')
      next('/user/login')
    } else {
      // 验证管理员权限
      if (to.meta.requiresAdmin) {
        const role = Vue.prototype.$store.state.user.role
        if (role === 'ADMIN') {
          next()
        } else {
          Message.error('无管理员权限')
          next(from.path)
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router