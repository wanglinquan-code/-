import Header from './components/Header.js';
import ProductsPage from './pages/ProductsPage.js';
import CartPage from './pages/CartPage.js';
import CheckoutPage from './pages/CheckoutPage.js';
import LoginPage from './pages/LoginPage.js';
import './styles/main.css';

class App {
  constructor() {
    this.app = document.getElementById('app');
    this.header = null;
    // 路由映射
    this.routes = {
      '#/products': ProductsPage,
      '#/cart': CartPage,
      '#/checkout': CheckoutPage,
      '#/login': LoginPage,
      '#/': ProductsPage // 默认路由
    };

    // 初始化页面结构
    this.initPageStructure();
    
    // 监听路由变化
    window.addEventListener('hashchange', () => this.handleRouteChange());
    // 初始化
    this.handleRouteChange();
  }

  // 初始化页面结构（Header + main内容区域）
  initPageStructure() {
    // 创建主容器
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-container';
    
    // 创建Header
    this.header = new Header();
    mainContainer.appendChild(this.header.createElement());
    
    // 创建main内容区域
    const mainContent = document.createElement('main');
    mainContent.className = 'main';
    mainContent.id = 'page-content';
    mainContainer.appendChild(mainContent);
    
    this.app.appendChild(mainContainer);
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

    // 渲染页面到main内容区域
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = '';
    pageContent.appendChild(page.createElement());
    // 关键：确保mount方法执行（CartPage的mount会加载购物车）
    if (page.mount) page.mount(); // 这一行必须保留！
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => new App());