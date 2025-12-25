<template>
  <div class="cart">
    <el-card shadow="hover" class="cart-card">
      <div class="cart-header">
        <h2>我的购物车</h2>
      </div>
      
      <div v-if="cartItems.length === 0" class="empty-cart">
        <el-empty description="购物车为空">
          <el-button type="primary" @click="goToHome">去购物</el-button>
        </el-empty>
      </div>
      
      <div v-else>
        <el-table :data="cartItems" stripe class="cart-table">
          <el-table-column prop="id" label="商品ID" width="80"></el-table-column>
          <el-table-column label="商品信息" width="300">
            <template slot-scope="scope">
              <div class="product-info">
                <img :src="scope.row.image" :alt="scope.row.name" class="product-image">
                <div class="product-name">{{ scope.row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100">
            <template slot-scope="scope">
              ¥{{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column label="数量" width="150">
            <template slot-scope="scope">
              <el-input-number 
                v-model="scope.row.quantity" 
                :min="1" 
                :max="scope.row.stock" 
                @change="updateQuantity(scope.row)"
                size="small"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template slot-scope="scope">
              ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="danger" size="small" @click="removeItem(scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="cart-footer">
          <div class="cart-summary">
            <div class="total-price">
              总计：<span class="price">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="total-quantity">
              共{{ totalQuantity }}件商品
            </div>
          </div>
          <div class="cart-actions">
            <el-button @click="clearCart">清空购物车</el-button>
            <el-button type="primary" size="large" @click="goToConfirm">
              去结算
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      cartItems: [
        {
          id: 1,
          name: '智能手机',
          price: 2999,
          quantity: 1,
          stock: 100,
          image: 'https://via.placeholder.com/80x80?text=Product1'
        },
        {
          id: 2,
          name: '无线耳机',
          price: 1299,
          quantity: 2,
          stock: 200,
          image: 'https://via.placeholder.com/80x80?text=Product2'
        }
      ]
    }
  },
  computed: {
    // 计算总价
    totalPrice() {
      return this.cartItems.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    },
    // 计算总数量
    totalQuantity() {
      return this.cartItems.reduce((total, item) => {
        return total + item.quantity
      }, 0)
    }
  },
  methods: {
    // 更新商品数量
    updateQuantity(item) {
      this.$message.success('商品数量已更新')
      // 实际应用中需要调用API更新购物车
    },
    // 删除商品
    removeItem(id) {
      this.$confirm('确定要删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cartItems = this.cartItems.filter(item => item.id !== id)
        this.$message.success('商品已删除')
        // 实际应用中需要调用API删除购物车商品
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 清空购物车
    clearCart() {
      this.$confirm('确定要清空购物车吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cartItems = []
        this.$message.success('购物车已清空')
        // 实际应用中需要调用API清空购物车
      }).catch(() => {
        this.$message.info('已取消清空')
      })
    },
    // 跳转到首页
    goToHome() {
      this.$router.push('/home')
    },
    // 去结算
    goToConfirm() {
      this.$router.push('/order/confirm')
    }
  },
  mounted() {
    // 实际应用中需要从API获取购物车数据
    // this.getCartItems()
  }
}
</script>

<style scoped>
.cart {
  max-width: 1000px;
  margin: 0 auto;
}

.cart-card {
  padding: 20px;
}

.cart-header {
  margin-bottom: 20px;
}

.cart-header h2 {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.empty-cart {
  padding: 40px 0;
  text-align: center;
}

.cart-table {
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.product-name {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 4px;
}

.cart-summary {
  text-align: right;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.price {
  color: #F56C6C;
  font-size: 24px;
}

.total-quantity {
  color: #606266;
  font-size: 14px;
}

.cart-actions {
  display: flex;
  gap: 10px;
}
</style>