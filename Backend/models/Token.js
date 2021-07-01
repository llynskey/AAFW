const{Timestamp} = require('mongodb');
const {Schema, model} = require('mongoose');

const Token = new Schema({
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


module.exports = model('userTokens', Token);

