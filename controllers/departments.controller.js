const Department = require('../models/department.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Department.find());
  } catch(err) {
    res.status(500).json(err);
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(rand);

    if (!dep) res.status(404).json({ message: 'Not found...' });
    else res.json(dep);
  } catch(err) {
    res.status(500).json(err);
  }
};

exports.getOne = async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (!dep) res.status(404).json({ message: 'Not found...' });
    else res.json(dep);
  } catch(err) {
    res.status(500).json(err);
  }
};

exports.post = async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name: name });
    await newDepartment.save();
    res.json(newDepartment);
  } catch(err) {
    res.status(500).json(err);
  }
};

exports.put = async (req, res) => {
  const { name } = req.body;
  try {
    const dep = await(Department.findById(req.params.id));
    if (dep) {
      dep.name = name;
      await dep.save();
      res.json(dep);
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch(err) {
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const dep = await(Department.findById(req.params.id));
    if (dep) {
      await Department.deleteOne({ _id: req.params.id });
      res.json(dep);
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch(err) {
    res.status(500).json(err);
  }
};