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
    return div;
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
