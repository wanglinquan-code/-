<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel height="400px" indicator-position="outside">
        <el-carousel-item v-for="item in bannerList" :key="item.id">
          <img :src="item.image" :alt="item.title" style="width: 100%; height: 100%; object-fit: cover;">
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 商品分类 -->
    <div class="category-section">
      <h2>商品分类</h2>
      <div class="category-list">
        <div v-for="category in categories" :key="category.id" class="category-item">
          <el-card shadow="hover">
            <img :src="category.image" :alt="category.name" class="category-image">
            <div class="category-name">{{ category.name }}</div>
          </el-card>
        </div>
      </div>
    </div>
    
    <!-- 热门商品 -->
    <div class="hot-products">
      <h2>热门商品</h2>
      <div class="product-list">
        <div v-for="product in hotProducts" :key="product.id" class="product-item">
          <el-card shadow="hover" @click="goToDetail(product.id)">
            <img :src="product.image" :alt="product.name" class="product-image">
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">¥{{ product.price }}</div>
              <div class="product-stock">库存: {{ product.stock }}</div>
            </div>
            <div class="product-actions">
              <el-button type="primary" size="small" @click.stop="addToCart(product)">
                加入购物车
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 轮播图数据
      bannerList: [
        { id: 1, title: '促销活动1', image: 'https://via.placeholder.com/1200x400?text=Banner1' },
        { id: 2, title: '促销活动2', image: 'https://via.placeholder.com/1200x400?text=Banner2' },
        { id: 3, title: '促销活动3', image: 'https://via.placeholder.com/1200x400?text=Banner3' }
      ],
      // 分类数据
      categories: [
        { id: 1, name: '电子产品', image: 'https://via.placeholder.com/200x200?text=Electronics' },
        { id: 2, name: '服装鞋帽', image: 'https://via.placeholder.com/200x200?text=Clothing' },
        { id: 3, name: '家居用品', image: 'https://via.placeholder.com/200x200?text=Home' },
        { id: 4, name: '食品饮料', image: 'https://via.placeholder.com/200x200?text=Food' }
      ],
      // 热门商品数据
      hotProducts: [
        { id: 1, name: '智能手机', price: 2999, stock: 100, image: 'https://via.placeholder.com/300x300?text=Phone' },
        { id: 2, name: '笔记本电脑', price: 5999, stock: 50, image: 'https://via.placeholder.com/300x300?text=Laptop' },
        { id: 3, name: '无线耳机', price: 1299, stock: 200, image: 'https://via.placeholder.com/300x300?text=Headphones' },
        { id: 4, name: '智能手表', price: 1999, stock: 80, image: 'https://via.placeholder.com/300x300?text=Watch' },
        { id: 5, name: '平板电脑', price: 3299, stock: 60, image: 'https://via.placeholder.com/300x300?text=Tablet' },
        { id: 6, name: '蓝牙音箱', price: 599, stock: 150, image: 'https://via.placeholder.com/300x300?text=Speaker' }
      ]
    }
  },
  methods: {
    // 跳转到商品详情页
    goToDetail(productId) {
      this.$router.push(`/product/detail/${productId}`)
    },
    // 加入购物车
    addToCart(product) {
      this.$message.success('商品已加入购物车')
      // 实际应用中需要调用API或更新状态
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.banner {
  margin-bottom: 30px;
}

.category-section,
.hot-products {
  margin-bottom: 40px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-item {
  cursor: pointer;
}

.category-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.category-name {
  text-align: center;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-item {
  cursor: pointer;
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

.product-stock {
  font-size: 14px;
  color: #606266;
}

.product-actions {
  margin-top: 15px;
  text-align: center;
}
</style>