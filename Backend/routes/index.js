var express = require('express');
var Router = express.Router();
var ticketModel = require('../models/Ticket');
var AuthenticateJWT = require('../Middleware');

//assign ticket to support user
Router.put('/assign', AuthenticateJWT, function(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "AssignedTo": req.body.id, "Status": "Assigned" }).populate('AssignedTo').exec(function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not assigned");
        }
        res.status(200).end();
    })
});
//reallocate a ticket to Open to be assigned to another support user
Router.put('/reassign', AuthenticateJWT, function(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "AssignedTo": undefined, "Status": "Open" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not assigned");
        }
        res.status(200).end();
    })
});
// suspend a ticket
Router.put('/suspend', AuthenticateJWT, function(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Suspended" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not suspended");
        }
        res.status(200).end();
    })
});
// Solve a ticket
Router.put('/solve', AuthenticateJWT, function(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Solved" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not solved");
        }
        res.status(200).end();
    });
});
//reopen ticket
Router.put('/reopen', AuthenticateJWT, function(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Assigned" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not reassigned");
        }
        res.status(200).end();
    });
});
//close ticket
Router.put('/close', AuthenticateJWT, function(req, res) {
    ticketModel.updateOne({ "_id": req.query.id }, { "Status": "Closed" }, function(err, result) {
        if (err) {
            console.log("error " + err);
        }
        if (!result) {
            console.log("ticket not reassigned");
        }
        res.status(200).end();
    });
});
//get all tickets
Router.get('/tickets', AuthenticateJWT, function(req, res) {
    if (req.user.userRole === "Support" || req.user.userRole === "Admin") {
        console.log(req.user.userRole)
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
});
// get a user's own tickets
Router.get('/ticket', AuthenticateJWT, function(req, res) {
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
                    console.log("tickets not found")
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
                    console.log("fuck" + tickets)
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
                    console.log(tickets)
                    res.status(200).json({
                        ticket: tickets
                    });
                }
            });
    }
});
//get a ticket by id
Router.get('/ticket:id', AuthenticateJWT, function(req, res) {
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
                console.log("sending ticket")
                res.status(200).json({
                    ticket: ticket
                })
            }
        })
    })
    //update a ticket
Router.put('/ticket:id', AuthenticateJWT, function(req, res) {
    ticketModel.updateOne({ "_id": req.query.ticketId }, req.body.ticket, (error, result) => {
        if (error) {
            res.status(500).json({ msg: "Error: could not find ticket" });
        } else if (!result) {
            res.status(500).json({ msg: "Error: Ticket could not be updated" });
        } else {
            res.status(200).json({ msg: "Ticket updated Successfully" });
        }
    })
});
//create a ticket
Router.post('/ticket', AuthenticateJWT, function(req, res) {
    console.log("trying to create ticket")
    const { userRole } = req.user;
    console.log("role assigned " + userRole)
    if (userRole == 'Client' || userRole == 'Support') {
        try {
            console.log("saving ticket")
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
        console.log("ticket saved")
    } else {
        res.status(403).json({
            msg: "Insufficient Privleges"
        });
    }
});
//delete a ticket
Router.delete('/ticket:id', AuthenticateJWT, function(req, res) {
    ticketModel.deleteOne({ "_id": req.query.ticketId }, (err, result) => {
        if (err) {
            res.status(500).json({ msg: "Error: Ticket could not be deleted" });
        }
        if (!result) {
            res.status(500).json({ msg: "Error: Ticket could not be found" });
        } else {
            res.status(200).json({ msg: "Ticket deleted Successfully" });
        }
    })
});




module.exports = Router;