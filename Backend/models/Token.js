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
{timestamps: true}
);

module.exports = mongoose.model('userTokens', Token);

