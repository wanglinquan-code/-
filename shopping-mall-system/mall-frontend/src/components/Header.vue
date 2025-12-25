<template>
  <header class="header">
    <div class="container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/home">购物商城</router-link>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="nav">
        <router-link to="/home" class="nav-link">首页</router-link>
        <router-link to="/product/list" class="nav-link">商品列表</router-link>
        <router-link to="/cart" class="nav-link">
          购物车
          <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
        </router-link>
      </nav>
      
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input 
          placeholder="搜索商品" 
          v-model="searchKeyword"
          @keyup.enter.native="handleSearch"
          class="search-input"
        >
          <el-button slot="append" @click="handleSearch">搜索</el-button>
        </el-input>
      </div>
      
      <!-- 用户操作 -->
      <div class="user-actions">
        <template v-if="isLoggedIn">
          <span class="welcome">欢迎，{{ userName }}</span>
          <router-link to="/user/center" class="user-link">个人中心</router-link>
          <router-link to="/order/list" class="user-link">我的订单</router-link>
          <button @click="handleLogout" class="logout-btn">退出登录</button>
          <!-- 管理员入口 -->
          <router-link v-if="isAdmin" to="/admin/index" class="admin-link">后台管理</router-link>
        </template>
        <template v-else>
          <router-link to="/user/login" class="user-link">登录</router-link>
          <router-link to="/user/register" class="user-link">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      searchKeyword: ''
    }
  },
  computed: {
    ...mapState('user', ['isLoggedIn', 'userName', 'role']),
    ...mapGetters('cart', ['cartItemCount']),
    isAdmin() {
      return this.role === 'ADMIN'
    },
    cartCount() {
      return this.cartItemCount
    }
  },
  methods: {
    handleSearch() {
      if (this.searchKeyword) {
        this.$router.push({
          path: '/product/list',
          query: { keyword: this.searchKeyword }
        })
      }
    },
    handleLogout() {
      // 调用store的退出登录方法
      this.$store.dispatch('user/logout')
      this.$message.success('退出登录成功')
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.logo a {
  color: inherit;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #303133;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #f5f7fa;
}

.search-box {
  flex: 1;
  max-width: 400px;
  margin: 0 30px;
}

.search-input {
  width: 100%;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome {
  color: #303133;
}

.user-link {
  color: #303133;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-link:hover {
  background-color: #f5f7fa;
}

.logout-btn {
  background-color: transparent;
  border: 1px solid #409EFF;
  color: #409EFF;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: #409EFF;
  color: #fff;
}

.admin-link {
  background-color: #67C23A;
  color: #fff;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.admin-link:hover {
  background-color: #85ce61;
}

.cart-count {
  background-color: #F56C6C;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
  vertical-align: top;
}
</style>