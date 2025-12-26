import ProductsPage from './pages/ProductsPage.js';
import CartPage from './pages/CartPage.js';
import CheckoutPage from './pages/CheckoutPage.js';
import LoginPage from './pages/LoginPage.js';

class App {
  constructor() {
    this.app = document.getElementById('app');
    // 路由映射
    this.routes = {
      '#/products': ProductsPage,
      '#/cart': CartPage,
      '#/checkout': CheckoutPage,
      '#/login': LoginPage,
      '#/': ProductsPage // 默认路由
    };

    // 监听路由变化
    window.addEventListener('hashchange', () => this.handleRouteChange());
    // 初始化
    this.handleRouteChange();
  }

  // 路由处理 + 权限控制
  handleRouteChange() {
    const hash = window.location.hash;
    const isLogin = !!localStorage.getItem('token');

    // 保护结算页：未登录跳转到登录页
    if (hash === '#/checkout' && !isLogin) {
      alert('请先登录再结算！');
      window.location.hash = '#/login';
      return;
    }

    // 获取当前路由组件
    const Page = this.routes[hash] || this.routes['#/'];
    const page = new Page();

    // 渲染页面
    this.app.innerHTML = '';
    this.app.appendChild(page.createElement());
    // 执行页面初始化（如加载商品）
    if (page.mount) page.mount();
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => new App());