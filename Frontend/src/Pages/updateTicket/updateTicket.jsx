import axios from 'axios';
import React from 'react';
import {useParams} from 'react-router';
import JWT from 'jsonwebtoken'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class UpdateTicket extends React.Component {

    constructor(props) {

      //  console.log(id);
        super(props);
        this.state = {
         ticket: {
            OwnerId: "",
            CreaterId: "",
            Title: "",
            Description: "",
         }
        }

        this.ticketPost = this.ticketPut.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.ticket = this.setTitle.bind(this);
        this.ticket = this.setDescription.bind(this);
    }
    
    async ticketPut() {

       var jwt = localStorage.getItem('jwt');
        const token = jwt.split(' ')[1];
        var user = JWT.decode(token);
        return await axios.put('http://localhost:1234/ticket:id', {
            ticket: this.state.ticket
        }, { params: {ticketId: this.state.ticket._id},headers: { 'Authorization': `${localStorage.getItem('jwt')}` } }).then((res) => {
            console.log("here")
            if (res.status === 200) {
                document.location.href = '/home';
            }
        });
    }

    componentDidMount(){
        let path = document.location.pathname
        var ticketId =path.split(':')[1];
        axios.get('http://localhost:1234/ticket:id',{
            params:{ticketId: ticketId},
            headers:{'Authorization': `${localStorage.getItem('jwt')}` }
        }).then((res) =>{
            if(res.status === 200)
            this.setState({"ticket": res.data.ticket})
            console.log(this.state)
            console.log(this.state.ticket)
        })
    }

    async handleSubmit(e) {
        e.preventDefault();
        const ticketInfo = await this.ticketPut();
       console.log(this.state);
    }

   /* setCreatorId(){

    }*/

    setTitle(Title) {
        var ticket = this.state.ticket;
        ticket.Title = Title; 
        this.setState({ "ticket": ticket });
    }

    setDescription(Description) {
        var ticket = this.state.ticket;
        ticket.Description = Description;
        this.setState({ "ticket": ticket });
    }

    render() {
        return (
            <div className="createTicket">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group size="lg" controlId="Username">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={this.state.ticket.Title}
                            onChange={(e) => this.setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="Password">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.ticket.Description}
                            onChange={(e) => this.setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit"> Edit Ticket </Button>
                </Form>
            </div>
        )
    }
}

export default UpdateTicket;