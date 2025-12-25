<template>
  <div class="login-container">
    <el-card shadow="hover" class="login-card">
      <div class="login-header">
        <h2>用户登录</h2>
      </div>
      <el-form 
        :model="loginForm" 
        :rules="loginRules" 
        ref="loginForm"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <el-link type="primary" :underline="false" class="forget-password">
            忘记密码？
          </el-link>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading"
            size="large"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="register-link">
        <span>还没有账号？</span>
        <el-link type="primary" :underline="false" @click="goToRegister">
          立即注册
        </el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 处理登录
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const result = await this.$store.dispatch('user/login', {
              username: this.loginForm.username,
              password: this.loginForm.password
            })
            if (result.success) {
              this.$message.success('登录成功')
              // 跳转到首页或之前访问的页面
              const redirect = this.$route.query.redirect || '/home'
              this.$router.push(redirect)
            } else {
              this.$message.error(result.message || '登录失败')
            }
          } catch (error) {
            this.$message.error('登录失败，请稍后重试')
          } finally {
            this.loading = false
          }
        }
      })
    },
    // 跳转到注册页面
    goToRegister() {
      this.$router.push('/user/register')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-header h2 {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.login-form {
  margin-bottom: 20px;
}

.forget-password {
  float: right;
}

.login-button {
  width: 100%;
}

.register-link {
  text-align: center;
  color: #606266;
  margin-top: 10px;
}
</style>