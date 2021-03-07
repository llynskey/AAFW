var express = require('express');
var Router = express.Router();
var ticketModel = require('../models/Ticket');
var connection = require('../db/db_connection');
var jwt = require('jsonwebtoken');

const privateKey = 'shhhhhh';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.body.token;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, privateKey, (err, user) => {
            if (err) {
                console.log(err)
                return res.sendStatus(403);
            }
            tokenModel.findOne({ "Token": req.body.token }, (err, userToken) => {
                if (err) {
                    throw err;
                }
                if (!userToken) {
                    res.status(401).json({
                        msg: "Invalid Token"
                    })
                }

                next();
            });
        });

    } else {
        res.sendStatus(401);
    }
};


Router.get('/', function(req, res, next) {
    if (req.session.loggedIn == true) {
        res.status(200).json({
            username: req.session.user.Username
        })
    }
})

//return all tickets
Router.get('/tickets', authenticateJWT, function(req, res, next) {
    const { role } = req.user;

    console.log("whoop");
    if (role !== 'Admin') {
        res.status(403).json({
            msg: "Insufficient Privleges"
        });
    }

    res.status(200);
});

Router.get('/ticket', authenticateJWT, function(req, res, next) {
    const { role } = req.user;

    if (role == "client") {
        ticketModel.find({ OwnerId: req.user.userId }, (err, ticket) => {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!ticket) {
                res.status(404).json({
                    msg: "Ticket Not Found"
                });
            } else {
                console.log("TICKETS!!!")
                res.status(200).json({
                    ticket
                })
            }
        });
    }


    //other roles
});

Router.put('/ticket', function(req, res, next) {

});

//create a ticket
Router.post('/ticket', authenticateJWT, function(req, res, next) {
    const { role } = req.user;

    if (role != 'Admin' || role != 'Client') {
        res.status(403).json({
            msg: "Insufficient Privleges"
        });
    } else {
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
        res.status(200).json({
            msg: "Ticket created Successfully"
        });
    }
});

Router.delete('/ticket', function(req, res, next) {

});




module.exports = Router;