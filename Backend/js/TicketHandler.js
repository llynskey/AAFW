const { static } = require("express");

class TicketHandler{

    static createTicket(CustomerId, Type, Description, Status){
        t = new Ticket(CustomerId, Type, Description ,Status);
        console.log(t);
    }

    
   // static changeStatus
}