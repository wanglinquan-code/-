import ProductsPage from './pages/ProductsPage.js';
import CartPage from './pages/CartPage.js';
import CheckoutPage from './pages/CheckoutPage.js';
import LoginPage from './pages/LoginPage.js';
import UserCenterPage from './pages/UserCenterPage.js';
import Header from './components/Header.js';

class App {
  constructor() {
    this.app = document.getElementById('app');
    this.currentHeader = null;
    
    // 路由映射
    this.routes = {
      '#/products': ProductsPage,
      '#/cart': CartPage,
      '#/checkout': CheckoutPage,
      '#/login': LoginPage,
      '#/user-center': UserCenterPage,
      '#/': ProductsPage // 默认路由
    };

    // 先渲染Header
    this.renderHeader();

    // 监听路由变化
    window.addEventListener('hashchange', () => this.handleRouteChange());
    
    // 初始化
    this.handleRouteChange();
  }

  // 渲染Header
  renderHeader() {
    const oldHeader = this.app.querySelector('.global-header');
    if (oldHeader) {
      oldHeader.remove();
    }
    this.currentHeader = new Header();
    const headerEl = this.currentHeader.createElement();
    this.app.insertBefore(headerEl, this.app.firstChild);
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

    // 保护个人中心：未登录跳转到登录页
    if (hash === '#/user-center' && !isLogin) {
      alert('请先登录！');
      window.location.hash = '#/login';
      return;
    }

    // 刷新Header以更新登录状态
    this.renderHeader();

    // 获取当前路由组件
    const Page = this.routes[hash] || this.routes['#/'];
    const page = new Page();

    // 保存Header元素
    const headerElement = this.app.querySelector('.global-header');
    
    // 移除所有非Header的子元素
    const allChildren = Array.from(this.app.children);
    allChildren.forEach(child => {
      if (child !== headerElement) {
        child.remove();
      }
    });

    // 添加新页面
    const pageEl = page.createElement();
    this.app.appendChild(pageEl);
    
    // 执行页面初始化（如加载商品）
    if (page.mount) page.mount();
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => new App());