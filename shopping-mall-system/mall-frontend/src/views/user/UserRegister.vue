<template>
  <div class="register-container">
    <el-card shadow="hover" class="register-card">
      <div class="register-header">
        <h2>用户注册</h2>
      </div>
      <el-form 
        :model="registerForm" 
        :rules="registerRules" 
        ref="registerForm"
        label-width="80px"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="registerForm.username" 
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="registerForm.email" 
            placeholder="请输入邮箱"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister" 
            :loading="loading"
            size="large"
            class="register-button"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-link">
        <span>已有账号？</span>
        <el-link type="primary" :underline="false" @click="goToLogin">
          立即登录
        </el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserRegister',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 验证确认密码
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    // 处理注册
    async handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const result = await this.$store.dispatch('user/register', {
              username: this.registerForm.username,
              password: this.registerForm.password,
              email: this.registerForm.email
            })
            if (result.success) {
              this.$message.success('注册成功')
              // 注册成功后跳转到首页
              this.$router.push('/home')
            } else {
              this.$message.error(result.message || '注册失败')
            }
          } catch (error) {
            this.$message.error('注册失败，请稍后重试')
          } finally {
            this.loading = false
          }
        }
      })
    },
    // 跳转到登录页面
    goToLogin() {
      this.$router.push('/user/login')
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
  padding: 20px;
}

.register-header {
  text-align: center;
  margin-bottom: 20px;
}

.register-header h2 {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.register-form {
  margin-bottom: 20px;
}

.register-button {
  width: 100%;
}

.login-link {
  text-align: center;
  color: #606266;
  margin-top: 10px;
}
</style>