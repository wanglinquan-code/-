const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 获取所有商品
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: '获取商品失败', error: error.message });
  }
});

// 搜索商品
router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    const products = await Product.findByKeyword(keyword || '');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: '搜索商品失败', error: error.message });
  }
});

module.exports = router;