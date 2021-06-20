var express = require('express');
var Router = express.Router();
var userModel = require('../models/User');
var tokenModel = require('../models/Token')
var jwt = require('jsonwebtoken');
var AuthenticateJWT = require('../Middleware');
var Login = require('../Services/userService');

const privateKey = 'shhhhhhh';

Router.get('/', AuthenticateJWT, function(req, res, next) {
    //token has been authenticated
    console.log("yay")
    console.log(req.body.Page) 
    res.status(200).end();
});

Router.post('/login', (req, res, next) => {
    const { Username, Password } = req.body;
    Login(Username,Password);
});

Router.post('/register', AuthenticateJWT, function(req, res) {
    if (req.user.userRole == "Admin") {
        try {
            var user = new userModel({
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Email: req.body.Email,
                Username: req.body.Username,
                Password: req.body.Password,
                Type: req.body.Type
            });
            user.save();
        } catch (err) {
            console.log("error" + err);
            throw err;
        }
        console.log(user);
        console.log("new user added to the database")
        res.status(200).json({
            msg: "new user added to the database"
        });
    } else {
        res.status(401).json({
            msg: "Insufficient Priviledges"
        })
    }

});

Router.post('/logout', AuthenticateJWT, function(req, res, next) {
    console.log("idddd " + req.user.userId);
    console.log("ting" + req.user);
    tokenModel.deleteMany({ "UserId": req.user.userId }, (err, result) => {
        if (err) {
            console.log("err")
            res.status(500).end()
        }

        if (!result) {
            console.log("could not delete user");
        }
        console.log(result)

        res.status(200).json({
            msg: "User Logged out"
        });

        console.log("user logged out")

    })
})

module.exports = Router;