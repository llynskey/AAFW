var express = require('express');
var Router = express.Router();
var userModel = require('../models/User');
var tokenModel = require('../models/Token')
var jwt = require('jsonwebtoken');

const privateKey = 'shhhhhh'

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

Router.post('/register', function(req, res) {
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

});

Router.post('/logout', AuthenticateJWT, function(req, res, next) {
    console.log("idddd "+req.user.userId);
    console.log("ting" + req.user);
    tokenModel.deleteMany({"UserId": req.user.userId }, (err, result) => {
        if (err) {
            console.log("err")
            res.status(500).end()
        }

        if (!result) {
            console.log("could not delete user");
        }
        console.log(result)
            //    console.log()
            // res.status(200).json({
            // msg:"User Logged out"
            //   });

        console.log("user logged out")

    })
})

module.exports = Router;