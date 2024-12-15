const ticketModel = require('../models/ticketModel.js');
const Match = require('../models/matchModel.js');

const reserveTicket = async (req, res) => {
  try {
    const { matchId, seatNumbers, userName } = req.body;
    const match = await Match.findById(matchId);

    if (!match) {
      throw new Error('No match found to be updated!');
    }

    match.seats.forEach(row => {
      row.forEach(seat => {
        if (seatNumbers.includes(seat.number)) {
          if (seat.isReserved) {
            throw new Error("You can't reserve this seat, it is already reserved!");
          } else {
            seat.isReserved = true;
          }
        }
      });
    });

    const updatedMatch = await Match.findOneAndUpdate(
      matchId,
      { seats: match.seats },
      { new: true }
    );

    if (!updatedMatch) {
      throw new Error('Failed to update match!');
    }

    const price = updatedMatch.ticketPrice * seatNumbers.length;
    const ticket = await ticketModel.reserveTicket(matchId, seatNumbers, userName, price);

    return res.status(200).json({ ticket });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.getAllTickets(req.params.userName);
    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName } = req.body;
    const ticket = await ticketModel.findOne({ _id: id, userName });

    if (!ticket) {
      throw new Error("No ticket found to be deleted by this ID or this ticket doesn't belong to this user!");
    }

    const match = await Match.findById(ticket.matchId);
    const daysBeforeMatch = (match.dateTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    if (daysBeforeMatch < 3) {
      throw new Error('Cannot cancel a ticket of a match that is less than 3 days away!');
    }

    match.seats.forEach(row => {
      row.forEach(seat => {
        if (seat.number === ticket.seatNumber) {
          seat.isReserved = false;
        }
      });
    });

    await Match.findOneAndUpdate(ticket.matchId, { seats: match.seats }, { new: true });
    const deletedTicket = await ticketModel.deleteTicket(id);

    return res.status(200).json({ deletedCount: deletedTicket.deletedCount });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  reserveTicket,
  getAllTickets,
  deleteTicket
};
