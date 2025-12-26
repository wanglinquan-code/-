// 购物车页面
import CartItem from '../components/CartItem.js';

class CartPage {
  constructor() {
    this.element = null;
    this.cartItems = []; // 存储购物车数据
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'cart-page';
    div.innerHTML = `
      <h1>我的购物车</h1>
      <div class="cart-list" id="cart-list"></div>
      <div class="cart-total" id="cart-total"></div>
      <div class="cart-actions">
        <button id="checkout-btn">去结算</button>
        <button id="clear-cart">清空购物车</button>
      </div>
      <div class="empty-cart" id="empty-cart" style="display: none;">
        购物车为空，快去添加商品吧！
      </div>
    `;
    this.element = div;
    this.addStyles();
    this.bindEvents();
    return div;
  }

  // 添加基础样式（确保购物车能显示）
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .cart-page { padding: 20px; max-width: 1200px; margin: 0 auto; }
      .cart-list { border: 1px solid #eee; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
      .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
      .cart-item-info { flex: 1; }
      .cart-item-price { color: #ff6b81; font-weight: bold; margin: 0 20px; }
      .cart-item-actions { display: flex; gap: 10px; }
      .cart-item-actions button { padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
      .cart-total { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
      .cart-actions button { padding: 10px 20px; margin-right: 10px; background: #ff6b81; color: white; border: none; border-radius: 4px; cursor: pointer; }
      #clear-cart { background: #ccc; color: #333; }
      .empty-cart { text-align: center; padding: 50px; color: #666; }
    `;
    this.element.appendChild(style);
  }

  // 绑定事件（结算、清空购物车）
  bindEvents() {
    // 去结算
    this.element.querySelector('#checkout-btn').addEventListener('click', () => {
      window.location.hash = '#/checkout';
    });

    // 清空购物车
    this.element.querySelector('#clear-cart').addEventListener('click', () => {
      localStorage.removeItem('cart');
      this.cartItems = [];
      this.renderCart();
    });
  }

  // 读取localStorage中的购物车数据
  loadCart() {
    const cartData = localStorage.getItem('cart');
    this.cartItems = cartData ? JSON.parse(cartData) : [];
  }

  // 渲染购物车（核心：确保能显示商品）
  renderCart() {
    const cartList = this.element.querySelector('#cart-list');
    const emptyCart = this.element.querySelector('#empty-cart');
    const cartTotal = this.element.querySelector('#cart-total');
    
    // 清空原有内容
    cartList.innerHTML = '';

    // 判断购物车是否为空
    if (this.cartItems.length === 0) {
      emptyCart.style.display = 'block';
      cartTotal.innerHTML = '';
      return;
    }
    emptyCart.style.display = 'none';

    // 计算总价
    let total = 0;

    // 遍历购物车渲染每个商品
    this.cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>单价：¥${item.price}</p>
          <p>数量：${item.quantity}</p>
        </div>
        <div class="cart-item-price">¥${itemTotal.toFixed(2)}</div>
        <div class="cart-item-actions">
          <button class="decrease" data-id="${item.id}">-</button>
          <button class="increase" data-id="${item.id}">+</button>
          <button class="remove" data-id="${item.id}">删除</button>
        </div>
      `;

      // 绑定数量修改/删除事件
      cartItem.querySelector('.decrease').addEventListener('click', () => this.updateQuantity(item.id, -1));
      cartItem.querySelector('.increase').addEventListener('click', () => this.updateQuantity(item.id, 1));
      cartItem.querySelector('.remove').addEventListener('click', () => this.removeItem(item.id));

      cartList.appendChild(cartItem);
    });

    // 显示总价
    cartTotal.innerHTML = `总计：¥${total.toFixed(2)}`;
  }

  // 更新商品数量
  updateQuantity(productId, change) {
    this.cartItems = this.cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        // 数量不能小于1
        return { ...item, quantity: newQuantity < 1 ? 1 : newQuantity };
      }
      return item;
    });
    // 保存到localStorage
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    // 重新渲染
    this.renderCart();
  }

  // 删除购物车商品
  removeItem(productId) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.renderCart();
  }

  // 页面挂载时加载并渲染购物车
  mount() {
    this.loadCart(); // 读取localStorage中的购物车数据
    this.renderCart(); // 渲染购物车
  }
}

export default CartPage;

