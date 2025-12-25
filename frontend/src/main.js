// 前端项目入口文件
import './styles/main.css';
import Header from './components/Header.js';
import ProductsPage from './pages/ProductsPage.js';
import SearchPage from './pages/SearchPage.js';
import CartPage from './pages/CartPage.js';
import CheckoutPage from './pages/CheckoutPage.js';

// 路由系统
class Router {
  constructor() {
    this.routes = {};
    this.header = new Header();
  }

  // 注册路由
  register(path, component) {
    this.routes[path] = component;
  }

  // 处理路由变化
  async handleRouteChange() {
    const path = window.location.hash || '#/products';
    const route = path.split('?')[0]; // 去除查询参数
    const component = this.routes[route] || this.routes['#/products'];

    // 创建页面组件
    const page = new component();
    const pageElement = await page.createElement();

    // 渲染页面
    const app = document.getElementById('app');
    app.innerHTML = '';
    
    // 添加头部组件
    const headerElement = this.header.createElement();
    app.appendChild(headerElement);
    
    // 添加页面组件
    app.appendChild(pageElement);

    // 监听购物车数量更新事件
    pageElement.addEventListener('updateCartCount', (e) => {
      this.header.handleCartCountUpdate(e.detail.count);
    });
  }

  // 启动路由
  start() {
    // 监听哈希变化
    window.addEventListener('hashchange', () => this.handleRouteChange());
    // 初始加载
    this.handleRouteChange();
  }
}

// 初始化应用程序
function initApp() {
  // 创建路由实例
  const router = new Router();

  // 注册路由
  router.register('#/products', ProductsPage);
  router.register('#/search', SearchPage);
  router.register('#/cart', CartPage);
  router.register('#/checkout', CheckoutPage);

  // 启动路由
  router.start();

  console.log('应用程序已初始化');
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);
