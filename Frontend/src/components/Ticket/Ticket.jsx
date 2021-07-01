import React from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { Redirect } from 'react-router';
import TicketButtons from './TicketButtons'

class Ticket extends React.Component {
    constructor(props) {
        super(props)
        this.ticketValue = props.ticketValue;
        this.user = props.User;
    }

    render() {
        var Status = (this.ticketValue.TicketInstances[0].Status == "Assigned" ? "Assigned to: " + this.ticketValue.TicketInstances[this.ticketValue.TicketInstances.length -1].AssignedTo.FirstName : this.ticketValue.TicketInstances[this.ticketValue.TicketInstances.length -1].Status)
        return (
            <tr>
                <td>{this.ticketValue.Creator.FirstName + " " + this.ticketValue.Creator.LastName}</td>
                <td>{this.ticketValue.Owner.FirstName + " " + this.ticketValue.Owner.LastName}</td>
                <td>{this.ticketValue.TicketInstances[this.ticketValue.TicketInstances.length -1].Title}</td>
                <td>{this.ticketValue.TicketInstances[this.ticketValue.TicketInstances.length -1].Description}</td>
                <td>{this.ticketValue.TicketInstances[this.ticketValue.TicketInstances.length -1].Status}</td>
                <td>{this.ticketValue.createdAt}</td>
                <TicketButtons User={this.user} UserRole={this.user.userRole} TicketValue={this.ticketValue}></TicketButtons>
            </tr>

        );
    }
}

export default Ticket;