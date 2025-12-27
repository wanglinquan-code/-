class Header {
  constructor() {
    this.element = null;
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'global-header';
    div.innerHTML = `
      <div class="header-container">
        <h2 class="logo">电商购物平台</h2>
        <div class="nav-links">
          <a href="#/products" class="nav-link">商品列表</a>
          <a href="#/cart" class="nav-link">我的购物车</a>
          <a href="#/user-center" class="nav-link" id="user-center-link" style="display: none;">个人中心</a>
          <a href="#/login" class="nav-link" id="login-link">登录/注册</a>
        </div>
      </div>
    `;
    this.element = div;
    this.addStyles();
    this.updateLoginStatus(); // 初始化登录状态显示
    return div;
  }

  // 添加导航栏样式
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .global-header {
        background: #ff6b81;
        color: white;
        padding: 15px 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .header-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
      }
      .logo { margin: 0; font-size: 20px; }
      .nav-links { display: flex; gap: 20px; }
      .nav-link {
        color: white;
        text-decoration: none;
        font-size: 16px;
        cursor: pointer;
      }
      .nav-link:hover { text-decoration: underline; }
    `;
    this.element.appendChild(style);
  }

  // 更新登录状态（登录后显示用户名，而非登录按钮）
  updateLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginLink = this.element.querySelector('#login-link');
    const userCenterLink = this.element.querySelector('#user-center-link');
    
    if (user) {
      // 显示个人中心链接
      userCenterLink.style.display = 'inline-block';
      
      // 改造登录链接为用户信息和登出
      loginLink.textContent = `欢迎：${user.username}`;
      loginLink.href = 'javascript:void(0)';
      
      // 移除原有事件监听，添加新的
      const newLoginLink = loginLink.cloneNode(true);
      newLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('确定要退出登录吗？')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.hash = '#/products';
        }
      });
      loginLink.replaceWith(newLoginLink);
    } else {
      // 隐藏个人中心链接
      userCenterLink.style.display = 'none';
      
      loginLink.textContent = '登录/注册';
      loginLink.href = '#/login';
    }
  }
}

export default Header;