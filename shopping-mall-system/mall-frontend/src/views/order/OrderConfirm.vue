<template>
  <div class="order-confirm">
    <el-card shadow="hover" class="confirm-card">
      <div class="confirm-header">
        <h2>确认订单</h2>
      </div>
      
      <!-- 收货地址 -->
      <div class="confirm-section">
        <div class="section-header">
          <h3>收货地址</h3>
          <el-button type="primary" size="small" @click="selectAddress">
            <i class="el-icon-plus"></i>选择/修改地址
          </el-button>
        </div>
        <div class="address-card">
          <div v-if="selectedAddress" class="address-info">
            <div class="address-name">{{ selectedAddress.name }}</div>
            <div class="address-phone">{{ selectedAddress.phone }}</div>
            <div class="address-detail">{{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.district }} {{ selectedAddress.address }}</div>
          </div>
          <div v-else class="empty-address">
            <el-empty description="暂无收货地址">
              <el-button type="primary" @click="selectAddress">添加收货地址</el-button>
            </el-empty>
          </div>
        </div>
      </div>
      
      <!-- 配送方式 -->
      <div class="confirm-section">
        <div class="section-header">
          <h3>配送方式</h3>
        </div>
        <div class="delivery-options">
          <el-radio-group v-model="selectedDelivery">
            <el-radio-button label="standard">标准配送</el-radio-button>
            <el-radio-button label="express">加急配送</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <!-- 支付方式 -->
      <div class="confirm-section">
        <div class="section-header">
          <h3>支付方式</h3>
        </div>
        <div class="payment-options">
          <el-radio-group v-model="selectedPayment">
            <el-radio-button label="alipay">支付宝</el-radio-button>
            <el-radio-button label="wechat">微信支付</el-radio-button>
            <el-radio-button label="card">银行卡</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <!-- 商品清单 -->
      <div class="confirm-section">
        <div class="section-header">
          <h3>商品清单</h3>
        </div>
        <div class="product-list">
          <div 
            v-for="item in cartItems" 
            :key="item.id" 
            class="product-item">
            <img :src="item.productImage" :alt="item.productName" class="product-image">
            <div class="product-info">
              <div class="product-name">{{ item.productName }}</div>
              <div class="product-spec">{{ item.productSpec }}</div>
              <div class="product-price">¥{{ item.productPrice }}</div>
            </div>
            <div class="product-quantity">x{{ item.quantity }}</div>
          </div>
        </div>
      </div>
      
      <!-- 订单金额 -->
      <div class="confirm-section">
        <div class="section-header">
          <h3>订单金额</h3>
        </div>
        <div class="amount-details">
          <div class="amount-item">
            <span class="amount-label">商品总价:</span>
            <span class="amount-value">¥{{ totalAmount }}</span>
          </div>
          <div class="amount-item">
            <span class="amount-label">运费:</span>
            <span class="amount-value">¥{{ shippingFee }}</span>
          </div>
          <div class="amount-item">
            <span class="amount-label">优惠:</span>
            <span class="amount-value amount-discount">-¥{{ discount }}</span>
          </div>
          <div class="amount-item total">
            <span class="amount-label">实付金额:</span>
            <span class="amount-value amount-total">¥{{ actualPayment }}</span>
          </div>
        </div>
      </div>
      
      <!-- 提交订单 -->
      <div class="submit-section">
        <div class="submit-info">
          <span class="submit-label">实付金额:</span>
          <span class="submit-value">¥{{ actualPayment }}</span>
        </div>
        <el-button type="primary" size="large" @click="submitOrder" :disabled="!selectedAddress">
          提交订单
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrderConfirm',
  data() {
    return {
      // 收货地址
      selectedAddress: {
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        address: '科技园路1号'
      },
      // 配送方式
      selectedDelivery: 'standard',
      // 支付方式
      selectedPayment: 'alipay',
      // 购物车商品
      cartItems: [
        {
          id: 1,
          productId: 1,
          productName: '智能手机',
          productSpec: '8GB内存/256GB存储',
          productPrice: 2999,
          quantity: 1,
          productImage: 'https://via.placeholder.com/80x80?text=Product1'
        },
        {
          id: 2,
          productId: 2,
          productName: '笔记本电脑',
          productSpec: '16GB内存/512GB SSD',
          productPrice: 5999,
          quantity: 1,
          productImage: 'https://via.placeholder.com/80x80?text=Product2'
        }
      ],
      // 配送费用
      shippingFee: 10,
      // 优惠金额
      discount: 0
    }
  },
  computed: {
    // 商品总价
    totalAmount() {
      return this.cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0)
    },
    // 实际支付金额
    actualPayment() {
      return this.totalAmount + this.shippingFee - this.discount
    }
  },
  methods: {
    // 选择收货地址
    selectAddress() {
      this.$message.info('地址选择功能开发中')
    },
    // 提交订单
    submitOrder() {
      if (!this.selectedAddress) {
        this.$message.error('请选择收货地址')
        return
      }
      
      // 实际应用中需要调用API提交订单
      this.$confirm('确定要提交订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟提交订单成功
        this.$message.success('订单提交成功')
        // 跳转到支付页面
        this.$router.push({
          path: '/order/pay',
          query: {
            orderNo: 'ORD' + new Date().getTime(),
            amount: this.actualPayment
          }
        })
      }).catch(() => {
        this.$message.info('已取消提交')
      })
    }
  },
  mounted() {
    // 实际应用中需要从购物车获取商品数据
    // this.getCartItems()
  }
}
</script>

<style scoped>
.order-confirm {
  max-width: 1200px;
  margin: 0 auto;
}

.confirm-card {
  padding: 20px;
}

.confirm-header {
  margin-bottom: 30px;
}

.confirm-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
}

.address-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.address-name {
  font-weight: 500;
  font-size: 16px;
}

.address-phone {
  color: #606266;
}

.address-detail {
  color: #303133;
  line-height: 1.5;
}

.empty-address {
  text-align: center;
  padding: 40px 0;
}

.delivery-options,
.payment-options {
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.product-item:hover {
  background-color: #f5f7fa;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-spec {
  color: #909399;
  font-size: 14px;
  margin-bottom: 5px;
}

.product-price {
  color: #F56C6C;
  font-weight: 500;
}

.product-quantity {
  color: #606266;
  font-size: 16px;
}

.amount-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-label {
  color: #606266;
}

.amount-value {
  color: #303133;
}

.amount-discount {
  color: #F56C6C;
}

.amount-total {
  color: #F56C6C;
  font-size: 18px;
  font-weight: bold;
}

.amount-item.total {
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.submit-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.submit-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.submit-label {
  color: #606266;
  font-size: 16px;
}

.submit-value {
  color: #F56C6C;
  font-size: 24px;
  font-weight: bold;
}

.submit-section .el-button {
  font-size: 18px;
  padding: 15px 30px;
}
</style>