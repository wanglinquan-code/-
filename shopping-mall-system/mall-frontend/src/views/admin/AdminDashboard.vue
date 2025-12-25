<template>
  <div class="admin-dashboard">
    <el-card shadow="hover" class="dashboard-card">
      <div class="dashboard-header">
        <h2>后台管理仪表盘</h2>
      </div>
      
      <!-- 统计卡片 -->
      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon stat-user">
                  <el-icon><UserFilled /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ totalUsers }}</div>
                  <div class="stat-label">总用户数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon stat-product">
                  <el-icon><GoodsFilled /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ totalProducts }}</div>
                  <div class="stat-label">总商品数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon stat-order">
                  <el-icon><DocumentFilled /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ totalOrders }}</div>
                  <div class="stat-label">总订单数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon stat-sales">
                  <el-icon><MoneyFilled /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">¥{{ totalSales }}</div>
                  <div class="stat-label">总销售额</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 订单状态统计 -->
      <div class="order-stats-section">
        <el-card shadow="hover" class="stats-card">
          <div class="section-header">
            <h3>订单状态统计</h3>
          </div>
          <div class="order-stats">
            <el-row :gutter="20">
              <el-col :xs="12" :sm="12" :md="6" :lg="4">
                <div class="order-stat-item">
                  <div class="order-stat-label">待付款</div>
                  <div class="order-stat-value">{{ pendingOrders }}</div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :md="6" :lg="4">
                <div class="order-stat-item">
                  <div class="order-stat-label">待发货</div>
                  <div class="order-stat-value">{{ paidOrders }}</div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :md="6" :lg="4">
                <div class="order-stat-item">
                  <div class="order-stat-label">待收货</div>
                  <div class="order-stat-value">{{ shippedOrders }}</div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :md="6" :lg="4">
                <div class="order-stat-item">
                  <div class="order-stat-label">已完成</div>
                  <div class="order-stat-value">{{ completedOrders }}</div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :md="6" :lg="4">
                <div class="order-stat-item">
                  <div class="order-stat-label">已取消</div>
                  <div class="order-stat-value">{{ cancelledOrders }}</div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :md="6" :lg="4">
                <div class="order-stat-item">
                  <div class="order-stat-label">退款中</div>
                  <div class="order-stat-value">{{ refundingOrders }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
      
      <!-- 最近订单列表 -->
      <div class="recent-orders-section">
        <el-card shadow="hover" class="orders-card">
          <div class="section-header">
            <h3>最近订单</h3>
            <el-button type="primary" size="small" @click="goToOrderList">
              <i class="el-icon-right"></i>查看全部
            </el-button>
          </div>
          <el-table :data="recentOrders" stripe border style="width: 100%">
            <el-table-column prop="orderNo" label="订单编号" width="180">
              <template slot-scope="scope">
                <a href="javascript:void(0)" @click="viewOrderDetail(scope.row.id)">{{ scope.row.orderNo }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
            <el-table-column prop="userName" label="用户名称"></el-table-column>
            <el-table-column prop="totalAmount" label="订单金额" width="120">
              <template slot-scope="scope">¥{{ scope.row.totalAmount }}</template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="120">
              <template slot-scope="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="processOrder(scope.row.id)">
                  <i class="el-icon-setting"></i>处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { UserFilled, GoodsFilled, DocumentFilled, MoneyFilled } from '@element-ui/icons-vue'

export default {
  name: 'AdminDashboard',
  components: {
    UserFilled,
    GoodsFilled,
    DocumentFilled,
    MoneyFilled
  },
  data() {
    return {
      // 统计数据
      totalUsers: 1258,
      totalProducts: 368,
      totalOrders: 2546,
      totalSales: 1285600,
      // 订单状态统计
      pendingOrders: 56,
      paidOrders: 89,
      shippedOrders: 124,
      completedOrders: 2245,
      cancelledOrders: 32,
      refundingOrders: 10,
      // 最近订单
      recentOrders: [
        {
          id: 1,
          orderNo: 'ORD202306150012',
          createTime: '2023-06-15 14:30:00',
          userName: '张三',
          totalAmount: 2999,
          status: 'PAID'
        },
        {
          id: 2,
          orderNo: 'ORD202306150011',
          createTime: '2023-06-15 14:25:00',
          userName: '李四',
          totalAmount: 1299,
          status: 'PENDING'
        },
        {
          id: 3,
          orderNo: 'ORD202306150010',
          createTime: '2023-06-15 14:20:00',
          userName: '王五',
          totalAmount: 5999,
          status: 'SHIPPED'
        },
        {
          id: 4,
          orderNo: 'ORD202306150009',
          createTime: '2023-06-15 14:15:00',
          userName: '赵六',
          totalAmount: 3299,
          status: 'COMPLETED'
        },
        {
          id: 5,
          orderNo: 'ORD202306150008',
          createTime: '2023-06-15 14:10:00',
          userName: '孙七',
          totalAmount: 1999,
          status: 'PAID'
        }
      ]
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
        'CANCELLED': '已取消',
        'REFUNDING': '退款中'
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
        'CANCELLED': 'danger',
        'REFUNDING': 'warning'
      }
      return typeMap[status] || 'info'
    },
    // 跳转到订单列表
    goToOrderList() {
      this.$router.push('/admin/orders')
    },
    // 查看订单详情
    viewOrderDetail(orderId) {
      this.$router.push(`/admin/order/detail/${orderId}`)
    },
    // 处理订单
    processOrder(orderId) {
      this.$router.push(`/admin/order/detail/${orderId}`)
    }
  },
  mounted() {
    // 实际应用中需要从API获取统计数据
    // this.getStatsData()
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-card {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 30px;
}

.stats-section {
  margin-bottom: 30px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: #fff;
}

.stat-icon.stat-user {
  background-color: #409EFF;
}

.stat-icon.stat-product {
  background-color: #67C23A;
}

.stat-icon.stat-order {
  background-color: #E6A23C;
}

.stat-icon.stat-sales {
  background-color: #F56C6C;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.order-stats-section {
  margin-bottom: 30px;
}

.stats-card {
  padding: 20px;
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

.order-stats {
  padding: 20px 0;
}

.order-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.order-stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.order-stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.recent-orders-section {
  margin-bottom: 30px;
}

.orders-card {
  padding: 20px;
}
</style>