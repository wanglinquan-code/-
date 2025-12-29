// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 获取所有用户数据的接口
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 根据ID获取用户
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: '用户未找到' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新用户资料（email, phone）
router.put('/:id', async (req, res) => {
  try {
    const { email, phone } = req.body;
    const updated = await User.updateProfile(req.params.id, { email, phone });
    if (!updated) return res.status(404).json({ message: '更新失败，用户未找到' });
    const user = await User.findById(req.params.id);
    res.json({ message: '更新成功', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;