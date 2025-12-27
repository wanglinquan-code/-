// 导入API请求方法（需确保services/api.js路径正确）
import { getProducts, searchProducts } from '../services/api';

class ProductsPage {
  constructor() {
    this.element = null;
    this.products = [];
  }

  // 创建页面DOM结构（整合后保留购物车按钮+自定义标题）
  createElement() {
    const div = document.createElement('div');
    div.className = 'products-page';
    div.innerHTML = `
      <div class="header">
        <h1>哈基米商品列表</h1>
        <!-- 购物车入口按钮 -->
        <button id="cart-btn" style="margin-right: 10px;">我的购物车</button>
        <div class="search-box">
          <input type="text" id="search-input" placeholder="搜索商品...">
          <button id="search-btn">搜索</button>
        </div>
      </div>
      <div class="product-list" id="product-list"></div>
      <div class="error-message" id="error-message"></div>
    `;
    this.element = div;
    this.addStyles();
    this.bindEvents();
    return div;
  }

  // 添加页面样式（保留所有样式+购物车按钮基础样式）
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .products-page { padding: 20px; max-width: 1200px; margin: 0 auto; }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      /* 优化购物车按钮样式（可选，你可根据需求调整） */
      #cart-btn {
        padding: 8px 16px;
        background: #ff6b81;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s ease;
      }
      #cart-btn:hover {
        background: #e85568;
      }
      .search-box { display: flex; gap: 10px; }
      #search-input { padding: 8px; width: 200px; }
      #search-btn { padding: 8px 16px; background: #ff6b81; color: white; border: none; border-radius: 4px; cursor: pointer; }
      .product-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
      .product-item { border: 1px solid #eee; padding: 15px; border-radius: 8px; }
      .product-item h3 { margin: 0 0 10px; font-size: 18px; }
      .product-item .price { color: #ff6b81; font-weight: bold; margin: 10px 0; }
      .product-item .desc { color: #666; font-size: 14px; margin: 10px 0; }
      .product-item button { background: #ff6b81; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
      .error-message { color: red; margin-top: 20px; }
    `;
    this.element.appendChild(style);
  }

  // 绑定所有事件（整合购物车按钮跳转+搜索+回车事件）
  bindEvents() {
    // 1. 购物车按钮点击跳转事件
    this.element.querySelector('#cart-btn').addEventListener('click', () => {
      window.location.hash = '#/cart'; // 跳转到购物车路由
    });

    // 2. 搜索按钮点击事件
    const searchBtn = this.element.querySelector('#search-btn');
    const searchInput = this.element.querySelector('#search-input');
    searchBtn.addEventListener('click', async () => {
      const keyword = searchInput.value.trim();
      try {
        this.products = await searchProducts(keyword);
        this.renderProducts();
      } catch (error) {
        this.element.querySelector('#error-message').textContent = error.message;
      }
    });

    // 3. 回车触发搜索事件
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

  // 从MySQL数据库加载商品数据
  async loadProducts() {
    try {
      this.element.querySelector('#error-message').textContent = '';
      this.products = await getProducts(); // 调用API获取数据库商品
      this.renderProducts();
    } catch (error) {
      this.element.querySelector('#error-message').textContent = `加载失败：${error.message}`;
      console.error('加载商品失败:', error);
    }
  }

  // 渲染数据库中的商品列表
  renderProducts() {
    const productList = this.element.querySelector('#product-list');
    productList.innerHTML = '';

    if (this.products.length === 0) {
      productList.innerHTML = '<p>暂无商品（数据库中无数据）</p>';
      return;
    }

    // 遍历数据库商品生成DOM
    this.products.forEach(product => {
      const item = document.createElement('div');
      item.className = 'product-item';
      item.innerHTML = `
        <h3>${product.name}</h3>
        <div class="price">¥${product.price}</div>
        <div class="desc">${product.description || '暂无描述'}</div>
        <button data-id="${product.id}">加入购物车</button>
      `;

      // 加入购物车事件（存储到localStorage）
      item.querySelector('button').addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} 已加入购物车！`);
      });

      productList.appendChild(item);
    });
  }

  // 页面挂载时初始化加载商品
  mount() {
    this.loadProducts(); // 核心：加载数据库商品，替代本地模拟数据
  }
}

// 导出组件供main.js使用
export default ProductsPage;