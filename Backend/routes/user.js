var express = require('express');
var Router = express.Router();
var AuthenticateJWT = require('../Middleware');
var userController = require('../Controllers/userController');

Router.get('/verify', AuthenticateJWT, userController.verifyToken);

Router.get('/supportUsers',AuthenticateJWT, userController.getSupportUsers);

Router.post('/login', userController.login);

Router.post('/register', AuthenticateJWT, userController.register);

Router.post('/logout', AuthenticateJWT, userController.logout);

module.exports = Router;