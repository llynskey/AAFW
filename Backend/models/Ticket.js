const { Timestamp } = require('mongodb');
var mongoose = require('mongoose');

const Ticket = new mongoose.Schema({
    OwnerId:{
        type:String,
        required:true
    },

    CreatorId:{
        type:String,
        required:true
    },

    Status:{
        type: String,
        required: true
    },

    Title:{
        type: String,
        require: true
    },

    Description:{
        type: String,
        required: true
    }    
},
{ timestamps: true }
);

module.exports = mongoose.model('Tickets', Ticket);

