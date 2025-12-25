<template>
  <div class="order-pay">
    <el-card shadow="hover" class="pay-card">
      <div class="pay-header">
        <h2>订单支付</h2>
      </div>
      
      <!-- 订单信息 -->
      <div class="pay-section">
        <div class="section-header">
          <h3>订单信息</h3>
        </div>
        <div class="order-info">
          <div class="order-item">
            <span class="order-label">订单编号:</span>
            <span class="order-value">{{ orderNo }}</span>
          </div>
          <div class="order-item">
            <span class="order-label">支付金额:</span>
            <span class="order-value amount">¥{{ amount }}</span>
          </div>
        </div>
      </div>
      
      <!-- 支付方式选择 -->
      <div class="pay-section">
        <div class="section-header">
          <h3>选择支付方式</h3>
        </div>
        <div class="payment-methods">
          <el-radio-group v-model="selectedPayment">
            <el-radio :label="'alipay'">
              <div class="payment-method-item">
                <div class="method-icon alipay"></div>
                <div class="method-name">支付宝</div>
              </div>
            </el-radio>
            <el-radio :label="'wechat'">
              <div class="payment-method-item">
                <div class="method-icon wechat"></div>
                <div class="method-name">微信支付</div>
              </div>
            </el-radio>
            <el-radio :label="'card'">
              <div class="payment-method-item">
                <div class="method-icon card"></div>
                <div class="method-name">银行卡支付</div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      
      <!-- 支付提示 -->
      <div class="pay-section">
        <div class="section-header">
          <h3>支付提示</h3>
        </div>
        <div class="payment-tips">
          <el-alert
            title="请在30分钟内完成支付"
            type="warning"
            :closable="false"
            show-icon>
          </el-alert>
        </div>
      </div>
      
      <!-- 支付按钮 -->
      <div class="pay-actions">
        <el-button type="primary" size="large" @click="handlePay" :loading="paying">
          <i v-if="!paying" class="el-icon-circle-check"></i>
          {{ paying ? '支付中...' : '立即支付' }}
        </el-button>
        <el-button size="large" @click="cancelPay">
          <i class="el-icon-circle-close"></i>取消支付
        </el-button>
      </div>
      
      <!-- 支付成功弹窗 -->
      <el-dialog
        title="支付结果"
        :visible.sync="paySuccessDialogVisible"
        width="30%"
        center>
        <div class="success-content">
          <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
          <div class="success-message">支付成功！</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="goToOrderList">查看订单</el-button>
          <el-button @click="goToHome">继续购物</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { CircleCheckFilled } from '@element-ui/icons-vue'

export default {
  name: 'OrderPay',
  components: {
    CircleCheckFilled
  },
  data() {
    return {
      // 订单信息
      orderNo: '',
      amount: 0,
      // 支付方式
      selectedPayment: 'alipay',
      // 支付状态
      paying: false,
      // 支付成功弹窗
      paySuccessDialogVisible: false
    }
  },
  methods: {
    // 处理支付
    handlePay() {
      this.paying = true
      
      // 模拟支付过程
      setTimeout(() => {
        this.paying = false
        this.paySuccessDialogVisible = true
        this.$message.success('支付成功')
        
        // 实际应用中需要调用支付API
        // this.payOrder()
      }, 2000)
    },
    // 取消支付
    cancelPay() {
      this.$confirm('确定要取消支付吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.info('已取消支付')
        this.$router.push('/order/list')
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 跳转到订单列表
    goToOrderList() {
      this.paySuccessDialogVisible = false
      this.$router.push('/order/list')
    },
    // 跳转到首页
    goToHome() {
      this.paySuccessDialogVisible = false
      this.$router.push('/home')
    },
    // 实际支付API调用
    payOrder() {
      // 调用支付API的逻辑
      // 示例：
      // this.$api.order.pay({
      //   orderNo: this.orderNo,
      //   paymentMethod: this.selectedPayment,
      //   amount: this.amount
      // }).then(res => {
      //   // 处理支付结果
      // })
    }
  },
  mounted() {
    // 从路由参数获取订单信息
    this.orderNo = this.$route.query.orderNo || 'ORD' + new Date().getTime()
    this.amount = parseFloat(this.$route.query.amount) || 0
    
    if (!this.orderNo || this.amount <= 0) {
      this.$message.error('订单信息错误')
      this.$router.push('/order/list')
    }
  }
}
</script>

<style scoped>
.order-pay {
  max-width: 1200px;
  margin: 0 auto;
}

.pay-card {
  padding: 20px;
}

.pay-header {
  margin-bottom: 30px;
}

.pay-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-label {
  color: #606266;
  font-size: 16px;
}

.order-value {
  color: #303133;
  font-size: 16px;
}

.order-value.amount {
  color: #F56C6C;
  font-size: 24px;
  font-weight: bold;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.payment-methods .el-radio {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-methods .el-radio:hover {
  border-color: #409EFF;
}

.payment-methods .el-radio.is-checked {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.payment-method-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.method-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.method-icon.alipay {
  background-color: #1677ff;
  background-image: url('https://img.alicdn.com/imgextra/i2/O1CN019m05hY1g9n7n7xHd5_!!6000000004594-2-tps-800-800.png');
}

.method-icon.wechat {
  background-color: #07c160;
  background-image: url('https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico');
}

.method-icon.card {
  background-color: #f7ba2a;
  background-image: url('https://img.alicdn.com/imgextra/i4/O1CN01E8Z9qJ1cBm6R6HjKd_!!6000000003422-2-tps-800-800.png');
}

.method-name {
  font-size: 16px;
  color: #303133;
}

.payment-tips {
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.pay-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.pay-actions .el-button {
  font-size: 18px;
  padding: 15px 40px;
}

.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 64px;
  color: #67c23a;
  margin-bottom: 20px;
}

.success-message {
  font-size: 24px;
  color: #303133;
  font-weight: 500;
}
</style>