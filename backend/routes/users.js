// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 获取所有用户数据的接口
router.get('/', async (req, res) => {
  try {
    // 这里需要在User模型中添加findAll方法
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;