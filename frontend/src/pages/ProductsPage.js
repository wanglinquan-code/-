import { getProducts, searchProducts } from '../services/api';

class ProductsPage {
  constructor() {
    this.element = null;
    this.products = [];
  }

  // 创建页面DOM
  createElement() {
    const div = document.createElement('div');
    div.className = 'products-page';
    div.innerHTML = `
      <div class="header">
        <h1>商品列表（来自MySQL数据库）</h1>
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

  // 添加样式
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .products-page { padding: 20px; max-width: 1200px; margin: 0 auto; }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
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

  // 绑定事件
  bindEvents() {
    // 搜索按钮事件
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

    // 回车搜索
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

  // 从数据库加载商品
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

  // 渲染商品列表
  renderProducts() {
    const productList = this.element.querySelector('#product-list');
    productList.innerHTML = '';

    if (this.products.length === 0) {
      productList.innerHTML = '<p>暂无商品（数据库中无数据）</p>';
      return;
    }

    // 遍历数据库商品渲染
    this.products.forEach(product => {
      const item = document.createElement('div');
      item.className = 'product-item';
      item.innerHTML = `
        <h3>${product.name}</h3>
        <div class="price">¥${product.price}</div>
        <div class="desc">${product.description || '暂无描述'}</div>
        <button data-id="${product.id}">加入购物车</button>
      `;

      // 加入购物车事件（保留原有逻辑）
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

  // 页面挂载时加载数据
  mount() {
    this.loadProducts(); // 核心：加载数据库商品，替代本地数据
  }
}

export default ProductsPage;