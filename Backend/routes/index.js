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
           // console.log("user token cunt" + userToken)
           req.user = decoded;
            next();
        });
    });
}

Router.get('/ticket', AuthenticateJWT,function(req, res, next) {
    console.log("getting ticket")
   
   // res.status(200).end();
  //  console.log(req.user.)
     const { userRole } = req.user;
    console.log(userRole);
    if (userRole == "Admin") {
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
                console.log(ticket)
                res.status(200).json({
                    ticket: ticket
                })
            }
        });
    }
    //other roles
});


Router.get('/', function(req, res, next) {
    if (req.session.loggedIn == true) {
        res.status(200).json({
            username: req.session.user.Username
        })
    }
})

//return all tickets
Router.get('/tickets', AuthenticateJWT, function(req, res, next) {
    const { role } = req.user;

    console.log("whoop");
    if (role !== 'Admin') {
        res.status(403).json({
            msg: "Insufficient Privleges"
        });
    }

    res.status(200);
});

/*Router.put('/ticket', function(req, res, next) {

});*/

//create a ticket
Router.post('/ticket', AuthenticateJWT, function(req, res, next) {
   console.log("trying to create ticket")
    const { userRole } = req.user;
    console.log("role assigned " + userRole)
    if(userRole == 'Admin'){
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
            console.log("dumb fuck")
            res.status(403).json({
                msg: "Insufficient Privleges"
            });
        res.status(200).json({
            msg: "Ticket created Successfully"
        });
    }
});

Router.delete('/ticket', function(req, res, next) {

});




module.exports = Router;