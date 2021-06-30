var express = require('express');
var Router = express.Router();
var AuthenticateJWT = require('../Middleware');
var ticketController = require('../Controllers/ticketController');

//assign ticket to support user
Router.put('/assign', AuthenticateJWT, ticketController.assignTicket);
//reallocate a ticket to Open to be assigned to another support user
Router.put('/reassign', AuthenticateJWT, ticketController.reassignTicket);
// suspend a ticket
Router.put('/suspend', AuthenticateJWT, ticketController.suspendTicket);
// Solve a ticket
Router.put('/solve', AuthenticateJWT, ticketController.solveTicket);
//reopen ticket
Router.put('/reopen', AuthenticateJWT, ticketController.reopenTicket);
//close ticket
Router.put('/close', AuthenticateJWT, ticketController.closeTicket);
//get all tickets
Router.get('/tickets', AuthenticateJWT, ticketController.getAllTickets);
// get a user's own tickets
Router.get('/ticket', AuthenticateJWT, ticketController.getTicketsForUser);
//get a ticket by id
Router.get('/ticket:id', AuthenticateJWT, ticketController.getTicketById);
//update a ticket
Router.put('/ticket:id', AuthenticateJWT, ticketController.updateTicketById);
//create a ticket
Router.post('/ticket', AuthenticateJWT, ticketController.createTicket);
//delete a ticket
Router.delete('/ticket:id', AuthenticateJWT, ticketController.deleteTicket);

module.exports = Router;