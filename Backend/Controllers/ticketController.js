var ticketModel = require('../models/Ticket');

function assignTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "AssignedTo": req.body.id, "Status": "Assigned" }).populate('AssignedTo').exec(function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not assigned");
        }
        res.status(200).end();
    })
}

function reopenTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Assigned" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not reassigned");
        }
        res.status(200).end();
    });
}

function suspendTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Suspended" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not suspended");
        }
        res.status(200).end();
    })
};

function solveTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Solved" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not solved");
        }
        res.status(200).end();
    });
}

function reassignTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "AssignedTo": undefined, "Status": "Open" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not assigned");
        }
        res.status(200).end();
    })
}

function closeTicket (req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Closed" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not reassigned");
        }
        res.status(200).end();
    });
}

function getAllTickets(req, res) {
    if (req.user.userRole === "Support" || req.user.userRole === "Admin") {
        var query = req.query.query;
        ticketModel.find({}).populate('Creator').populate('Owner').populate('AssignedTo').exec(function(err, tickets) {
            for (ticket of tickets) {
                ticket.Owner.Email = undefined;
                ticket.Owner.Username = undefined;
                ticket.Owner.Password = undefined;
                ticket.Creator.Email = undefined;
                ticket.Creator.Username = undefined;
                ticket.Creator.Password = undefined;
                if (ticket.AssignedTo) {
                    ticket.AssignedTo.Email = undefined;
                    ticket.AssignedTo.Username = undefined;
                    ticket.AssignedTo.Password = undefined;
                }
            }

            let results = []
            for (ticket of tickets) {
                if (ticket.Creator.FirstName.includes(query) ||
                    ticket.Creator.LastName.includes(query) ||
                    ticket.Owner.FirstName.includes(query) ||
                    ticket.Owner.LastName.includes(query) ||
                    ticket.Status.includes(query) ||
                    ticket.Title.includes(query) ||
                    ticket.Description.includes(query))
                    results.push(ticket)
            }
            res.status(200).json({ data: tickets })
        });
    } else {
        res.status(403).end();
    }
}

function getTicketsForUser(req, res) {
    const { userRole } = req.user;
    switch (userRole) {
        case "Client":
            ticketModel.find({ Owner: req.user.userId }).populate('Creator').populate('Owner').populate('AssignedTo').exec(function(err, tickets) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (tickets.length == 0) {
                    res.status(404).json({
                        msg: "Ticket Not Found"
                    });
                } else {
                    tickets.forEach(ticket => {
                        delete ticket.Owner.Email;
                        delete ticket.Owner.Username;
                        delete ticket.Owner.Password;
                        delete ticket.Creator.Email;
                        delete ticket.Creator.Username;
                        delete ticket.Creator.Password;
                    });
                    res.status(200).json({
                        tickets: tickets
                    })
                }
            });
            break;
        case "Support":
            ticketModel.find({ AssignedTo: req.user.userId }).populate('Creator').populate('Owner').populate('AssignedTo').exec(function(err, tickets) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (tickets.length == 0) {
                    res.status(404).json({
                        msg: "Ticket Not Found"
                    });
                } else {
                    tickets.forEach(ticket => {
                        delete ticket.Owner.Email;
                        delete ticket.Owner.Username;
                        delete ticket.Owner.Password;
                        delete ticket.Creator.Email;
                        delete ticket.Creator.Username;
                        delete ticket.Creator.Password;
                    });
                    res.status(200).json({
                        tickets: tickets
                    })
                }
            })
            break;
        case "Admin":
            ticketModel.find({ Owner: req.user.userId }).populate('Creator').populate('Owner').exec(function(err, tickets) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (tickets.length == 0) {
                    res.status(404).json({
                        msg: "Ticket Not Found"
                    });
                } else {
                    res.status(200).json({
                        ticket: tickets
                    });
                }
            });
    }
}

function getTicketById (req, res) {
    ticketModel.findOne({ "_id": req.query.ticketId }, (err, ticket) => {
        if (err) {
            console.log("Error getting ticket")
            res.status(500).json({
                msg: "Error could not get Ticket"
            });
        }
        if (!ticket) {
            console.log("no Ticket")
            res.status(500).json({
                msg: "Error could not find Ticket"
            });
        } else {
            res.status(200).json({
                ticket: ticket
            })
        }
    })
}

function updateTicketById(req, res) {
    ticketModel.updateOne({ "_id": req.query.ticketId }, req.body.ticket, (error, result) => {
        if (error) {
            res.status(500).json({ msg: "Error: could not find ticket" });
        } else if (!result) {
            res.status(500).json({ msg: "Error: Ticket could not be updated" });
        } else {
            res.status(200).json({ msg: "Ticket updated Successfully" });
        }
    })
}

function createTicket (req, res) {
    const { userRole } = req.user;
    if (userRole == 'Client' || userRole == 'Support') {
        try {
            var ticket = new ticketModel({
                Owner: req.body.ownerId,
                Creator: req.body.creatorId,
                Status: 'Open',
                Title: req.body.title,
                Description: req.body.description
            });
            ticket.save();
            res.status(200).json({
                msg: "Ticket created Successfully"
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    } else {
        res.status(403).json({
            msg: "Insufficient Privleges"
        });
    }
}

function deleteTicket(req,res) {
    ticketModel.deleteOne({ "_id": req.query.ticketId }, (err, result) => {
        if (err) {
            res.status(500).json({ msg: "Error: Ticket could not be deleted" });
        }
        if (!result) {
            res.status(500).json({ msg: "Error: Ticket could not be found" });
        } else {
            res.status(200).json({ msg: "Ticket deleted Successfully" });
        }
    });
}

exports.assignTicket = assignTicket;
exports.reassignTicket = reassignTicket;
exports.suspendTicket = suspendTicket;
exports.solveTicket = solveTicket;
exports.reopenTicket = reopenTicket;
exports.closeTicket = closeTicket;
exports.getAllTickets = getAllTickets;
exports.getTicketsForUser = getTicketsForUser;
exports.getTicketById = getTicketById;
exports.updateTicketById = updateTicketById;
exports.createTicket = createTicket;
exports.deleteTicket = deleteTicket;