const pool = require('../db');

class Product {
  // 获取所有商品
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM products');
    return rows;
  }

  // 搜索商品
  static async findByKeyword(keyword) {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE name LIKE ?',
      [`%${keyword}%`]
    );
    return rows;
  }
}

module.exports = Product;