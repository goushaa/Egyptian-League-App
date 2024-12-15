const mongoose = require('mongoose');
const Match = require('../models/matchModel');
const Stadium = require('../models/stadiumModel');

const validateMatchData = (data) => {
  const { homeTeam, awayTeam, mainReferee, firstLinesman, secondLinesman, dateTime, ticketPrice } = data;

  if (homeTeam === awayTeam) {
    return 'Two teams cannot be the same';
  }

  if (mainReferee === firstLinesman || mainReferee === secondLinesman || firstLinesman === secondLinesman) {
    return 'Referees should be different';
  }

  const matchDate = new Date(dateTime);
  if (matchDate <= new Date()) {
    return 'Match should be in the future';
  }

  if (parseInt(ticketPrice, 10) <= 0) {
    return 'Ticket price should be larger than 0';
  }

  return null;
};

const createMatch = async (req, res) => {
  const { homeTeam, awayTeam, venue, dateTime, mainReferee, firstLinesman, secondLinesman, ticketPrice } = req.body;
  if (req.user.role == "fan") {
    return res.status(400).json({ error: 'Unauthorized access' });
  }

  const validationError = validateMatchData(req.body);
  if (validationError) {
    return res.status(406).send({ msg: validationError });
  }

  const stadium = await Stadium.findOne({ name: venue });
  if (!stadium) {
    return res.status(400).send({ err: 'The stadium does not exist' });
  }

  const matchDate = new Date(dateTime);
  const twelveHoursAgo = new Date(matchDate.getTime() - 12 * 60 * 60 * 1000);
  const twelveHoursLater = new Date(matchDate.getTime() + 12 * 60 * 60 * 1000);

  const existingMatches = await Match.find({
    dateTime: {
      $gte: twelveHoursAgo,
      $lte: twelveHoursLater
    }
  });

  for (const match of existingMatches) {
    if ([match.homeTeam, match.awayTeam].includes(homeTeam)) {
      return res.status(406).send({ msg: 'Home team is not available' });
    }

    if ([match.homeTeam, match.awayTeam].includes(awayTeam)) {
      return res.status(406).send({ msg: 'Away team is not available' });
    }

    if (mainReferee === match.mainReferee) {
      return res.status(406).send({ msg: 'Main Referee is not available' });
    }

    if ([match.firstLinesman, match.secondLinesman].includes(firstLinesman)) {
      return res.status(406).send({ msg: 'First Linesman is not available' });
    }

    if ([match.firstLinesman, match.secondLinesman].includes(secondLinesman)) {
      return res.status(406).send({ msg: 'Second Linesman is not available' });
    }

    if (venue === match.venue) {
      return res.status(406).send({ msg: 'Venue is not available' });
    }
  }

  const seats = Array.from({ length: stadium.rows }, (_, i) => {
    const rowNumber = String.fromCharCode('A'.charCodeAt(0) + i);
    return Array.from({ length: stadium.rowSeats }, (_, j) => ({
      number: rowNumber + (j + 1),
      isReserved: false
    }));
  });

  const match = new Match({
    homeTeam,
    awayTeam,
    venue,
    dateTime,
    mainReferee,
    firstLinesman,
    secondLinesman,
    ticketPrice,
    seats
  });

  try {
    await match.save();
    res.status(200).send({ msg: 'Match added successfully!' });
  } catch (err) {
    res.status(500).send({ err: err.message });
    console.error(err);
  }
};

const editMatch = async (req, res) => {
  const { matchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(matchId)) {
    return res.status(400).send({ err: 'Invalid match ID format.' });
  }

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).send({ err: 'No matches for the given Id.' });
    }

    const { homeTeam, awayTeam, venue, dateTime, mainReferee, firstLinesman, secondLinesman, ticketPrice } = req.body;

    const validationError = validateMatchData(req.body);
    if (validationError) {
      return res.status(406).send({ msg: validationError });
    }

    if (match.ticketPrice !== ticketPrice) {
      return res.status(406).send({ msg: "Ticket price can't be changed" });
    }

    const matchDate = new Date(dateTime);
    const twelveHoursAgo = new Date(matchDate.getTime() - 12 * 60 * 60 * 1000);
    const twelveHoursLater = new Date(matchDate.getTime() + 12 * 60 * 60 * 1000);

    const existingMatches = await Match.find({
      _id: { $ne: mongoose.Types.ObjectId(matchId) },
      dateTime: {
        $gte: twelveHoursAgo,
        $lte: twelveHoursLater
      }
    });

    for (const mat of existingMatches) {
      if ([mat.homeTeam, mat.awayTeam].includes(homeTeam)) {
        return res.status(406).send({ msg: 'Home team is not available' });
      }

      if ([mat.homeTeam, mat.awayTeam].includes(awayTeam)) {
        return res.status(406).send({ msg: 'Away team is not available' });
      }

      if (mainReferee === mat.mainReferee) {
        return res.status(406).send({ msg: 'Main Referee is not available' });
      }

      if ([mat.firstLinesman, mat.secondLinesman].includes(firstLinesman)) {
        return res.status(406).send({ msg: 'First Linesman is not available' });
      }

      if ([mat.firstLinesman, mat.secondLinesman].includes(secondLinesman)) {
        return res.status(406).send({ msg: 'Second Linesman is not available' });
      }

      if (venue === mat.venue) {
        return res.status(406).send({ msg: 'Venue is not available' });
      }
    }

    let seats = match.seats;
    if (match.venue !== venue) {
      const stadium = await Stadium.findOne({ name: venue });
      if (!stadium) {
        return res.status(400).send({ err: 'The stadium does not exist' });
      }

      const oldStadium = await Stadium.findOne({ name: match.venue });
      const elementsInOldNotInNew = [];

      for (let i = 0; i < oldStadium.rows; i++) {
        for (let j = 0; j < oldStadium.rowSeats; j++) {
          if (i >= stadium.rows || j >= stadium.rowSeats) {
            elementsInOldNotInNew.push(seats[i][j]);
          }
        }
      }

      if (elementsInOldNotInNew.some(element => element.isReserved)) {
        return res.status(400).send({ err: 'There are reserved seats in cancelled seats' });
      }

      seats = Array.from({ length: stadium.rows }, (_, i) => {
        const rowNumber = String.fromCharCode('A'.charCodeAt(0) + i);
        return Array.from({ length: stadium.rowSeats }, (_, j) => {
          if (i >= oldStadium.rows || j >= oldStadium.rowSeats) {
            return { number: rowNumber + (j + 1), isReserved: false };
          }
          return seats[i][j];
        });
      });
    }

    const updatedMatch = {
      homeTeam,
      awayTeam,
      venue,
      dateTime,
      mainReferee,
      firstLinesman,
      secondLinesman,
      ticketPrice,
      seats
    };

    await Match.findByIdAndUpdate(matchId, updatedMatch, { new: true });
    res.status(200).send({ msg: 'Match edited successfully!' });
  } catch (err) {
    res.status(500).send({ err: err.message });
    console.error(err);
  }
};

const viewMatch = async (req, res) => {
  const { matchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(matchId)) {
    return res.status(400).send({ err: 'Invalid match ID format.' });
  }

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).send({ err: 'No matches for the given Id.' });
    }
    res.status(200).send(match.toObject());
  } catch (err) {
    res.status(500).send({ err: err.message });
    console.error(err);
  }
};

const viewMatches = async (req, res) => {
  const currentDate = new Date();

  try {
    const matches = await Match.find({ dateTime: { $gt: currentDate } }).sort({ dateTime: 1 });
    res.status(200).send({ matches: matches.map(match => match.toObject()) });
  } catch (err) {
    res.status(500).send({ err: err.message });
    console.error(err);
  }
};

module.exports = { createMatch, editMatch, viewMatch, viewMatches };
