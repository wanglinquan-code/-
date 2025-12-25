<template>
  <div class="product-list">
    <el-card shadow="hover" class="list-card">
      <div class="list-header">
        <h2>商品列表</h2>
      </div>
      
      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-select v-model="selectedCategory" placeholder="请选择分类" clearable @change="handleCategoryChange">
              <el-option 
                v-for="category in categories" 
                :key="category.id" 
                :label="category.name" 
                :value="category.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input 
              v-model="searchKeyword" 
              placeholder="请输入商品名称搜索" 
              prefix-icon="el-icon-search"
              @keyup.enter.native="handleSearch">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="resetFilters">重置筛选</el-button>
          </el-col>
        </el-row>
      </div>
      
      <!-- 商品列表 -->
      <div class="product-grid" v-loading="loading">
        <el-card 
          v-for="product in displayProducts" 
          :key="product.id" 
          shadow="hover" 
          class="product-card"
          @click="goToDetail(product.id)">
          <img :src="product.image" :alt="product.name" class="product-image">
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">¥{{ product.price }}</div>
            <div class="product-category">{{ getCategoryName(product.categoryId) }}</div>
            <div class="product-stock">库存: {{ product.stock }}</div>
          </div>
          <div class="product-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click.stop="addToCart(product)"
              :disabled="product.stock === 0">
              {{ product.stock === 0 ? '已售罄' : '加入购物车' }}
            </el-button>
          </div>
        </el-card>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="$store.state.product.currentPage"
          :page-sizes="[8, 16, 24, 32]"
          :page-size="$store.state.product.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductList',
  data() {
    return {
      // 筛选条件
      selectedCategory: '',
      searchKeyword: ''
    }
  },
  computed: {
    ...mapGetters('product', ['products', 'categories', 'total', 'loading', 'searchResults']),
    // 根据是否有搜索关键词决定显示哪个列表
    displayProducts() {
      return this.searchKeyword ? this.searchResults : this.products
    }
  },
  methods: {
    ...mapActions('product', ['getProductList', 'searchProduct', 'getCategoryList']),
    ...mapActions('cart', ['addToCart']),
    // 跳转到商品详情页
    goToDetail(productId) {
      this.$router.push(`/product/detail/${productId}`)
    },
    // 加入购物车
    async addToCart(product) {
      const result = await this.$store.dispatch('cart/addToCart', {
        productId: product.id,
        quantity: 1
      })
      if (result.success) {
        this.$message.success('商品已加入购物车')
      } else {
        this.$message.error(result.message || '加入购物车失败')
      }
    },
    // 获取分类名称
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId)
      return category ? category.name : '未知分类'
    },
    // 搜索
    async handleSearch() {
      if (this.searchKeyword) {
        await this.searchProduct({
          keyword: this.searchKeyword,
          page: 1,
          pageSize: this.$store.state.product.pageSize
        })
      } else {
        await this.getProductList({
          page: 1,
          pageSize: this.$store.state.product.pageSize,
          categoryId: this.selectedCategory
        })
      }
    },
    // 重置筛选
    async resetFilters() {
      this.selectedCategory = ''
      this.searchKeyword = ''
      await this.getProductList({
        page: 1,
        pageSize: this.$store.state.product.pageSize
      })
    },
    // 分页大小变化
    async handleSizeChange(size) {
      if (this.searchKeyword) {
        await this.searchProduct({
          keyword: this.searchKeyword,
          page: 1,
          pageSize: size
        })
      } else {
        await this.getProductList({
          page: 1,
          pageSize: size,
          categoryId: this.selectedCategory
        })
      }
    },
    // 当前页变化
    async handleCurrentChange(current) {
      if (this.searchKeyword) {
        await this.searchProduct({
          keyword: this.searchKeyword,
          page: current,
          pageSize: this.$store.state.product.pageSize
        })
      } else {
        await this.getProductList({
          page: current,
          pageSize: this.$store.state.product.pageSize,
          categoryId: this.selectedCategory
        })
      }
    },
    // 分类变化
    async handleCategoryChange() {
      await this.getProductList({
        page: 1,
        pageSize: this.$store.state.product.pageSize,
        categoryId: this.selectedCategory
      })
    }
  },
  created() {
    // 获取分类列表
    this.getCategoryList()
  },
  mounted() {
    // 从URL参数获取搜索关键词
    const keyword = this.$route.query.keyword
    if (keyword) {
      this.searchKeyword = keyword
      this.handleSearch()
    } else {
      // 获取商品列表
      this.getProductList({
        page: 1,
        pageSize: this.$store.state.product.pageSize
      })
    }
  },
  watch: {
    // 监听路由变化，处理搜索参数
    '$route.query.keyword'(newKeyword) {
      if (newKeyword) {
        this.searchKeyword = newKeyword
        this.handleSearch()
      }
    }
  }
}
</script>

<style scoped>
.product-list {
  max-width: 1200px;
  margin: 0 auto;
}

.list-card {
  padding: 20px;
}

.list-header {
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 30px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  margin: 10px 0;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #F56C6C;
  margin-bottom: 5px;
}

.product-category {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.product-stock {
  font-size: 14px;
  color: #606266;
}

.product-actions {
  margin-top: 15px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>