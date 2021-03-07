/*var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://admin:toor@pcoin.wmbie.mongodb.net/tickets?ssl=true&replicaSet=atlas-v0uitl-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri, function(err, client) {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});   
*/
var express = require('express');
const mongoose = require('mongoose');
const uri = "mmongodb+srv://admin:toor@uok-ticketing-system.seb4f.mongodb.net/Users?retryWrites=true&w=majority";

class Database {
    constructor() {
      console.log("bitch");
        this.connect();
    }
    connect() {

      console.log("poop")
        mongoose.connect(uri, { useNewUrlParser: true });

        const connection = mongoose.connection;

        connection.once('open', function() {
            console.log('Database connected Successfully');
        }).on('error', function(err) {
            console.log('Database Connection Error:', err);
        });
    }
}
/*
let mongoose = require('mongoose');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'fcc-Mail';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
*/
module.exports = new Database()























/*
client.connect(err => {
  const collection = client.db("pcoin").collection("Users");

  //client.db().createCollection("Tickets")

   /*   createTicket(CustomerId, Type, Description ,Status)
      {
        client.db.Tickets.insertOne({
          CustomerId:CustomerId,
          Type: Type,
          Description: Description,
          Status: Status
        })
      }

     // app.
  
});
*/