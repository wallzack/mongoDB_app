// post.routes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

router.get('/products', async (req, res) => {

  try {
    res.json(await Product.find());
  } catch(err) {
    res.status(500).json(err);
  }
});

router.get('/products/random', async (req, res) => {

  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const prod = await Product.findOne().skip(rand);

    if (!prod) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      res.json(prod);
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

router.get('/products/:id', async (req, res) => {

  try {
    const prod = await Product.findById(req.params.id);

    if (!prod) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      res.json(prod);
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

router.post('/products', async (req, res) => {
  const { name, client } = req.body;

  try {
    const newProd = new Product({ name: name, client: client });
    await newProd.save();
    res.json(newProd);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;

  try {
    const prod = await Product.findById(req.params.id);

    if (!prod) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      prod.name = name;
      prod.client = client;
      await prod.save();
      res.json(prod);
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

router.delete('/products/:id', async (req, res) => {

  try {
    const prod = await Product.findById(req.params.id);

    if (!prod) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'ok' });
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;