const { broadcast } = require('../broadcast');
const Match = require('../models/matchModel');
const ticketModel = require('../models/ticketModel');

const reserveTicket = async (req, res) => {
  try {
    const { matchId, seatNumbers } = req.body;
    const { userName } = req.user;
    const match = await Match.findById(matchId);

    if (!match) {
      throw new Error('No match found to be updated!');
    }

    // Check if all seats are available
    for (const seatNumber of seatNumbers) {
      let seatFound = false;
      for (const row of match.seats) {
        for (const seat of row) {
          if (seat.number === seatNumber) {
            seatFound = true;
            if (seat.isReserved) {
              throw new Error(`Seat ${seatNumber} is already reserved!`);
            }
          }
        }
      }
      if (!seatFound) {
        throw new Error(`Seat ${seatNumber} not found!`);
      }
    }

    // Reserve the seats
    for (const seatNumber of seatNumbers) {
      for (const row of match.seats) {
        for (const seat of row) {
          if (seat.number === seatNumber) {
            seat.isReserved = true;
          }
        }
      }
    }

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { seats: match.seats },
      { new: true }
    );

    if (!updatedMatch) {
      throw new Error('Failed to update match!');
    }

    const price = updatedMatch.ticketPrice * seatNumbers.length;
    const ticket = await ticketModel.reserveTicket(matchId, seatNumbers, userName, price);

    // Broadcast the updated seats to all connected clients
    broadcast({ type: 'seatUpdate', matchId, seats: match.seats });

    return res.status(200).json({ ticket });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.getAllTickets(req.user.userName);
    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName } = req.user;
    const ticket = await ticketModel.findOne({ _id: id, userName });

    if (!ticket) {
      throw new Error("No ticket found to be deleted by this ID or this ticket doesn't belong to this user!");
    }

    const match = await Match.findById(ticket.matchId);
    const daysBeforeMatch = (match.dateTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    if (daysBeforeMatch < 3) {
      throw new Error('Cannot cancel a ticket of a match that is less than 3 days away!');
    }

    // Unreserve the seats
    for (const seatNumber of ticket.seatNumbers) {
      for (const row of match.seats) {
        for (const seat of row) {
          if (seat.number === seatNumber) {
            seat.isReserved = false;
          }
        }
      }
    }

    await Match.findByIdAndUpdate(ticket.matchId, { seats: match.seats }, { new: true });
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
}