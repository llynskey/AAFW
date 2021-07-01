const { Timestamp } = require('mongodb');
var { Schema, model } = require('mongoose');
var userModel = require('./User');

const Ticket = new Schema({
    Owner: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    Creator: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
   TicketInstances:[{
    
    AssignedTo: {
        type: Schema.Types.ObjectId,
        ref:"users",
        required: false
    },
    Status: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        require: true
    },
    Description: {
        type: String,
        required: true
    }
}]
}, { timestamps: true });

module.exports = model('Tickets', Ticket);