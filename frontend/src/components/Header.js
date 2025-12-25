// 头部导航组件
import SearchBar from './SearchBar.js';

class Header {
  constructor() {
    this.element = null;
    this.searchBar = null;
    this.cartCount = 0;
  }

  // 创建DOM元素
  createElement() {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
      <div class="container">
        <a href="#/products" class="logo">购物商城</a>
        <nav class="nav">
          <a href="#/products">商品</a>
          <a href="#/cart">购物车 <span class="cart-count" id="cart-count">0</span></a>
        </nav>
        <div id="search-bar-container"></div>
      </div>
    `;
    
    this.element = header;
    
    // 初始化搜索栏
    this.initSearchBar();
    
    // 加载购物车数量
    this.loadCartCount();
    
    return header;
  }

  // 初始化搜索栏
  initSearchBar() {
    this.searchBar = new SearchBar();
    const searchBarContainer = this.element.querySelector('#search-bar-container');
    searchBarContainer.appendChild(this.searchBar.createElement());
  }

  // 加载购物车数量
  loadCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.updateCartCountDisplay();
  }

  // 更新购物车数量显示
  updateCartCountDisplay() {
    const cartCountElement = this.element.querySelector('#cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = this.cartCount;
    }
  }

  // 处理购物车数量更新事件
  handleCartCountUpdate(count) {
    this.cartCount = count;
    this.updateCartCountDisplay();
  }
}

export default Header;
