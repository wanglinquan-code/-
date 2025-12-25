<template>
  <div class="product-detail">
    <el-card shadow="hover" class="detail-card">
      <div class="detail-header">
        <h2>商品详情</h2>
      </div>
      
      <div class="detail-content">
        <!-- 商品图片 -->
        <div class="product-images">
          <el-carousel height="400px" indicator-position="outside">
            <el-carousel-item v-for="image in productImages" :key="image.id">
              <img :src="image.url" :alt="image.alt" style="width: 100%; height: 100%; object-fit: contain;">
            </el-carousel-item>
          </el-carousel>
        </div>
        
        <!-- 商品信息 -->
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-price">¥{{ product.price }}</div>
          <div class="product-stock">库存: {{ product.stock }}</div>
          <div class="product-category">分类: {{ getCategoryName(product.categoryId) }}</div>
          
          <!-- 商品规格 -->
          <div class="product-specs">
            <h4>商品规格</h4>
            <div class="specs-list">
              <div class="spec-item">
                <span class="spec-label">品牌:</span>
                <span class="spec-value">{{ product.brand }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">型号:</span>
                <span class="spec-value">{{ product.model }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">尺寸:</span>
                <span class="spec-value">{{ product.size }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">颜色:</span>
                <span class="spec-value">{{ product.color }}</span>
              </div>
            </div>
          </div>
          
          <!-- 购买数量 -->
          <div class="purchase-quantity">
            <span class="quantity-label">数量:</span>
            <el-input-number 
              v-model="quantity" 
              :min="1" 
              :max="product.stock" 
              size="large"
              :disabled="product.stock === 0">
            </el-input-number>
          </div>
          
          <!-- 购买按钮 -->
          <div class="purchase-actions">
            <el-button 
              type="primary" 
              size="large" 
              @click="addToCart"
              :disabled="product.stock === 0">
              <i class="el-icon-shopping-cart-2"></i>
              加入购物车
            </el-button>
            <el-button 
              type="success" 
              size="large" 
              @click="buyNow"
              :disabled="product.stock === 0">
              <i class="el-icon-circle-check"></i>
              立即购买
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 商品描述 -->
      <div class="product-description">
        <h3>商品描述</h3>
        <div class="description-content" v-html="product.description"></div>
      </div>
      
      <!-- 用户评价 -->
      <div class="product-reviews">
        <h3>用户评价</h3>
        <div v-if="reviews.length === 0" class="no-reviews">
          <el-empty description="暂无用户评价"></el-empty>
        </div>
        <div v-else class="reviews-list">
          <el-card 
            v-for="review in reviews" 
            :key="review.id" 
            shadow="hover" 
            class="review-card">
            <div class="review-header">
              <span class="review-user">{{ review.userName }}</span>
              <span class="review-date">{{ review.createTime }}</span>
              <el-rate :value="review.rating" disabled show-score score-template="{{ value }}分"></el-rate>
            </div>
            <div class="review-content">{{ review.content }}</div>
            <div v-if="review.images.length > 0" class="review-images">
              <img 
                v-for="image in review.images" 
                :key="image" 
                :src="image" 
                :alt="'评价图片'"
                class="review-image">
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return {
      // 商品详情数据
      product: {
        id: 1,
        name: '智能手机',
        price: 2999,
        categoryId: 1,
        stock: 100,
        brand: '品牌A',
        model: 'Model X',
        size: '6.5英寸',
        color: '黑色',
        description: '<p>这是一款高性能智能手机，采用最新处理器，拥有出色的拍照能力和流畅的操作体验。</p><p>主要特点：</p><ul><li>6.5英寸AMOLED全面屏</li><li>5000万像素主摄像头</li><li>4500mAh大容量电池</li><li>支持5G网络</li><li>128GB存储空间</li></ul>'
      },
      // 商品图片
      productImages: [
        { id: 1, url: 'https://via.placeholder.com/600x600?text=Product1', alt: '商品图片1' },
        { id: 2, url: 'https://via.placeholder.com/600x600?text=Product2', alt: '商品图片2' },
        { id: 3, url: 'https://via.placeholder.com/600x600?text=Product3', alt: '商品图片3' }
      ],
      // 用户评价
      reviews: [
        {
          id: 1,
          userName: '用户A',
          createTime: '2023-01-15 14:30',
          rating: 5,
          content: '手机质量非常好，运行流畅，拍照效果出色，很满意的一次购物！',
          images: []
        },
        {
          id: 2,
          userName: '用户B',
          createTime: '2023-01-10 10:15',
          rating: 4,
          content: '手机各方面都不错，就是价格有点贵，总体还是值得购买的。',
          images: ['https://via.placeholder.com/100x100?text=Review1']
        }
      ],
      // 分类数据
      categories: [
        { id: 1, name: '电子产品' },
        { id: 2, name: '服装鞋帽' },
        { id: 3, name: '家居用品' },
        { id: 4, name: '食品饮料' }
      ],
      // 购买数量
      quantity: 1
    }
  },
  methods: {
    // 获取分类名称
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId)
      return category ? category.name : '未知分类'
    },
    // 加入购物车
    addToCart() {
      this.$message.success('商品已加入购物车')
      // 实际应用中需要调用API或更新状态
    },
    // 立即购买
    buyNow() {
      // 跳转到订单确认页
      this.$router.push({
        path: '/order/confirm',
        query: {
          productId: this.product.id,
          quantity: this.quantity
        }
      })
    }
  },
  mounted() {
    // 实际应用中需要根据路由参数获取商品ID，然后从API获取商品详情
    // const productId = this.$route.params.id
    // this.getProductDetail(productId)
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-card {
  padding: 20px;
}

.detail-header {
  margin-bottom: 20px;
}

.detail-content {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.product-images {
  flex: 1;
  max-width: 600px;
}

.product-info {
  flex: 1;
  max-width: 500px;
}

.product-name {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.product-price {
  font-size: 28px;
  font-weight: bold;
  color: #F56C6C;
  margin-bottom: 10px;
}

.product-stock, .product-category {
  font-size: 16px;
  color: #606266;
  margin-bottom: 5px;
}

.product-specs {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.product-specs h4 {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.specs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-item {
  display: flex;
  align-items: center;
}

.spec-label {
  font-weight: 500;
  color: #606266;
  width: 60px;
}

.spec-value {
  color: #303133;
}

.purchase-quantity {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-label {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.purchase-actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.product-description, .product-reviews {
  margin-top: 40px;
}

.product-description h3, .product-reviews h3 {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.description-content {
  color: #606266;
  line-height: 1.8;
  font-size: 16px;
}

.no-reviews {
  padding: 20px;
  text-align: center;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-card {
  padding: 15px;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review-user {
  font-weight: 500;
  color: #303133;
}

.review-date {
  color: #909399;
  font-size: 14px;
}

.review-content {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 10px;
}

.review-images {
  display: flex;
  gap: 10px;
}

.review-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
</style>