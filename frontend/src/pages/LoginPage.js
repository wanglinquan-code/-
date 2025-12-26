import { login, register } from '../services/api';

class LoginPage {
  constructor() {
    this.element = null;
    this.isRegister = false; // 切换登录/注册
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'login-page';
    div.innerHTML = `
      <div class="login-container">
        <h2>${this.isRegister ? '用户注册' : '用户登录'}</h2>
        <form id="auth-form">
          <div class="form-group">
            <label>用户名：</label>
            <input type="text" id="username" required placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <label>密码：</label>
            <input type="password" id="password" required placeholder="请输入密码">
          </div>
          <div class="error" id="error"></div>
          <button type="submit" class="submit-btn">${this.isRegister ? '注册' : '登录'}</button>
        </form>
        <p class="toggle">
          ${this.isRegister ? '已有账号？' : '没有账号？'}
          <span id="toggle-btn">${this.isRegister ? '去登录' : '去注册'}</span>
        </p>
      </div>
    `;
    this.element = div;
    this.addStyles();
    this.bindEvents();
    return div;
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .login-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
      .login-container { width: 400px; padding: 30px; border: 1px solid #eee; border-radius: 8px; }
      .form-group { margin-bottom: 15px; }
      .form-group label { display: block; margin-bottom: 5px; }
      .form-group input { width: 100%; padding: 8px; box-sizing: border-box; }
      .submit-btn { width: 100%; padding: 10px; background: #ff6b81; color: white; border: none; border-radius: 4px; cursor: pointer; }
      .error { color: red; margin: 10px 0; min-height: 20px; }
      .toggle { text-align: center; margin-top: 15px; }
      #toggle-btn { color: #ff6b81; cursor: pointer; text-decoration: underline; }
    `;
    this.element.appendChild(style);
  }

  bindEvents() {
    // 切换登录/注册
    this.element.querySelector('#toggle-btn').addEventListener('click', () => {
      this.isRegister = !this.isRegister;
      this.element.replaceWith(this.createElement());
    });

    // 提交表单
    this.element.querySelector('#auth-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = this.element.querySelector('#username').value.trim();
      const password = this.element.querySelector('#password').value.trim();
      const errorEl = this.element.querySelector('#error');
      errorEl.textContent = '';

      try {
        if (this.isRegister) {
          await register(username, password);
          alert('注册成功！请登录');
          this.isRegister = false;
          this.element.replaceWith(this.createElement());
        } else {
          await login(username, password);
          alert('登录成功！');
          window.location.hash = '#/products'; // 跳转到商品页
        }
      } catch (error) {
        errorEl.textContent = error.message;
      }
    });
  }
}

export default LoginPage;