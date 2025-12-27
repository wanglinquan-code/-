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
        background-color: white;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .cart-item-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 15px;
      }
      
      .cart-item-info {
        flex: 1;
      }
      
      .cart-item-name {
        margin: 0;
        font-size: 16px;
        color: #333;
      }
      
      .cart-item-price {
        margin: 5px 0 0 0;
        color: #ff6b81;
        font-weight: bold;
      }
      
      .cart-item-quantity {
        display: flex;
        align-items: center;
        margin: 0 20px;
      }
      
      .quantity-btn {
        width: 30px;
        height: 30px;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .quantity-btn:hover {
        background-color: #e0e0e0;
      }
      
      .quantity {
        margin: 0 10px;
        min-width: 20px;
        text-align: center;
      }
      
      .cart-item-total {
        font-weight: bold;
        font-size: 18px;
        color: #333;
        margin-right: 20px;
      }
      
      .remove-btn {
        background-color: #ff4757;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        cursor: pointer;
      }
      
      .remove-btn:hover {
        background-color: #ff3742;
      }
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
