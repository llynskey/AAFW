const { Timestamp } = require('mongodb');
var {Schema, model} = require('mongoose');
var userModel = require('./User');

const Ticket = new Schema({
    Owner:{ 
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
        },

    Creator:{
        type: Schema.Types.ObjectId,
        ref: "users",
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

Ticket.index({'Owner.FirstName':'text', Creator:'text',Status:'text', Title: 'text', Description:'text' })

module.exports = model('Tickets', Ticket);

