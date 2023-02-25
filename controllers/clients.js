const Client = require("../models/Client");

const getClients = async (req, res) => {
  try {
    const response = await Client.find();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClientByID = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Client.findById(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  getClientByID,
  getClients,
};
