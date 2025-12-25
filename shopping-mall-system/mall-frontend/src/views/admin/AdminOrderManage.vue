<template>
  <div class="admin-order-manage">
    <el-card shadow="hover" class="manage-card">
      <div class="manage-header">
        <h2>订单管理</h2>
      </div>
      
      <!-- 筛选和搜索 -->
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入订单编号或用户名搜索"
              prefix-icon="el-icon-search"
              @keyup.enter.native="handleSearch">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-select
              v-model="selectedStatus"
              placeholder="请选择订单状态"
              clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="待付款" value="PENDING"></el-option>
              <el-option label="待发货" value="PAID"></el-option>
              <el-option label="待收货" value="SHIPPED"></el-option>
              <el-option label="已完成" value="COMPLETED"></el-option>
              <el-option label="已取消" value="CANCELLED"></el-option>
              <el-option label="退款中" value="REFUNDING"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-col>
        </el-row>
      </div>
      
      <!-- 订单列表 -->
      <div class="order-list">
        <el-table :data="filteredOrders" stripe border style="width: 100%">
          <el-table-column prop="orderNo" label="订单编号" width="180">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="viewOrderDetail(scope.row.id)">{{ scope.row.orderNo }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="用户名称"></el-table-column>
          <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
          <el-table-column prop="status" label="订单状态" width="120">
            <template slot-scope="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="订单金额" width="120">
            <template slot-scope="scope">¥{{ scope.row.totalAmount }}</template>
          </el-table-column>
          <el-table-column prop="totalItems" label="商品数量" width="100"></el-table-column>
          <el-table-column prop="shippingAddress" label="收货地址" min-width="200">
            <template slot-scope="scope">
              {{ scope.row.shippingAddress }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="viewOrderDetail(scope.row.id)">
                <i class="el-icon-view"></i>详情
              </el-button>
              <el-button 
                v-if="scope.row.status === 'PAID'" 
                type="success" 
                size="small" 
                @click="shipOrder(scope.row.id)">
                <i class="el-icon-truck"></i>发货
              </el-button>
              <el-button 
                v-if="scope.row.status === 'PENDING' || scope.row.status === 'PAID'" 
                type="danger" 
                size="small" 
                @click="cancelOrder(scope.row.id)">
                <i class="el-icon-circle-close"></i>取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalOrders">
        </el-pagination>
      </div>
      
      <!-- 订单详情对话框 -->
      <el-dialog
        title="订单详情"
        :visible.sync="orderDetailDialogVisible"
        width="60%"
        center>
        <div class="order-detail">
          <div class="detail-section">
            <h3>订单信息</h3>
            <div class="detail-item">
              <span class="detail-label">订单编号:</span>
              <span class="detail-value">{{ currentOrder.orderNo }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">下单时间:</span>
              <span class="detail-value">{{ currentOrder.createTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单状态:</span>
              <span class="detail-value">
                <el-tag :type="getStatusTagType(currentOrder.status)">
                  {{ getStatusText(currentOrder.status) }}
                </el-tag>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付方式:</span>
              <span class="detail-value">{{ getPaymentMethodText(currentOrder.paymentMethod) }}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>用户信息</h3>
            <div class="detail-item">
              <span class="detail-label">用户名称:</span>
              <span class="detail-value">{{ currentOrder.userName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">联系电话:</span>
              <span class="detail-value">{{ currentOrder.userPhone }}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>收货地址</h3>
            <div class="detail-item">
              <span class="detail-label">收货人:</span>
              <span class="detail-value">{{ currentOrder.receiverName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">联系电话:</span>
              <span class="detail-value">{{ currentOrder.receiverPhone }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">收货地址:</span>
              <span class="detail-value">{{ currentOrder.shippingAddress }}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>商品信息</h3>
            <el-table :data="currentOrder.orderItems" stripe border style="width: 100%">
              <el-table-column label="商品图片" width="100">
                <template slot-scope="scope">
                  <img :src="scope.row.productImage" :alt="scope.row.productName" class="product-image">
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="商品名称"></el-table-column>
              <el-table-column prop="productSpec" label="商品规格"></el-table-column>
              <el-table-column prop="productPrice" label="商品单价" width="100">
                <template slot-scope="scope">¥{{ scope.row.productPrice }}</template>
              </el-table-column>
              <el-table-column prop="quantity" label="购买数量" width="100"></el-table-column>
              <el-table-column label="商品总价" width="120">
                <template slot-scope="scope">¥{{ scope.row.productPrice * scope.row.quantity }}</template>
              </el-table-column>
            </el-table>
          </div>
          
          <div class="detail-section">
            <h3>金额信息</h3>
            <div class="amount-item">
              <span class="amount-label">商品总价:</span>
              <span class="amount-value">¥{{ currentOrder.totalAmount }}</span>
            </div>
            <div class="amount-item">
              <span class="amount-label">运费:</span>
              <span class="amount-value">¥{{ currentOrder.shippingFee }}</span>
            </div>
            <div class="amount-item">
              <span class="amount-label">优惠金额:</span>
              <span class="amount-value amount-discount">-¥{{ currentOrder.discount }}</span>
            </div>
            <div class="amount-item total">
              <span class="amount-label">实付金额:</span>
              <span class="amount-value amount-total">¥{{ currentOrder.actualPayment }}</span>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="orderDetailDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AdminOrderManage',
  data() {
    return {
      // 订单列表
      orders: [
        {
          id: 1,
          orderNo: 'ORD202306150012',
          userName: '张三',
          userPhone: '13800138000',
          receiverName: '张三',
          receiverPhone: '13800138000',
          shippingAddress: '广东省深圳市南山区科技园路1号',
          createTime: '2023-06-15 14:30:00',
          status: 'PAID',
          paymentMethod: 'alipay',
          totalAmount: 2999,
          shippingFee: 10,
          discount: 0,
          actualPayment: 3009,
          totalItems: 1,
          orderItems: [
            {
              id: 1,
              productId: 2,
              productName: '笔记本电脑',
              productSpec: '16GB内存/512GB SSD',
              productPrice: 2999,
              quantity: 1,
              productImage: 'https://via.placeholder.com/80x80?text=Product2'
            }
          ]
        },
        {
          id: 2,
          orderNo: 'ORD202306150011',
          userName: '李四',
          userPhone: '13900139000',
          receiverName: '李四',
          receiverPhone: '13900139000',
          shippingAddress: '北京市海淀区中关村大街1号',
          createTime: '2023-06-15 14:25:00',
          status: 'PENDING',
          paymentMethod: 'wechat',
          totalAmount: 1299,
          shippingFee: 10,
          discount: 0,
          actualPayment: 1309,
          totalItems: 1,
          orderItems: [
            {
              id: 2,
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
          id: 3,
          orderNo: 'ORD202306150010',
          userName: '王五',
          userPhone: '13700137000',
          receiverName: '王五',
          receiverPhone: '13700137000',
          shippingAddress: '上海市浦东新区陆家嘴环路1号',
          createTime: '2023-06-15 14:20:00',
          status: 'SHIPPED',
          paymentMethod: 'alipay',
          totalAmount: 5999,
          shippingFee: 10,
          discount: 0,
          actualPayment: 6009,
          totalItems: 1,
          orderItems: [
            {
              id: 3,
              productId: 1,
              productName: '智能手机',
              productSpec: '8GB内存/256GB存储',
              productPrice: 5999,
              quantity: 1,
              productImage: 'https://via.placeholder.com/80x80?text=Product1'
            }
          ]
        }
      ],
      // 搜索和筛选条件
      searchKeyword: '',
      selectedStatus: '',
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      totalOrders: 3,
      // 订单详情对话框
      orderDetailDialogVisible: false,
      currentOrder: {}
    }
  },
  computed: {
    // 筛选后的订单列表
    filteredOrders() {
      let result = this.orders
      
      // 按订单编号或用户名搜索
      if (this.searchKeyword) {
        result = result.filter(order => 
          order.orderNo.includes(this.searchKeyword) || 
          order.userName.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
      }
      
      // 按状态筛选
      if (this.selectedStatus) {
        result = result.filter(order => 
          order.status === this.selectedStatus
        )
      }
      
      return result
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
    // 获取支付方式文本
    getPaymentMethodText(method) {
      const methodMap = {
        'alipay': '支付宝',
        'wechat': '微信支付',
        'card': '银行卡支付'
      }
      return methodMap[method] || '未知支付方式'
    },
    // 搜索
    handleSearch() {
      this.currentPage = 1
    },
    // 重置筛选条件
    resetFilter() {
      this.searchKeyword = ''
      this.selectedStatus = ''
      this.currentPage = 1
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size
    },
    // 当前页变化
    handleCurrentChange(current) {
      this.currentPage = current
    },
    // 查看订单详情
    viewOrderDetail(orderId) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        this.currentOrder = JSON.parse(JSON.stringify(order))
        this.orderDetailDialogVisible = true
      }
    },
    // 发货
    shipOrder(orderId) {
      this.$confirm('确定要发货吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟发货成功
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.status = 'SHIPPED'
          this.$message.success('发货成功')
        }
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 取消订单
    cancelOrder(orderId) {
      this.$confirm('确定要取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        // 模拟取消成功
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.status = 'CANCELLED'
          this.$message.success('订单已取消')
        }
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    }
  },
  mounted() {
    // 实际应用中需要从API获取订单数据
    // this.getOrders()
  }
}
</script>

<style scoped>
.admin-order-manage {
  max-width: 1400px;
  margin: 0 auto;
}

.manage-card {
  padding: 20px;
}

.manage-header {
  margin-bottom: 30px;
}

.filter-section {
  margin-bottom: 20px;
}

.order-list {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.order-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.detail-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.detail-item {
  margin-bottom: 10px;
  display: flex;
}

.detail-label {
  width: 100px;
  color: #606266;
}

.detail-value {
  flex: 1;
  color: #303133;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.amount-item {
  margin-bottom: 10px;
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
</style>