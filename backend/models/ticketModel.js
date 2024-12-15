const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  seatNumbers: { type: [String], required: true },
  userName: { type: String, required: true },
  price: { type: Number, required: true }
});

ticketSchema.statics.reserveTicket = async function(matchId, seatNumbers, userName, price) {
  if (!matchId || !seatNumbers || !userName || !price) {
    throw new Error('All fields are required!');
  }

  const ticket = await this.create({ matchId, seatNumbers, userName, price });
  return ticket;
};

ticketSchema.statics.getAllTickets = async function(userName) {
  const tickets = await this.find({ userName });
  if (!tickets) {
    throw new Error('No tickets found for this user!');
  }

  return tickets;
};

ticketSchema.statics.deleteTicket = async function(_id) {
  const result = await this.deleteOne({ _id });
  if (!result) {
    throw new Error('No ticket found to be deleted!');
  }

  return result;
};

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
