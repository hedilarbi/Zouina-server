const Category = require("../models/Category");

const createCategory = async (req, res) => {
  const { name, image } = req.body;

  try {
    const category = await Category.findOne({ name });
    if (category) {
      return res.json({ message: "categorie existe déja" });
    }
    const newCategory = new Category({
      name,
      image,
    });
    const data = await newCategory.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const data = await Category.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { createCategory, getCategories };
