// 购物车商品项组件
class CartItem {
  constructor(item) {
    this.item = item;
    this.element = null;
  }

  // 创建DOM元素
  createElement() {
    const div = document.createElement('div');
    div.className = 'cart-item';
    // 确保price是数字类型
    const price = typeof this.item.price === 'string' ? parseFloat(this.item.price) : this.item.price;
    div.innerHTML = `
      <img class="cart-item-image" src="${this.item.imageUrl || 'https://via.placeholder.com/80'}" alt="${this.item.name}">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${this.item.name}</h4>
        <p class="cart-item-price">¥${price.toFixed(2)}</p>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn decrease" data-id="${this.item.id}">-</button>
        <span class="quantity">${this.item.quantity}</span>
        <button class="quantity-btn increase" data-id="${this.item.id}">+</button>
      </div>
      <div class="cart-item-total">¥${(price * this.item.quantity).toFixed(2)}</div>
      <button class="remove-btn" data-id="${this.item.id}">删除</button>
    `;
    
    this.element = div;
    this.bindEvents();
    
    // 添加样式
    this.addStyles();
    
    return div;
  }

  // 添加样式
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .cart-item {
        display: flex;
        align-items: center;
        gap: 14px;
        background: var(--card);
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 12px;
        box-shadow: 0 10px 24px rgba(2,6,23,0.06);
      }

      .cart-item-image {
        width: 76px;
        height: 76px;
        object-fit: cover;
        border-radius: 8px;
        flex-shrink: 0;
      }

      .cart-item-info { flex: 1; }

      .cart-item-name { margin: 0; font-size: 15px; color: #111827; font-weight:600 }

      .cart-item-price { margin-top:6px; color:var(--primary); font-weight:700 }

      .cart-item-quantity { display:flex;align-items:center;gap:8px }

      .quantity-btn{width:30px;height:30px;border-radius:8px;border:1px solid #eef2f7;background:#fff;cursor:pointer}
      .quantity-btn:hover{background:#f3f4f6}

      .quantity{min-width:20px;text-align:center}

      .cart-item-total{font-weight:700;font-size:16px;color:#111827;margin-right:8px}

      .remove-btn{background:transparent;color:var(--primary);border:none;padding:6px 10px;cursor:pointer;border-radius:8px}
      .remove-btn:hover{background:rgba(255,107,129,0.06)}
    `;
    document.head.appendChild(style);
  }

  // 绑定事件
  bindEvents() {
    const decreaseBtn = this.element.querySelector('.quantity-btn.decrease');
    const increaseBtn = this.element.querySelector('.quantity-btn.increase');
    const removeBtn = this.element.querySelector('.remove-btn');
    
    // 减少数量按钮
    decreaseBtn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      this.handleDecreaseQuantity(productId);
    });
    
    // 增加数量按钮
    increaseBtn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      this.handleIncreaseQuantity(productId);
    });
    
    // 删除按钮
    removeBtn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      this.handleRemove(productId);
    });
  }

  // 处理减少数量
  handleDecreaseQuantity(productId) {
    const event = new CustomEvent('decreaseQuantity', {
      detail: { productId },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }

  // 处理增加数量
  handleIncreaseQuantity(productId) {
    const event = new CustomEvent('increaseQuantity', {
      detail: { productId },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }

  // 处理删除商品
  handleRemove(productId) {
    const event = new CustomEvent('removeItem', {
      detail: { productId },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }
}

export default CartItem;
