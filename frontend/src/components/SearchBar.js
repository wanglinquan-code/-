// 搜索栏组件
class SearchBar {
  constructor() {
    this.element = null;
    this.searchInput = null;
  }

  // 创建DOM元素
  createElement() {
    const div = document.createElement('div');
    div.className = 'search-box';
    div.innerHTML = `
      <input type="text" class="search-input" placeholder="搜索商品..." id="search-input">
      <button class="search-btn btn" id="search-btn">搜索</button>
    `;
    
    this.element = div;
    this.searchInput = div.querySelector('#search-input');
    this.bindEvents();
    return div;
  }

  // 绑定事件
  bindEvents() {
    const searchBtn = this.element.querySelector('#search-btn');
    
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', () => {
      this.handleSearch();
    });
    
    // 回车键搜索事件
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });
  }

  // 处理搜索事件
  handleSearch() {
    const keyword = this.searchInput.value.trim();
    if (keyword) {
      // 触发搜索事件，通知父组件
      const event = new CustomEvent('search', {
        detail: { keyword },
        bubbles: true
      });
      this.element.dispatchEvent(event);
      
      // 跳转到搜索结果页面
      window.location.hash = `#/search?keyword=${encodeURIComponent(keyword)}`;
    }
  }

  // 获取搜索关键词
  getKeyword() {
    return this.searchInput.value.trim();
  }

  // 设置搜索关键词
  setKeyword(keyword) {
    this.searchInput.value = keyword;
  }
}

export default SearchBar;
