<template>
  <div class="user-center">
    <el-card shadow="hover" class="center-card">
      <div class="center-header">
        <h2>个人中心</h2>
      </div>
      
      <el-tabs type="border-card" class="center-tabs">
        <el-tab-pane label="个人信息">
          <el-form 
            :model="userInfo" 
            :rules="userInfoRules" 
            ref="userInfoForm"
            label-width="100px"
            class="user-info-form"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userInfo.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="userInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="userInfo.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
                <el-radio label="保密">保密</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="生日">
              <el-date-picker 
                v-model="userInfo.birthday" 
                type="date"
                placeholder="选择生日"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateUserInfo">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="修改密码">
          <el-form 
            :model="passwordForm" 
            :rules="passwordRules" 
            ref="passwordForm"
            label-width="100px"
            class="password-form"
          >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input 
                v-model="passwordForm.oldPassword" 
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input 
                v-model="passwordForm.newPassword" 
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input 
                v-model="passwordForm.confirmPassword" 
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="收货地址">
          <div class="address-tab">
            <el-button 
              type="primary" 
              @click="openAddressForm"
              class="add-address-btn"
            >
              <i class="el-icon-plus"></i> 添加收货地址
            </el-button>
            
            <div class="address-list">
              <el-card 
                v-for="address in addresses" 
                :key="address.id"
                shadow="hover"
                class="address-card"
              >
                <div class="address-info">
                  <div class="address-header">
                    <span class="address-name">{{ address.name }}</span>
                    <span class="address-phone">{{ address.phone }}</span>
                    <el-tag v-if="address.isDefault" type="primary" size="small">默认</el-tag>
                  </div>
                  <div class="address-detail">{{ address.detailAddress }}</div>
                </div>
                <div class="address-actions">
                  <el-button 
                    size="small" 
                    type="primary"
                    @click="editAddress(address)"
                  >
                    编辑
                  </el-button>
                  <el-button 
                    size="small" 
                    type="success"
                    v-if="!address.isDefault"
                    @click="handleSetDefaultAddress(address.id)"
                  >
                    默认
                  </el-button>
                  <el-button 
                    size="small" 
                    type="danger"
                    @click="handleDeleteAddress(address.id)"
                  >
                    删除
                  </el-button>
                </div>
              </el-card>
              
              <div v-if="addresses.length === 0" class="no-address">
                <el-empty description="暂无收货地址" />
              </div>
            </div>
          </div>
          
          <!-- 地址表单对话框 -->
          <el-dialog 
            :title="addressDialog.title" 
            :visible.sync="addressDialog.visible"
            width="500px"
          >
            <el-form 
              :model="addressForm" 
              :rules="addressRules" 
              ref="addressForm"
              label-width="80px"
            >
              <el-form-item label="收货人" prop="name">
                <el-input v-model="addressForm.name"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="addressForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="详细地址" prop="detailAddress">
                <el-input 
                  v-model="addressForm.detailAddress" 
                  type="textarea"
                  :rows="3"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否默认">
                <el-switch v-model="addressForm.isDefault"></el-switch>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addressDialog.visible = false">取消</el-button>
              <el-button type="primary" @click="saveAddress">保存</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserCenter',
  data() {
    return {
      userInfo: {
        username: '测试用户',
        email: 'test@example.com',
        phone: '13800138000',
        gender: '男',
        birthday: ''
      },
      userInfoRules: {
        email: [
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
        ]
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
      },
      // 收货地址表单
      addressForm: {
        id: null,
        name: '',
        phone: '',
        detailAddress: '',
        isDefault: false
      },
      addressRules: {
        name: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      addressDialog: {
        visible: false,
        title: '添加收货地址'
      }
    }
  },
  computed: {
    ...mapGetters('user', ['addresses', 'addressLoading'])
  },
  methods: {
    ...mapActions('user', [
      'getAddressList',
      'addAddress',
      'updateAddress',
      'deleteAddress',
      'setDefaultAddress'
    ]),
    // 验证确认密码
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    // 更新个人信息
    updateUserInfo() {
      this.$refs.userInfoForm.validate((valid) => {
        if (valid) {
          // 实际应用中需要调用API
          this.$message.success('个人信息更新成功')
        }
      })
    },
    // 更新密码
    updatePassword() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          // 实际应用中需要调用API
          this.$message.success('密码修改成功')
          // 重置表单
          this.$refs.passwordForm.resetFields()
        }
      })
    },
    // 打开地址表单
    openAddressForm() {
      this.addressDialog.title = '添加收货地址'
      this.addressForm = {
        id: null,
        name: '',
        phone: '',
        detailAddress: '',
        isDefault: false
      }
      this.$refs.addressForm && this.$refs.addressForm.resetFields()
      this.addressDialog.visible = true
    },
    // 编辑地址
    editAddress(address) {
      this.addressDialog.title = '编辑收货地址'
      this.addressForm = { ...address }
      this.addressDialog.visible = true
    },
    // 保存地址
    async saveAddress() {
      this.$refs.addressForm.validate(async (valid) => {
        if (valid) {
          try {
            if (this.addressForm.id) {
              await this.updateAddress(this.addressForm)
              this.$message.success('地址更新成功')
            } else {
              await this.addAddress(this.addressForm)
              this.$message.success('地址添加成功')
            }
            this.addressDialog.visible = false
          } catch (error) {
            this.$message.error(error.response?.data?.message || '操作失败')
          }
        }
      })
    },
    // 删除地址
    async handleDeleteAddress(addressId) {
      try {
        await this.$confirm('确定要删除该地址吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await this.deleteAddress(addressId)
        this.$message.success('地址删除成功')
      } catch (error) {
        if (error === 'cancel') return
        this.$message.error(error.response?.data?.message || '删除失败')
      }
    },
    // 设置默认地址
    async handleSetDefaultAddress(addressId) {
      try {
        await this.setDefaultAddress(addressId)
        this.$message.success('默认地址设置成功')
      } catch (error) {
        this.$message.error(error.response?.data?.message || '设置失败')
      }
    }
  },
  mounted() {
    // 实际应用中需要从API获取用户信息
    // this.getUserInfo()
    
    // 获取收货地址列表
    this.getAddressList()
  }
}
</script>

<style scoped>
.user-center {
  max-width: 800px;
  margin: 0 auto;
}

.center-card {
  padding: 20px;
}

.center-header {
  margin-bottom: 20px;
}

.center-header h2 {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.center-tabs {
  margin-top: 20px;
}

.user-info-form,
.password-form {
  max-width: 500px;
}

/* 收货地址样式 */
.address-tab {
  margin-top: 20px;
}

.add-address-btn {
  margin-bottom: 20px;
}

.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.address-card {
  transition: all 0.3s;
}

.address-info {
  margin-bottom: 15px;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.address-name {
  font-weight: bold;
  color: #303133;
}

.address-phone {
  color: #606266;
}

.address-detail {
  color: #909399;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
}

.no-address {
  text-align: center;
  padding: 40px 0;
}
</style>