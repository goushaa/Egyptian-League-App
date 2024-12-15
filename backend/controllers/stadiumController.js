const Stadium = require('../models/stadiumModel');

const createStadium = async (req, res) => {
  try {
    const { name, city, address, rows, rowSeats } = req.body;

    const existingStadium = await Stadium.findOne({ name, city });
    if (existingStadium) {
      return res.status(403).send({ err: 'This stadium already exists.' });
    }

    const stadium = new Stadium({ name, city, address, rows, rowSeats });
    await stadium.save();
    res.status(200).send({ msg: 'Stadium added successfully!' });
  } catch (err) {
    res.status(500).send({ err: err.message });
    console.error(err);
  }
};

const getStadiums = async (req, res) => {
  try {
    const stadiums = await Stadium.find();
    res.status(200).send(stadiums.map(stadium => stadium.toObject()));
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};

module.exports = { createStadium, getStadiums };
