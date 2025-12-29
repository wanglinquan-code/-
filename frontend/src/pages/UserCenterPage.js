// 个人中心页面
class UserCenterPage {
  constructor() {
    this.element = null;
    this.user = null;
    this.orders = [];
    this.currentTab = 'orders'; // 当前激活的tab
  }

  // 创建DOM元素
  createElement() {
    // 检查用户是否登录
    this.user = JSON.parse(localStorage.getItem('user'));
    if (!this.user) {
      // 未登录，显示提示信息
      const div = document.createElement('div');
      div.className = 'user-center-page';
      div.innerHTML = `
        <div class="container">
          <div style="text-align: center; padding: 60px 20px;">
            <h2>个人中心</h2>
            <p style="color: #999; font-size: 16px; margin: 20px 0;">请先登录以查看个人中心</p>
            <a href="#/login" class="btn" style="background: #ff6b81; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block;">去登录</a>
          </div>
        </div>
      `;
      this.element = div;
      return div;
    }

    const div = document.createElement('div');
    div.className = 'user-center-page';
    div.innerHTML = `
      <div class="container">
        <div class="user-header">
          <div class="user-info">
            <h2>个人中心</h2>
            <p class="welcome">欢迎，${this.user.username}</p>
          </div>
          <button id="logout-btn" class="btn logout-btn">退出登录</button>
        </div>

        <div class="user-center-wrapper">
          <aside class="sidebar">
            <nav class="menu">
              <div class="menu-item active" data-tab="orders">
                <span class="icon">📦</span>
                <span class="text">我的订单</span>
              </div>
              <div class="menu-item" data-tab="profile">
                <span class="icon">👤</span>
                <span class="text">个人信息</span>
              </div>
              <div class="menu-item" data-tab="address">
                <span class="icon">📍</span>
                <span class="text">收货地址</span>
              </div>
            </nav>
          </aside>

          <main class="main-content">
            <!-- 订单列表 -->
            <section id="orders-tab" class="tab-pane active">
              <div class="tab-header">
                <h3>我的订单</h3>
              </div>
              <div id="orders-list" class="orders-list">
                <div class="empty-state">
                  <p>暂无订单</p>
                  <a href="#/products" class="btn-link">去购物</a>
                </div>
              </div>
            </section>

            <!-- 个人信息 -->
            <section id="profile-tab" class="tab-pane">
              <div class="tab-header">
                <h3>个人信息</h3>
              </div>
              <div class="info-form">
                <div class="form-item">
                  <label>用户名</label>
                  <input type="text" id="username-display" readonly>
                </div>
                <!-- 已移除邮箱与电话显示 -->
                <div class="form-item">
                  <label>注册时间</label>
                  <input type="text" id="joindate-display" readonly>
                </div>
              </div>
            </section>

            <!-- 收货地址 -->
            <section id="address-tab" class="tab-pane">
              <div class="tab-header">
                <h3>收货地址</h3>
                <button id="add-address-btn" class="btn btn-small">+ 新增地址</button>
              </div>
              <div id="address-list" class="address-list">
                <div class="empty-state">
                  <p>暂无保存的地址</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    `;

    this.element = div;
    this.addStyles();
    this.bindEvents();
    this.loadData();

    return div;
  }

  // 加载数据
  loadData() {
    this.loadUserInfo();
    this.loadOrders();
  }

  // 加载用户信息
  loadUserInfo() {
    const usernameDisplay = this.element.querySelector('#username-display');
    // 邮箱与电话已从个人信息中移除
    const joindateDisplay = this.element.querySelector('#joindate-display');

    if (this.user) {
      usernameDisplay.value = this.user.username || '';
      joindateDisplay.value = this.user.createdAt 
        ? new Date(this.user.createdAt).toLocaleDateString('zh-CN')
        : new Date().toLocaleDateString('zh-CN');
    }
  }

  // 加载订单数据
  loadOrders() {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // 过滤当前用户的订单
    this.orders = allOrders.filter(order => {
      return order.userId === this.user.id || order.username === this.user.username;
    });

    this.renderOrders();
  }

  // 渲染订单列表
  renderOrders() {
    const ordersList = this.element.querySelector('#orders-list');
    
    if (this.orders.length === 0) {
      ordersList.innerHTML = `
        <div class="empty-state">
          <p>暂无订单</p>
          <a href="#/products" class="btn-link">去购物</a>
        </div>
      `;
      return;
    }

    ordersList.innerHTML = this.orders.map(order => this.renderOrderCard(order)).join('');
  }

  // 渲染单个订单卡片
  renderOrderCard(order) {
    const status = this.getOrderStatus(order.createdAt);
    const statusText = this.getStatusText(status);
    const statusColor = this.getStatusColor(status);

    const itemsHtml = order.items.map(item => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return `
        <div class="order-item-row">
          <span>${item.name}</span>
          <span>x${item.quantity}</span>
          <span>¥${price.toFixed(2)}</span>
        </div>
      `;
    }).join('');

    const logisticsHtml = this.renderLogisticsTimeline(order.createdAt);

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div class="order-info">
            <div class="order-id">订单号：${order.id}</div>
            <div class="order-time">${new Date(order.createdAt).toLocaleDateString('zh-CN')}</div>
          </div>
          <div class="order-status" style="color: ${statusColor}; font-weight: 500;">
            ${statusText}
          </div>
        </div>

        <div class="order-card-items">
          ${itemsHtml}
        </div>

        <div class="order-card-shipping">
          <h5>收货信息</h5>
          <div class="shipping-info">
            <p><span>收货人：</span><span>${order.shipping.name}</span></p>
            <p><span>电话：</span><span>${order.shipping.phone}</span></p>
            <p><span>地址：</span><span>${order.shipping.address}</span></p>
          </div>
        </div>

        <div class="order-card-logistics">
          <h5>物流状态</h5>
          <div class="logistics-timeline">
            ${logisticsHtml}
          </div>
        </div>

          <div class="order-card-footer">
          <div class="order-total">
            <span>订单总额：</span>
            <span class="amount">¥${order.total.toFixed(2)}</span>
          </div>
          <div class="order-actions">
            <button class="btn-action" onclick="alert('功能开发中...')">申请售后</button>
            <button class="btn-action delete" data-order-id="${order.id}">删除订单</button>
          </div>
        </div>
      </div>
    `;
  }

  // 计算订单状态
  getOrderStatus(createdTime) {
    const now = new Date();
    const orderTime = new Date(createdTime);
    const daysDiff = (now - orderTime) / (1000 * 60 * 60 * 24);

    if (daysDiff < 1) return 0; // 待发货
    if (daysDiff < 3) return 1; // 已发货
    if (daysDiff < 7) return 2; // 配送中
    if (daysDiff < 15) return 3; // 已收货
    return 4; // 已完成
  }

  // 获取状态文本
  getStatusText(status) {
    const statusMap = {
      0: '待发货',
      1: '已发货',
      2: '配送中',
      3: '已收货',
      4: '已完成'
    };
    return statusMap[status] || '未知';
  }

  // 获取状态颜色
  getStatusColor(status) {
    const colorMap = {
      0: '#ff9800',
      1: '#2196f3',
      2: '#1976d2',
      3: '#4caf50',
      4: '#999999'
    };
    return colorMap[status] || '#666';
  }

  // 渲染物流时间线
  renderLogisticsTimeline(createdTime) {
    const orderTime = new Date(createdTime);
    const now = new Date();
    const daysDiff = (now - orderTime) / (1000 * 60 * 60 * 24);

    const milestones = [
      { day: 0, text: '订单已创建' },
      { day: 1, text: '商品已发货' },
      { day: 3, text: '商品派送中' },
      { day: 5, text: '商品已签收' },
      { day: 15, text: '订单已完成' }
    ];

    return milestones.map((milestone, index) => {
      const isCompleted = daysDiff >= milestone.day;
      const eventDate = new Date(orderTime.getTime() + milestone.day * 24 * 60 * 60 * 1000);
      const dateStr = eventDate.toLocaleDateString('zh-CN', { 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <div class="timeline-item ${isCompleted ? 'completed' : ''}">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-text">${milestone.text}</div>
            <div class="timeline-date">${dateStr}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 删除订单
  deleteOrder(orderId) {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const filtered = allOrders.filter(o => o.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(filtered));

    // 更新当前页面数据并重新渲染
    this.orders = this.orders.filter(o => o.id !== orderId);
    this.renderOrders();
  }

  // 绑定事件
  bindEvents() {
    // 标签页切换
    const menuItems = this.element.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const tabName = item.dataset.tab;
        this.switchTab(tabName);
        
        // 更新菜单状态
        menuItems.forEach(m => m.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // 退出登录
    const logoutBtn = this.element.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.hash = '#/products';
        }
      });
    }

    // 新增地址按钮
    const addAddressBtn = this.element.querySelector('#add-address-btn');
    if (addAddressBtn) {
      addAddressBtn.addEventListener('click', () => {
        alert('地址管理功能开发中...');
      });
    }

    // 订单删除事件（事件委托）
    const ordersList = this.element.querySelector('#orders-list');
    if (ordersList) {
      ordersList.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-action.delete');
        if (btn) {
          const orderId = btn.dataset.orderId;
          if (confirm('确定删除此订单?')) {
            this.deleteOrder(orderId);
          }
        }
      });
    }
  }

  // 切换标签页
  switchTab(tabName) {
    // 隐藏所有标签页
    const panes = this.element.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.classList.remove('active'));

    // 显示选中的标签页
    const selectedPane = this.element.querySelector(`#${tabName}-tab`);
    if (selectedPane) {
      selectedPane.classList.add('active');
    }

    this.currentTab = tabName;
  }

  // 添加样式
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .user-center-page {
        padding: 20px 0;
        background: #f5f5f5;
        min-height: calc(100vh - 100px);
      }

      .user-center-page .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .user-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 30px;
        border-radius: 8px;
        margin-bottom: 30px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .user-header h2 {
        margin: 0 0 10px 0;
        font-size: 24px;
        color: #333;
      }

      .welcome {
        margin: 0;
        color: #ff6b81;
        font-size: 14px;
      }

      .logout-btn {
        background: #ff6b81;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
      }

      .logout-btn:hover {
        background: #ff4757;
      }

      .user-center-wrapper {
        display: flex;
        gap: 20px;
      }

      .sidebar {
        width: 200px;
        background: white;
        border-radius: 8px;
        padding: 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        height: fit-content;
      }

      .menu {
        display: flex;
        flex-direction: column;
      }

      .menu-item {
        padding: 16px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #666;
        border-left: 3px solid transparent;
        transition: all 0.3s;
        font-size: 14px;
      }

      .menu-item:hover {
        background: #f5f5f5;
        color: #ff6b81;
      }

      .menu-item.active {
        background: #fff0f2;
        color: #ff6b81;
        border-left-color: #ff6b81;
        font-weight: 500;
      }

      .menu-item .icon {
        font-size: 18px;
      }

      .main-content {
        flex: 1;
        background: white;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .tab-pane {
        display: none;
      }

      .tab-pane.active {
        display: block;
      }

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f0f0f0;
      }

      .tab-header h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
      }

      .btn-small {
        background: #ff6b81;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.3s;
      }

      .btn-small:hover {
        background: #ff4757;
      }

      /* 订单相关样式 */
      .orders-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .order-card {
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 20px;
        background: #fafafa;
        transition: box-shadow 0.3s;
      }

      .order-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .order-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }

      .order-info {
        display: flex;
        gap: 20px;
      }

      .order-id {
        font-weight: 600;
        color: #333;
      }

      .order-time {
        color: #999;
        font-size: 12px;
      }

      .order-card-items {
        margin-bottom: 15px;
        padding: 10px;
        background: white;
        border-radius: 4px;
      }

      .order-item-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
        font-size: 13px;
      }

      .order-item-row:last-child {
        border-bottom: none;
      }

      .order-card-shipping {
        margin-bottom: 15px;
        padding: 10px;
        background: white;
        border-radius: 4px;
      }

      .order-card-shipping h5 {
        margin: 0 0 10px 0;
        font-size: 13px;
        color: #333;
      }

      .shipping-info p {
        margin: 6px 0;
        font-size: 12px;
        color: #666;
        display: flex;
        gap: 10px;
      }

      .shipping-info span:first-child {
        min-width: 60px;
        color: #999;
        font-weight: 500;
      }

      /* 物流时间线 */
      .order-card-logistics {
        margin-bottom: 15px;
        padding: 15px;
        background: white;
        border-radius: 4px;
      }

      .order-card-logistics h5 {
        margin: 0 0 15px 0;
        font-size: 13px;
        color: #333;
      }

      .logistics-timeline {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .timeline-item {
        display: flex;
        gap: 12px;
      }

      .timeline-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ddd;
        border: 2px solid white;
        margin-top: 4px;
        flex-shrink: 0;
      }

      .timeline-item.completed .timeline-dot {
        background: #4caf50;
      }

      .timeline-content {
        flex: 1;
      }

      .timeline-text {
        font-size: 13px;
        color: #333;
        font-weight: 500;
      }

      .timeline-date {
        font-size: 11px;
        color: #999;
        margin-top: 2px;
      }

      .order-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        border-top: 1px solid #eee;
      }

      .order-total {
        display: flex;
        gap: 10px;
        font-size: 14px;
        color: #333;
      }

      .amount {
        color: #ff6b81;
        font-weight: 600;
        font-size: 16px;
      }

      .order-actions {
        display: flex;
        gap: 10px;
      }

      .btn-action {
        background: #f0f0f0;
        color: #333;
        border: 1px solid #ddd;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s;
      }

      .btn-action:hover {
        background: #e0e0e0;
      }

      .btn-action.delete {
        color: #ff6b81;
      }

      .btn-action.delete:hover {
        background: #ffe0e0;
      }

      /* 信息表单 */
      .info-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }

      .form-item {
        display: flex;
        flex-direction: column;
      }

      .form-item label {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .form-item input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        background: #f9f9f9;
      }

      /* 地址列表 */
      .address-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #999;
      }

      .empty-state p {
        margin: 0 0 20px 0;
        font-size: 16px;
      }

      .btn-link {
        color: #ff6b81;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
      }

      .btn-link:hover {
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        .user-center-wrapper {
          flex-direction: column;
        }

        .sidebar {
          width: 100%;
        }

        .menu {
          flex-direction: row;
          overflow-x: auto;
        }

        .order-card-footer {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .order-card-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

export default UserCenterPage;
