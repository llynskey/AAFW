var ticketModel = require('../models/Ticket');

function assignTicket(req, res) {
    /*ticketModel.find({"_id": req.query.id}).forEach(function(doc){
        var update = doc.TicketInstances[0];
        update.AssignedTo = req.body.id;
        update.Status = "Assigned"
        ticketModel.update(
            { "_id": req.query.id },
            { "$addToSet": { "TicketInstances": doc.TicketInstances[0] } },
            { "multi": true }
        )
    })*/
    var ticket = ticketModel.find({"_id":req.query.id}).exec(function(err,result) {
        if(err){
            console.log(err);
        }
        console.log(result)
        result[result.length - 1].TicketInstances[TicketInstances.length - 1].AssignedTo = req.body.id;
        result[result.length - 1].TicketInstances[TicketInstances.length - 1].Status = "Assigned";
        console.log(result)
    });
   

    ticketModel.updateOne({ "_id": req.query.id }, { $addToSet:{"TicketInstances": ticket.TicketInstances}}).populate('AssignedTo').exec(function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not assigned");
            res.status(500).json({ msg: "Could not assign ticket" }).end();
        } else {
            res.status(200).end();
        }
    });
}

function reopenTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Assigned" }, function(err, result) {
        if (err) {
            console.log("error " + err);
            res.status(500).json({ msg: "Error: " + err }).end();
        }
        if (!result) {
            console.log("ticket not reopened");
            res.status(500).json({ msg: "Could not reopen ticket" }).end();
        } else {
            res.status(200).end();
        }
    });
}

//function to suspend ticket 
function suspendTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Suspended" }, function(err, result) {
        if (err) {
            console.log("error " + err);
            res.status(500).json({ msg: "Error: " + err }).end();
        }
        if (!result) {
            console.log("ticket not suspended");
            res.status(500).json({ msg: "Could not suspend ticket" }).end();
        } else {
            res.status(200).end();
        }
    })
};

//function to mark ticket as solved
function solveTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Solved" }, function(err, result) {
        if (err) {
            console.log("error " + err);
            res.status(500).json({ msg: "Error: " + err }).end();
        }
        if (!result) {
            console.log("ticket not solved");
            res.status(500).json({ msg: "Could not suspend ticket" }).end();
        } else {
            res.status(200).end();
        }
    });
}

//function to allow ticket to be reassigned to another support user
function reassignTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "AssignedTo": undefined, "Status": "Open" }, function(err, result) {
        if (err) {
            console.log("error " + err);
            res.status(500).json({ msg: "Error: " + err }).end();
        }
        if (!result) {
            console.log("ticket not assigned");
            res.status(500).json({ msg: "Could not reassign ticket" }).end();
        } else {
            res.status(200).end();
        }
    })
}

//function to close ticket
function closeTicket(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "TicketInstances.$.Status": "Closed" }, function(err, result) {
        if (err) {
            console.log("error " + err);
            res.status(500).json({ msg: "Error: " + err }).end();
        }
        if (!result) {
            console.log("ticket not reassigned");
            res.status(500).json({ msg: "Could not close ticket" }).end();
        } else {
            res.status(200).end();
        }
    });
}

function getAllTickets(req, res) {
    if (req.user.userRole === "Support" || req.user.userRole === "Admin") {
        var query = req.query.query;
        ticketModel.find({}).populate('Creator').populate('Owner').populate('AssignedTo').exec(function(err, tickets) {
            if (!err) {
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
                res.status(200).json({ data: tickets }).end();
            } else {
                res.status(500).json({ msg: "Error: " + err }).end();
            }
        });
    } else {
        res.status(403).json({ msg: "Insufficient Privileges" }).end();
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
                if (tickets.length < 1) {
                    res.status(404).json({msg: "Ticket Not Found"}).end();
                } else {
                    tickets.forEach(ticket => {
                        delete ticket.Owner.Email;
                        delete ticket.Owner.Username;
                        delete ticket.Owner.Password;
                        delete ticket.Creator.Email;
                        delete ticket.Creator.Username;
                        delete ticket.Creator.Password;
                    });
                    res.status(200).json({tickets: tickets}).end();
                }
            });
            break;
        case "Support":
            ticketModel.find({ AssignedTo: req.user.userId }).populate('Creator').populate('Owner').populate('AssignedTo').exec(function(err, tickets) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (tickets.length < 1) {
                    res.status(404).json({ msg: "Ticket Not Found"}).end();
                } else {
                    tickets.forEach(ticket => {
                        delete ticket.Owner.Email;
                        delete ticket.Owner.Username;
                        delete ticket.Owner.Password;
                        delete ticket.Creator.Email;
                        delete ticket.Creator.Username;
                        delete ticket.Creator.Password;
                    });
                    res.status(200).json({ tickets: tickets }).end();
                }
            });
            break;
        case "Admin":
            ticketModel.find({ Owner: req.user.userId }).populate('Creator').populate('Owner').exec(function(err, tickets) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (tickets.length < 1) {
                    res.status(404).json({
                        msg: "Ticket Not Found"
                    }).end();
                } else {
                    res.status(200).json({
                        ticket: tickets
                    }).end();
                }
            });
    }
}

function getTicketById(req, res) {
    ticketModel.findOne({ "_id": req.query.ticketId }, (err, ticket) => {
        if (err) {
            console.log("Error getting ticket")
            res.status(500).json({
                msg: "Error could not get Ticket"
            }).end();
        }
        if (!ticket) {
            console.log("no Ticket")
            res.status(500).json({
                msg: "Error could not find Ticket"
            }).end();
        } else {
            res.status(200).json({
                ticket: ticket
            }).end();
        }
    })
}

function updateTicketById(req, res) {
    ticketModel.updateOne({ "_id": req.query.ticketId }, req.body.ticket, (error, result) => {
        if (error) {
            res.status(500).json({ msg: "Error: could not find ticket" }).end();
        } else if (!result) {
            res.status(500).json({ msg: "Error: Ticket could not be updated" }).end();
        } else {
            res.status(200).json({ msg: "Ticket updated Successfully" }).end();
        }
    })
}

function createTicket(req, res) {
    const { userRole } = req.user;
    if (userRole == 'Client' || userRole == 'Support') {
        try {
            var ticket = new ticketModel({
                Owner: req.body.ownerId,
                Creator: req.body.creatorId,
               TicketInstances:[{ 
                AssignedTo: null,
                Status: 'Open',
                Title: req.body.title,
                Description: req.body.description
               }]
            });
            console.log(ticket)
            ticket.save();
            res.status(200).json({
                msg: "Ticket created Successfully"
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({msg: "Error: " + err}).end();
        }
    } else {
        res.status(403).json({
            msg: "Insufficient Privleges"
        });
    }
}

function deleteTicket(req, res) {
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