// 搜索结果页面
import SearchBar from '../components/SearchBar.js';
import ProductList from '../components/ProductList.js';
import { searchProducts } from '../services/api.js';

class SearchPage {
  constructor() {
    this.element = null;
    this.searchBar = null;
    this.productList = null;
    this.products = [];
    this.keyword = '';
  }

  // 创建DOM元素
  async createElement() {
    const div = document.createElement('div');
    div.className = 'search-page';
    div.innerHTML = `
      <div class="container">
        <div id="search-bar-container"></div>
        <div id="search-results">
          <h2 id="search-title"></h2>
          <div id="product-list-container"></div>
          <div id="loading" style="text-align: center; padding: 20px;">搜索中...</div>
          <div id="error" style="text-align: center; padding: 20px; color: red; display: none;"></div>
          <div id="no-results" style="text-align: center; padding: 20px; display: none;"></div>
        </div>
      </div>
    `;
    
    this.element = div;
    this.initSearchBar();
    return div;
  }

  // 初始化搜索栏
  initSearchBar() {
    this.searchBar = new SearchBar();
    const searchBarContainer = this.element.querySelector('#search-bar-container');
    searchBarContainer.appendChild(this.searchBar.createElement());
    
    // 监听搜索事件
    this.searchBar.element.addEventListener('search', (e) => {
      this.keyword = e.detail.keyword;
      this.performSearch();
    });
  }

  // 执行搜索
  async performSearch() {
    if (!this.keyword) return;
    
    this.showLoading();
    this.hideError();
    this.hideNoResults();
    
    try {
      // 获取搜索结果
      // this.products = await searchProducts(this.keyword);
      
      // 模拟搜索结果
      this.products = [
        { id: 1, name: '智能手表', price: 1999.00, imageUrl: 'https://via.placeholder.com/200' },
        { id: 2, name: '无线耳机', price: 999.00, imageUrl: 'https://via.placeholder.com/200' }
      ];
      
      this.renderSearchResults();
    } catch (error) {
      this.showError('搜索失败：' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  // 渲染搜索结果
  renderSearchResults() {
    const title = this.element.querySelector('#search-title');
    title.textContent = `搜索结果: "${this.keyword}"`;
    
    const productListContainer = this.element.querySelector('#product-list-container');
    productListContainer.innerHTML = '';
    
    if (this.products.length > 0) {
      // 创建商品列表组件
      this.productList = new ProductList(this.products);
      const productListElement = this.productList.createElement();
      productListContainer.appendChild(productListElement);
      
      // 监听加入购物车事件
      productListElement.addEventListener('addToCart', (e) => {
        this.handleAddToCart(e.detail.productId);
      });
    } else {
      this.showNoResults();
    }
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
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // 显示加载状态
  showLoading() {
    const loading = this.element.querySelector('#loading');
    loading.style.display = 'block';
  }

  // 隐藏加载状态
  hideLoading() {
    const loading = this.element.querySelector('#loading');
    loading.style.display = 'none';
  }

  // 显示错误信息
  showError(message) {
    const error = this.element.querySelector('#error');
    error.textContent = message;
    error.style.display = 'block';
  }

  // 隐藏错误信息
  hideError() {
    const error = this.element.querySelector('#error');
    error.style.display = 'none';
  }

  // 显示无结果信息
  showNoResults() {
    const noResults = this.element.querySelector('#no-results');
    noResults.textContent = `没有找到与 "${this.keyword}" 相关的商品`;
    noResults.style.display = 'block';
  }

  // 隐藏无结果信息
  hideNoResults() {
    const noResults = this.element.querySelector('#no-results');
    noResults.style.display = 'none';
  }

  // 从URL参数中获取搜索关键词
  getKeywordFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('keyword') || '';
  }

  // 初始化页面，从URL获取关键词并执行搜索
  async initFromUrl() {
    this.keyword = this.getKeywordFromUrl();
    if (this.keyword) {
      this.searchBar.setKeyword(this.keyword);
      await this.performSearch();
    }
  }
}

export default SearchPage;
