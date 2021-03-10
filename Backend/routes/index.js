var express = require('express');
var Router = express.Router();
var userModel = require('../models/User');
var tokenModel = require('../models/Token')
var ticketModel = require('../models/Ticket');
var connection = require('../db/db_connection')
var jwt = require('jsonwebtoken');


const privateKey = 'shhhhhh';

function AuthenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log("no authH")
        return res.status(401).end();
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            console.log("no t v");
            return res.status(401).json({
                msg: "Token could not be verified"
            });
        }
        if (!decoded) {
            console.log("no user");
            res.status(401).end();
        }
        tokenModel.findOne({ "Token": token }, (err, userToken) => {
            if (err) {
                console.log(err + err)
                throw err;
            }
            if (!userToken) {
                console.log("no user token")
                return res.status(401).end();
            }
            if (userToken.UserRole != decoded.userRole || userToken.UserId != decoded.userId) {
                console.log("bad token")
                return res.status(401).end();
            }
             console.log("user verified")
            req.user = decoded;
            next();
        });
    });
}
//get all tickets
Router.get('/tickets', AuthenticateJWT, function(req, res) {

});

Router.get('/ticket:id', AuthenticateJWT, function(req, res,next) {
    console.log("working")
    console.log("id "+req.query.ticketId)
    ticketModel.findOne({ "_id": req.query.ticketId }, (err, ticket) => {
        console.log("shittttt")
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

// get a user's own ticket s
Router.get('/ticket', AuthenticateJWT, function(req, res) {
    const { userRole } = req.user;
    console.log(userRole);
    console.log(req.user.userId)
    if (userRole == "Client") {
        ticketModel.find({ OwnerId: req.user.userId }, (err, tickets) => {
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

    if (userRole == "Admin") {
        ticketModel.find({ OwnerId: req.user.userId }, (err, tickets) => {
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
    //other roles
});
//update a ticket
Router.put('/ticket:id', AuthenticateJWT, function(req, res) {
    ticketModel.updateOne({"_id": req.query.ticketId},req.body.ticket, (error, result) => {
            if (error) {
                res.status(500).json({ msg: "Error: could not find ticket" });
            }
            if (!result) {
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
    if (userRole == 'Admin') {
        try {
            console.log("saving ticket")
            var ticket = new ticketModel({
                OwnerId: req.body.ownerId,
                CreatorId: req.body.creatorId,
                Status: 'Open',
                Title: req.body.title,
                Description: req.body.description
            });
            ticket.save();
        } catch (err) {
            console.log(err);
            throw err;
        }
        console.log("ticket saved")
    }
    if (userRole != 'Admin') {
        res.status(403).json({
            msg: "Insufficient Privleges"
        });
    }
    res.status(200).json({
        msg: "Ticket created Successfully"
    });

});
//delete a ticket
Router.delete('/ticket:id', function(req, res, next) {
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