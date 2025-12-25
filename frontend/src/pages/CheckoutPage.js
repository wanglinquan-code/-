// 订单提交页面
class CheckoutPage {
  constructor() {
    this.element = null;
    this.cart = [];
    this.order = {};
  }

  // 创建DOM元素
  createElement() {
    const div = document.createElement('div');
    div.className = 'checkout-page';
    div.innerHTML = `
      <div class="container">
        <h2>订单提交</h2>
        <div class="checkout-container">
          <div class="shipping-info">
            <h3>收货信息</h3>
            <form id="shipping-form">
              <div class="form-group">
                <label for="name">收货人姓名</label>
                <input type="text" id="name" name="name" required>
              </div>
              <div class="form-group">
                <label for="phone">联系电话</label>
                <input type="tel" id="phone" name="phone" required>
              </div>
              <div class="form-group">
                <label for="address">收货地址</label>
                <textarea id="address" name="address" rows="3" required></textarea>
              </div>
              <div class="form-group">
                <label for="payment-method">支付方式</label>
                <select id="payment-method" name="paymentMethod" required>
                  <option value="alipay">支付宝</option>
                  <option value="wechat">微信支付</option>
                  <option value="card">银行卡</option>
                </select>
              </div>
            </form>
          </div>
          <div class="order-summary">
            <h3>订单摘要</h3>
            <div id="order-items"></div>
            <div class="order-total">
              <p>商品总价：<span id="subtotal">¥0.00</span></p>
              <p>运费：<span id="shipping">¥0.00</span></p>
              <p class="total">订单总计：<span id="total">¥0.00</span></p>
            </div>
            <button id="submit-order-btn" class="btn submit-order">提交订单</button>
            <a href="#/cart" class="btn back-to-cart">返回购物车</a>
          </div>
        </div>
        <div id="order-confirm" style="display: none; text-align: center; padding: 40px;">
          <h3>订单提交成功！</h3>
          <p>订单号：<span id="order-number"></span></p>
          <p>您可以在个人中心查看订单状态</p>
          <a href="#/products" class="btn">继续购物</a>
          <a href="#/orders" class="btn">查看订单</a>
        </div>
      </div>
    `;
    
    this.element = div;
    
    // 添加样式
    this.addStyles();
    
    // 加载购物车数据
    this.loadCartData();
    
    // 绑定事件
    this.bindEvents();
    
    return div;
  }

  // 添加样式
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .checkout-page {
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
      
      .checkout-container {
        display: flex;
        gap: 40px;
      }
      
      .shipping-info {
        flex: 2;
      }
      
      .order-summary {
        flex: 1;
      }
      
      h3 {
        margin-bottom: 20px;
        color: #333;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      label {
        display: block;
        margin-bottom: 8px;
        color: #666;
      }
      
      input, textarea, select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      
      textarea {
        resize: vertical;
      }
      
      #order-items {
        background-color: white;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        max-height: 300px;
        overflow-y: auto;
      }
      
      .order-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .order-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      
      .order-item-name {
        font-weight: bold;
      }
      
      .order-item-info {
        font-size: 12px;
        color: #666;
      }
      
      .order-total {
        background-color: white;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .order-total p {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      
      .order-total .total {
        font-weight: bold;
        font-size: 18px;
        color: #333;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 2px solid #f0f0f0;
      }
      
      .btn {
        display: block;
        width: 100%;
        padding: 12px;
        margin-bottom: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
        text-align: center;
        font-size: 16px;
        transition: background-color 0.3s;
      }
      
      .submit-order {
        background-color: #ff6b81;
        color: white;
      }
      
      .submit-order:hover {
        background-color: #ff4757;
      }
      
      .back-to-cart {
        background-color: #f0f0f0;
        color: #333;
      }
      
      .back-to-cart:hover {
        background-color: #e0e0e0;
      }
      
      #order-confirm {
        background-color: white;
        border-radius: 8px;
        padding: 40px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-top: 20px;
      }
      
      @media (max-width: 768px) {
        .checkout-container {
          flex-direction: column;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // 绑定事件
  bindEvents() {
    const submitOrderBtn = this.element.querySelector('#submit-order-btn');
    submitOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleSubmitOrder();
    });
  }

  // 加载购物车数据
  loadCartData() {
    // 从会话存储获取购物车数据
    this.cart = JSON.parse(sessionStorage.getItem('checkoutCart') || '[]');
    
    if (this.cart.length === 0) {
      // 购物车为空，跳转到购物车页面
      window.location.hash = '#/cart';
      return;
    }
    
    // 渲染订单商品列表
    this.renderOrderItems();
    // 更新订单总价
    this.updateOrderTotal();
  }

  // 渲染订单商品列表
  renderOrderItems() {
    const orderItemsContainer = this.element.querySelector('#order-items');
    orderItemsContainer.innerHTML = '';
    
    this.cart.forEach(item => {
      const orderItem = document.createElement('div');
      orderItem.className = 'order-item';
      orderItem.innerHTML = `
        <div>
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-info">数量: ${item.quantity} x ¥${item.price.toFixed(2)}</div>
        </div>
        <div>¥${(item.price * item.quantity).toFixed(2)}</div>
      `;
      orderItemsContainer.appendChild(orderItem);
    });
  }

  // 更新订单总价
  updateOrderTotal() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 99 ? 0 : 10; // 满99免运费
    const total = subtotal + shipping;
    
    this.element.querySelector('#subtotal').textContent = `¥${subtotal.toFixed(2)}`;
    this.element.querySelector('#shipping').textContent = `¥${shipping.toFixed(2)}`;
    this.element.querySelector('#total').textContent = `¥${total.toFixed(2)}`;
    
    // 保存订单总价
    this.order.subtotal = subtotal;
    this.order.shipping = shipping;
    this.order.total = total;
  }

  // 处理订单提交
  handleSubmitOrder() {
    // 验证表单
    const form = this.element.querySelector('#shipping-form');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // 获取表单数据
    const formData = new FormData(form);
    const shippingInfo = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      paymentMethod: formData.get('paymentMethod')
    };
    
    // 生成订单数据
    const orderId = 'ORDER' + Date.now();
    const orderDate = new Date().toISOString();
    
    this.order = {
      ...this.order,
      id: orderId,
      orderDate,
      status: 'pending',
      shippingInfo,
      items: this.cart
    };
    
    // 保存订单到本地存储
    this.saveOrder();
    
    // 清空购物车
    this.clearCart();
    
    // 显示订单提交成功页面
    this.showOrderConfirm();
  }

  // 保存订单到本地存储
  saveOrder() {
    // 获取现有订单
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    // 添加新订单
    orders.push(this.order);
    // 保存回本地存储
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  // 清空购物车
  clearCart() {
    localStorage.removeItem('cart');
    sessionStorage.removeItem('checkoutCart');
    
    // 更新购物车数量显示
    const event = new CustomEvent('updateCartCount', {
      detail: { count: 0 },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }

  // 显示订单提交成功页面
  showOrderConfirm() {
    const checkoutContainer = this.element.querySelector('.checkout-container');
    const orderConfirm = this.element.querySelector('#order-confirm');
    const orderNumber = this.element.querySelector('#order-number');
    
    checkoutContainer.style.display = 'none';
    orderConfirm.style.display = 'block';
    orderNumber.textContent = this.order.id;
  }
}

export default CheckoutPage;
