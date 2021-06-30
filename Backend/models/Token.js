const{Timestamp} = require('mongodb');
var mongoose = require('mongoose');

const Token = new mongoose.Schema({
    UserId:{
        type: String,
        required: true
    },
    UserRole:{
        type: String,
        required: true
    },
    Token:{
        type:String,
        required: true
    }
},
{timestamps: true});

Token.index( { "createdAt": 1 }, { expireAfterSeconds: 8600 } ) // Token Time to live set to 1 day in seconds


module.exports = mongoose.model('userTokens', Token);

