import React from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { Redirect } from 'react-router';

class Ticket extends React.Component {
    constructor(props) {
        super(props)
        this.ticketValue = props.ticketValue;
    }

   editTicket = ()=>{
       console.log("yeah boi")
        document.location.href=`/editTicket:${this.ticketValue._id}`
    }

    deleteTicket = ()=>{
        console.log("delete ticket")
         return axios.delete('http://localhost:1234/ticket:id',{
            params:{ticketId: this.ticketValue._id},
            headers: {'Authorization': `${localStorage.getItem('jwt')}`}
          //   data :{ticketId: this.ticketValue._id} 
        }).then((res)=>{
            if(res.status === 200){
                document.location.href='/home';
            }
        });
    }

    render() {
        return (
            <tr>
                <td>{this.ticketValue.Title}</td>
                <td>{this.ticketValue.Description}</td>
                <td>{this.ticketValue.Status}</td>
                <td>{this.ticketValue.createdAt}</td>
                <td>
                    <button type="button" class="btn btn-primary mx-2">Assign</button>
                    <button type="button" class="btn btn-success mx-2" onClick={this.editTicket}>Edit</button>
                    <button type="button" class="btn btn-danger mx-2" onClick={this.deleteTicket}>Delete</button>
                </td>

            </tr>


            // <Card style={{ width: "100%", margin: "15px"}} border="secondary">
            //     <Card.Header>{</Card.Header>
            //     <Card.Body>{this.ticketValue.Description}</Card.Body>
            // </Card>
        );
    }
}

export default Ticket;