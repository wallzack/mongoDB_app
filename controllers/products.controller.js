const Product = require('../models/product.model');


exports.getAll = async (req, res) => {
  try {
    res.json(await Product.find());
  } catch(err) {
    res.status(500).json(err);
  }
};

exports.getRandom = async (req, res) => {
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
};

exports.getOne = async (req, res) => {
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
};

exports.post = async (req, res) => {
  const { name, client } = req.body;
  try {
    const newProd = new Product({ name: name, client: client });
    await newProd.save();
    res.json(newProd);
  } catch(err) {
    res.status(500).json(err);
  }
};

exports.put = async (req, res) => {
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
};

exports.delete = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);

    if (!prod) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      await Product.deleteOne({ _id: req.params.id });
      res.json(prod);
    }
  } catch(err) {
    res.status(500).json(err);
  }
};
