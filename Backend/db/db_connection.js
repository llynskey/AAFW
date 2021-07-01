const mongoose = require('mongoose');
const uri = "mmongodb+srv://admin:toor@uok-ticketing-system.seb4f.mongodb.net/AFW?retryWrites=true&w=majority";

class Database {
    constructor() {
        this.connect();
    }
    connect() {
        mongoose.connect(uri, { useNewUrlParser: true });

        const connection = mongoose.connection;

        connection.once('open', function() {
            console.log('Database connected Successfully');
        }).on('error', function(err) {
            console.log('Database Connection Error:', err);
        });
    }
}
module.exports = new Database();























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