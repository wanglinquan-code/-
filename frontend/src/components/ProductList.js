// 商品列表组件
import ProductItem from './ProductItem.js';

class ProductList {
  constructor(products) {
    this.products = products;
    this.element = null;
  }

  // 创建DOM元素
  createElement() {
    const div = document.createElement('div');
    div.className = 'product-list';
    
    // 渲染商品列表
    this.products.forEach(product => {
      const productItem = new ProductItem(product);
      const productElement = productItem.createElement();
      div.appendChild(productElement);
    });
    
    this.element = div;
    return div;
  }

  // 更新商品列表
  updateProducts(newProducts) {
    this.products = newProducts;
    if (this.element) {
      // 清空现有内容
      this.element.innerHTML = '';
      // 重新渲染商品列表
      this.products.forEach(product => {
        const productItem = new ProductItem(product);
        const productElement = productItem.createElement();
        this.element.appendChild(productElement);
      });
    }
  }

  // 设置事件监听器
  setOnAddToCartListener(callback) {
    if (this.element) {
      this.element.addEventListener('addToCart', (e) => {
        callback(e.detail.productId);
      });
    }
  }
}

export default ProductList;
