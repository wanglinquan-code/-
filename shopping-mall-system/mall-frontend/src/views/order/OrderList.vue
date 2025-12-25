<template>
  <div class="order-list">
    <el-card shadow="hover" class="list-card">
      <div class="list-header">
        <h2>我的订单</h2>
      </div>
      
      <!-- 订单状态筛选 -->
      <div class="order-filters">
        <el-radio-group v-model="selectedStatus" @change="handleStatusChange">
          <el-radio-button :label="''">全部订单</el-radio-button>
          <el-radio-button :label="'PENDING'">待付款</el-radio-button>
          <el-radio-button :label="'PAID'">待发货</el-radio-button>
          <el-radio-button :label="'SHIPPED'">待收货</el-radio-button>
          <el-radio-button :label="'COMPLETED'">已完成</el-radio-button>
          <el-radio-button :label="'CANCELLED'">已取消</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 订单列表 -->
      <div v-if="filteredOrders.length === 0" class="empty-orders">
        <el-empty description="暂无订单">
          <el-button type="primary" @click="goToHome">去购物</el-button>
        </el-empty>
      </div>
      
      <div v-else class="orders-list">
        <el-card 
          v-for="order in filteredOrders" 
          :key="order.id" 
          shadow="hover" 
          class="order-card">
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">订单编号: {{ order.orderNo }}</span>
              <span class="order-time">下单时间: {{ order.createTime }}</span>
            </div>
            <div class="order-status">
              <el-tag :type="getStatusTagType(order.status)">
                {{ getStatusText(order.status) }}
              </el-tag>
            </div>
          </div>
          
          <!-- 订单商品列表 -->
          <div class="order-products">
            <div 
              v-for="item in order.orderItems" 
              :key="item.id" 
              class="order-product-item"
              @click="goToProductDetail(item.productId)">
              <img :src="item.productImage" :alt="item.productName" class="product-image">
              <div class="product-info">
                <div class="product-name">{{ item.productName }}</div>
                <div class="product-spec">{{ item.productSpec }}</div>
                <div class="product-price">¥{{ item.productPrice }}</div>
              </div>
              <div class="product-quantity">x{{ item.quantity }}</div>
            </div>
          </div>
          
          <!-- 订单金额信息 -->
          <div class="order-amount">
            <div class="amount-info">
              <span class="amount-label">共{{ order.totalItems }}件商品</span>
              <span class="amount-label">商品总价:</span>
              <span class="amount-value">¥{{ order.totalAmount }}</span>
            </div>
            <div class="order-actions">
              <el-button 
                v-if="order.status === 'PENDING'" 
                type="primary" 
                size="small" 
                @click="payOrder(order.id)">
                立即支付
              </el-button>
              <el-button 
                v-if="order.status === 'PENDING'" 
                size="small" 
                @click="cancelOrder(order.id)">
                取消订单
              </el-button>
              <el-button 
                v-if="order.status === 'SHIPPED'" 
                type="success" 
                size="small" 
                @click="confirmReceipt(order.id)">
                确认收货
              </el-button>
              <el-button 
                v-if="order.status === 'COMPLETED'" 
                type="info" 
                size="small" 
                @click="viewOrderDetail(order.id)">
                查看详情
              </el-button>
              <el-button 
                v-if="order.status === 'COMPLETED'" 
                type="warning" 
                size="small" 
                @click="reorder(order.id)">
                再次购买
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalOrders">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  data() {
    return {
      // 订单列表数据
      orders: [
        {
          id: 1,
          orderNo: 'ORD202306010001',
          createTime: '2023-06-01 14:30:00',
          status: 'COMPLETED',
          totalAmount: 5999,
          totalItems: 1,
          orderItems: [
            {
              id: 1,
              productId: 2,
              productName: '笔记本电脑',
              productSpec: '16GB内存/512GB SSD',
              productPrice: 5999,
              quantity: 1,
              productImage: 'https://via.placeholder.com/80x80?text=Product2'
            }
          ]
        },
        {
          id: 2,
          orderNo: 'ORD202306020002',
          createTime: '2023-06-02 10:15:00',
          status: 'SHIPPED',
          totalAmount: 2999,
          totalItems: 1,
          orderItems: [
            {
              id: 2,
              productId: 1,
              productName: '智能手机',
              productSpec: '8GB内存/256GB存储',
              productPrice: 2999,
              quantity: 1,
              productImage: 'https://via.placeholder.com/80x80?text=Product1'
            }
          ]
        },
        {
          id: 3,
          orderNo: 'ORD202306030003',
          createTime: '2023-06-03 16:45:00',
          status: 'PENDING',
          totalAmount: 1299,
          totalItems: 1,
          orderItems: [
            {
              id: 3,
              productId: 3,
              productName: '无线耳机',
              productSpec: '黑色',
              productPrice: 1299,
              quantity: 1,
              productImage: 'https://via.placeholder.com/80x80?text=Product3'
            }
          ]
        },
        {
          id: 4,
          orderNo: 'ORD202306040004',
          createTime: '2023-06-04 09:20:00',
          status: 'PAID',
          totalAmount: 1999,
          totalItems: 1,
          orderItems: [
            {
              id: 4,
              productId: 4,
              productName: '智能手表',
              productSpec: '运动版',
              productPrice: 1999,
              quantity: 1,
              productImage: 'https://via.placeholder.com/80x80?text=Product4'
            }
          ]
        },
        {
          id: 5,
          orderNo: 'ORD202306050005',
          createTime: '2023-06-05 11:35:00',
          status: 'CANCELLED',
          totalAmount: 3299,
          totalItems: 1,
          orderItems: [
            {
              id: 5,
              productId: 5,
              productName: '平板电脑',
              productSpec: '10.5英寸',
              productPrice: 3299,
              quantity: 1,
              productImage: 'https://via.placeholder.com/80x80?text=Product5'
            }
          ]
        }
      ],
      // 筛选条件
      selectedStatus: '',
      // 分页数据
      currentPage: 1,
      pageSize: 5,
      totalOrders: 5
    }
  },
  computed: {
    // 筛选后的订单列表
    filteredOrders() {
      if (!this.selectedStatus) {
        return this.orders
      }
      return this.orders.filter(order => order.status === this.selectedStatus)
    }
  },
  methods: {
    // 获取订单状态文本
    getStatusText(status) {
      const statusMap = {
        'PENDING': '待付款',
        'PAID': '待发货',
        'SHIPPED': '待收货',
        'COMPLETED': '已完成',
        'CANCELLED': '已取消'
      }
      return statusMap[status] || '未知状态'
    },
    // 获取订单状态标签类型
    getStatusTagType(status) {
      const typeMap = {
        'PENDING': 'warning',
        'PAID': 'primary',
        'SHIPPED': 'info',
        'COMPLETED': 'success',
        'CANCELLED': 'danger'
      }
      return typeMap[status] || 'info'
    },
    // 状态筛选变化
    handleStatusChange() {
      this.currentPage = 1
    },
    // 跳转到首页
    goToHome() {
      this.$router.push('/home')
    },
    // 跳转到商品详情页
    goToProductDetail(productId) {
      this.$router.push(`/product/detail/${productId}`)
    },
    // 支付订单
    payOrder(orderId) {
      this.$message.success('跳转到支付页面')
      // 实际应用中需要调用支付API
    },
    // 取消订单
    cancelOrder(orderId) {
      this.$confirm('确定要取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际应用中需要调用API取消订单
        this.$message.success('订单已取消')
        // 更新本地订单状态
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.status = 'CANCELLED'
        }
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 确认收货
    confirmReceipt(orderId) {
      this.$confirm('确定已收到商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        // 实际应用中需要调用API确认收货
        this.$message.success('确认收货成功')
        // 更新本地订单状态
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.status = 'COMPLETED'
        }
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 查看订单详情
    viewOrderDetail(orderId) {
      this.$message.info('查看订单详情功能开发中')
      // 实际应用中需要跳转到订单详情页
    },
    // 再次购买
    reorder(orderId) {
      this.$message.success('商品已加入购物车')
      // 实际应用中需要将订单商品重新加入购物车
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size
    },
    // 当前页变化
    handleCurrentChange(current) {
      this.currentPage = current
    }
  },
  mounted() {
    // 实际应用中需要从API获取订单列表
    // this.getOrderList()
  }
}
</script>

<style scoped>
.order-list {
  max-width: 1200px;
  margin: 0 auto;
}

.list-card {
  padding: 20px;
}

.list-header {
  margin-bottom: 20px;
}

.order-filters {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.empty-orders {
  padding: 40px 0;
  text-align: center;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  padding: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.order-info {
  display: flex;
  gap: 20px;
}

.order-id {
  font-weight: 500;
  color: #303133;
}

.order-time {
  color: #606266;
}

.order-products {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.order-product-item {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.order-product-item:hover {
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

.order-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.amount-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.amount-label {
  color: #606266;
}

.amount-value {
  font-size: 20px;
  font-weight: bold;
  color: #F56C6C;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>