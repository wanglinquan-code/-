// 商品项组件
class ProductItem {
  constructor(product) {
    this.product = product;
    this.element = null;
  }

  // 创建DOM元素
  createElement() {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.innerHTML = `
      <img class="product-image" src="${this.product.imageUrl || 'https://via.placeholder.com/200'}" alt="${this.product.name}">
      <div class="product-info">
        <h3 class="product-name">${this.product.name}</h3>
        <p class="product-price">¥${this.product.price.toFixed(2)}</p>
        <button class="add-to-cart-btn" data-id="${this.product.id}">加入购物车</button>
      </div>
    `;
    this.element = div;
    this.bindEvents();
    this.addStyles();
    return div;
  }

  // 添加样式，使商品列表项像购物车一样显示图片
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .product-item {
        display: flex;
        align-items: center;
        gap: 16px;
        background: white;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        margin-bottom: 12px;
      }

      .product-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
        flex-shrink: 0;
      }

      .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .product-name {
        margin: 0;
        font-size: 16px;
        color: #333;
      }

      .product-price {
        margin: 0;
        color: #ff6b81;
        font-weight: 600;
      }

      .add-to-cart-btn {
        align-self: start;
        background: #ff6b81;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .add-to-cart-btn:hover {
        background: #ff4757;
      }
    `;
    document.head.appendChild(style);
  }

  // 绑定事件
  bindEvents() {
    const addToCartBtn = this.element.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      this.handleAddToCart(productId);
    });
  }

  // 处理加入购物车事件
  handleAddToCart(productId) {
    // 触发自定义事件，通知父组件
    const event = new CustomEvent('addToCart', {
      detail: { productId },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }
}

export default ProductItem;
