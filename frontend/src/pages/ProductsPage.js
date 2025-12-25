// 商品展示页面
import ProductList from '../components/ProductList.js';
import { fetchProducts } from '../services/api.js';

class ProductsPage {
  constructor() {
    this.element = null;
    this.productList = null;
    this.products = [];
  }

  // 创建DOM元素
  async createElement() {
    const div = document.createElement('div');
    div.className = 'products-page';
    div.innerHTML = `
      <h2>商品展示</h2>
      <div class="container">
        <div id="product-list-container"></div>
        <div id="loading" style="text-align: center; padding: 20px;">加载中...</div>
        <div id="error" style="text-align: center; padding: 20px; color: red; display: none;"></div>
      </div>
    `;
    
    this.element = div;
    await this.loadProducts();
    return div;
  }

  // 加载商品数据
  async loadProducts() {
    try {
      // 实际项目中应该调用API获取数据
      // this.products = await fetchProducts();
      
      // 模拟商品数据
      this.products = [
        { id: 1, name: '智能手表', price: 1999.00, imageUrl: 'https://via.placeholder.com/200' },
        { id: 2, name: '无线耳机', price: 999.00, imageUrl: 'https://via.placeholder.com/200' },
        { id: 3, name: '智能手机', price: 5999.00, imageUrl: 'https://via.placeholder.com/200' },
        { id: 4, name: '平板电脑', price: 3999.00, imageUrl: 'https://via.placeholder.com/200' },
        { id: 5, name: '笔记本电脑', price: 7999.00, imageUrl: 'https://via.placeholder.com/200' },
        { id: 6, name: '智能音箱', price: 499.00, imageUrl: 'https://via.placeholder.com/200' }
      ];
      
      this.renderProductList();
      this.hideLoading();
    } catch (error) {
      this.showError('加载商品失败：' + error.message);
      this.hideLoading();
    }
  }

  // 渲染商品列表
  renderProductList() {
    const container = this.element.querySelector('#product-list-container');
    this.productList = new ProductList(this.products);
    const productListElement = this.productList.createElement();
    container.appendChild(productListElement);
    
    // 设置加入购物车事件监听
    this.productList.setOnAddToCartListener((productId) => {
      this.handleAddToCart(productId);
    });
  }

  // 处理加入购物车
  handleAddToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      // 从本地存储获取购物车数据
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // 检查商品是否已在购物车中
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        // 增加数量
        existingItem.quantity += 1;
      } else {
        // 添加新商品
        cart.push({
          ...product,
          quantity: 1
        });
      }
      
      // 保存到本地存储
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // 更新购物车数量显示
      this.updateCartCount();
      
      // 显示提示
      this.showNotification(`${product.name} 已加入购物车`);
    }
  }

  // 更新购物车数量显示
  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 触发自定义事件，通知头部组件更新购物车数量
    const event = new CustomEvent('updateCartCount', {
      detail: { count: total },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }

  // 显示通知
  showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4caf50;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      transition: all 0.3s;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 3秒后移除通知
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // 隐藏加载状态
  hideLoading() {
    const loading = this.element.querySelector('#loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }

  // 显示错误信息
  showError(message) {
    const error = this.element.querySelector('#error');
    if (error) {
      error.textContent = message;
      error.style.display = 'block';
    }
  }
}

export default ProductsPage;
