// 购物车页面
import CartItem from '../components/CartItem.js';

class CartPage {
  constructor() {
    this.element = null;
    this.cartItems = [];
    this.cart = [];
  }

  // 创建DOM元素
  createElement() {
    const div = document.createElement('div');
    div.className = 'cart-page';
    div.innerHTML = `
      <div class="container">
        <h2>购物车</h2>
        <div id="cart-items-container"></div>
        <div id="cart-empty" style="text-align: center; padding: 40px; display: none;">
          <p>购物车是空的，快去选购商品吧！</p>
          <a href="#/products" class="btn">去购物</a>
        </div>
        <div id="cart-summary" style="display: none;">
          <div class="cart-total">
            <p>商品总数：<span id="total-items">0</span></p>
            <p>商品总价：<span id="total-price">¥0.00</span></p>
          </div>
          <div class="cart-actions">
            <a href="#/products" class="btn continue-shopping">继续购物</a>
            <button id="checkout-btn" class="btn checkout">去结算</button>
          </div>
        </div>
      </div>
    `;
    
    this.element = div;
    
    // 添加样式
    this.addStyles();
    
    // 加载购物车数据
    this.loadCartData();
    
    return div;
  }

  // 添加样式
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .cart-page {
        padding: 20px 0;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      h2 {
        margin-bottom: 20px;
        color: #333;
      }
      
      .cart-total {
        text-align: right;
        margin-top: 20px;
        padding: 20px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .cart-total p {
        margin: 5px 0;
        font-size: 16px;
      }
      
      .cart-actions {
        text-align: right;
        margin-top: 20px;
      }
      
      .btn {
        display: inline-block;
        padding: 10px 20px;
        margin-left: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
        font-size: 16px;
        transition: background-color 0.3s;
      }
      
      .continue-shopping {
        background-color: #f0f0f0;
        color: #333;
      }
      
      .continue-shopping:hover {
        background-color: #e0e0e0;
      }
      
      .checkout {
        background-color: #ff6b81;
        color: white;
      }
      
      .checkout:hover {
        background-color: #ff4757;
      }
    `;
    
    document.head.appendChild(style);
  }

  // 加载购物车数据
  loadCartData() {
    // 从本地存储获取购物车数据
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (this.cart.length > 0) {
      this.renderCartItems();
      this.updateCartSummary();
      this.showCartSummary();
    } else {
      this.showEmptyCart();
    }
  }

  // 渲染购物车商品列表
  renderCartItems() {
    const container = this.element.querySelector('#cart-items-container');
    container.innerHTML = '';
    
    this.cartItems = this.cart.map(item => {
      const cartItem = new CartItem(item);
      const element = cartItem.createElement();
      container.appendChild(element);
      return cartItem;
    });
    
    // 绑定事件监听器
    this.bindCartEvents();
  }

  // 绑定购物车事件
  bindCartEvents() {
    const container = this.element.querySelector('#cart-items-container');
    
    // 减少数量事件
    container.addEventListener('decreaseQuantity', (e) => {
      const productId = e.detail.productId;
      this.handleDecreaseQuantity(productId);
    });
    
    // 增加数量事件
    container.addEventListener('increaseQuantity', (e) => {
      const productId = e.detail.productId;
      this.handleIncreaseQuantity(productId);
    });
    
    // 删除商品事件
    container.addEventListener('removeItem', (e) => {
      const productId = e.detail.productId;
      this.handleRemoveItem(productId);
    });
    
    // 结算按钮事件
    const checkoutBtn = this.element.querySelector('#checkout-btn');
    checkoutBtn.addEventListener('click', () => {
      this.handleCheckout();
    });
  }

  // 处理减少数量
  handleDecreaseQuantity(productId) {
    const item = this.cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.saveCartData();
      this.renderCartItems();
      this.updateCartSummary();
      this.updateCartCount();
    }
  }

  // 处理增加数量
  handleIncreaseQuantity(productId) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity += 1;
      this.saveCartData();
      this.renderCartItems();
      this.updateCartSummary();
      this.updateCartCount();
    }
  }

  // 处理删除商品
  handleRemoveItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCartData();
    this.loadCartData();
    this.updateCartCount();
  }

  // 保存购物车数据到本地存储
  saveCartData() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // 更新购物车数量显示
  updateCartCount() {
    const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 触发自定义事件，通知头部组件更新购物车数量
    const event = new CustomEvent('updateCartCount', {
      detail: { count: total },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }

  // 更新购物车摘要信息
  updateCartSummary() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const totalItemsElement = this.element.querySelector('#total-items');
    const totalPriceElement = this.element.querySelector('#total-price');
    
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = `¥${totalPrice.toFixed(2)}`;
  }

  // 显示空购物车
  showEmptyCart() {
    const emptyCart = this.element.querySelector('#cart-empty');
    const cartItems = this.element.querySelector('#cart-items-container');
    const cartSummary = this.element.querySelector('#cart-summary');
    
    emptyCart.style.display = 'block';
    cartItems.style.display = 'none';
    cartSummary.style.display = 'none';
  }

  // 显示购物车摘要
  showCartSummary() {
    const emptyCart = this.element.querySelector('#cart-empty');
    const cartItems = this.element.querySelector('#cart-items-container');
    const cartSummary = this.element.querySelector('#cart-summary');
    
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    cartSummary.style.display = 'block';
  }

  // 处理结算
  handleCheckout() {
    // 保存当前购物车数据到会话存储，用于订单提交页面
    sessionStorage.setItem('checkoutCart', JSON.stringify(this.cart));
    
    // 跳转到结算页面
    window.location.hash = '#/checkout';
  }
}

export default CartPage;
