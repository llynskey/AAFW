var express = require('express');
var Router = express.Router();
var userModel = require('../models/User');
var tokenModel = require('../models/Token')
var jwt = require('jsonwebtoken');
var AuthenticateJWT = require('../Middleware');

const privateKey = 'shhhhhhh';

Router.post('/', AuthenticateJWT, function(req, res, next) {
    //token has been authenticated
    console.log("yay")
    res.status(200).end();
});

Router.post('/login', (req, res, next) => {
    const { Username, Password } = req.body;
    if (Username.length <= 20 && Username.length > 1) {
        try {
            userModel.findOne({ Username }, (err, user) => {
                console.log(Username)
                if (err)
                    console.log("error");
                if (!user) {
                    res.status(401).json({
                        msg: "User Not Found"
                    });
                } else {
                    if (!user.comparePassword(Password)) {
                        res.status(401).json({
                            msg: "Incorrect Password"
                        });
                    } else {
                        console.log("user found");

                        jwt.sign({ userId: user._id, username: user.Username, userRole: user.Type }, privateKey, { expiresIn: '1d' }, (err, token) => {
                            console.log(token)
                            if (err)
                                console.log("error" + err)
                            try {
                                var t = new tokenModel({
                                    UserId: user._id,
                                    Username: user.username,
                                    UserRole: user.Type,
                                    Token: token
                                });
                                t.save();
                            } catch (err) {
                                console.log("token error");
                            }
                            console.log("user logged in")
                            res.json({
                                token: 'Bearer ' + token
                            });
                        });

                    }
                }
            });




        } catch (error) {
            res.status(500).json({
                msg: "Error: Database Connection error"
            });
        }

    } else {
        res.status(400).json({
            msg: "Error: Bad Input"
        });
    }


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