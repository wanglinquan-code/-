const mysql = require('mysql2/promise');

// ！！！修改为你的MySQL密码！！！
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234', // 比如 123456
  database: 'shopping_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;