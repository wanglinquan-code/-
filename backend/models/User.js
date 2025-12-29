const pool = require('../db');
const bcrypt = require('bcrypt');

class User {
  // 根据用户名查用户
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  // 根据ID查用户
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // 获取所有用户
  static async findAll() {
    const [rows] = await pool.execute('SELECT id, username, created_at, email, phone FROM users');
    return rows;
  }

  // 创建用户（注册）
  static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return result.insertId;
  }

  // 验证密码
  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  // 更新用户资料（email, phone）
  static async updateProfile(id, { email, phone }) {
    const [result] = await pool.execute(
      'UPDATE users SET email = ?, phone = ? WHERE id = ?',
      [email || null, phone || null, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;