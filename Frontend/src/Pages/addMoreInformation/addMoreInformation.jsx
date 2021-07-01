import axios from 'axios';
import React from 'react';
import {useParams} from 'react-router';
import JWT from 'jsonwebtoken'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class AddMoreInformation extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
        ticket: {
            OwnerId: "",
            CreaterId: "",
            TicketInstances:[]
         }
        }

        this.ticketPost = this.addMoreInformation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.ticket = this.setTitle.bind(this);
        this.ticket = this.setDescription.bind(this);
    }
    
    async addMoreInformation() {
        const jwt = localStorage.getItem('jwt');
        const token = jwt.split(' ')[1];
        const user = JWT.decode(token);
        return await axios.put('http://localhost:1234/ticket/information:id', {
            ticket: this.state.ticket
        }, { params: {ticketId: this.state.ticket._id},headers: { 'Authorization': `${localStorage.getItem('jwt')}` } }).then((res) => {
            if (res.status === 200) {
                document.location.href = '/home';
            }
        });
    }

    async getTicketById(){
        let path = document.location.pathname
        var ticketId =path.split(':')[1];
        axios.get('http://localhost:1234/ticket/ticket:id',{
            params:{ticketId: ticketId},
            headers:{'Authorization': `${localStorage.getItem('jwt')}` }
        }).then((res) =>{
            if(res.status === 200)
            this.setState({"ticket": res.data.ticket})
            console.log(this.state.ticket);
        })
    }

    componentDidMount(){
        
        this.getTicketById()
    }

    async handleSubmit(e) {
        e.preventDefault();
        const ticketInfo = await this.addMoreInformation();
    }

    setTitle(Title) {
        var ticket = this.state.ticket;
        ticket.TicketInstances[ticket.TicketInstances.length -1].Title = Title; 
        this.setState({ "ticket": ticket });
        console.log(this.state.ticket)
    }

    setDescription(Description) {
        var ticket = this.state.ticket;
        ticket.TicketInstances[ticket.TicketInstances.length -1].Description = Description;
        this.setState({ "ticket": ticket });
        console.log(this.state.ticket)

    }

    render() {
        return (
            <div className="addMoreInformation">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group size="lg" controlId="Title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={this.state.ticket.Title}
                            onChange={(e) => this.setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.ticket.Description}
                            onChange={(e) => this.setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit"> Add More Information </Button>
                </Form>
            </div>
        )
    }
}

export default AddMoreInformation;