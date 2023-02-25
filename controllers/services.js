const Service = require("../models/Service");

const createService = async (req, res) => {
  const service = new Service(req.body);
  try {
    const response = await service.save();
    res.status(201).json(response);
  } catch (err) {
    res.json({ message: err.message });
  }
};

const getServicesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const response = await Service.find({ category }).populate(
      "category",
      "name"
    );
    res.json(response);
  } catch (err) {
    res.status(500).status(500).json({ message: err.message });
  }
};

const getServices = async (req, res) => {
  try {
    const data = await Service.find().populate("category", "name");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createService,
  getServicesByCategory,
  getServices,
};
