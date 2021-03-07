import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


class createTicket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ownerId: "",
            createrId: "",
            title: "",
            description: "",
        }
        var jwt = { token: localStorage.getItem('jwt') }
        axios.post('http://localhost:1234/user/', jwt).then ((res) => {
           this.setState({"ownerId": res.data.user.userId}); 
           this.setState({"creatorId": res.data.user.userId});
       });

        this.ticketPost = this.ticketPost.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      //  this.setOwnerId = this.setOwnerId.bind(this);
       // this.createrId = this.setCreaterId.bind(this);
        this.title = this.setTitle.bind(this);
        this.description = this.setDescription.bind(this);

        
      //  this.setState({ "ownerId": 420 });
        //this.setState({ "creatorId": 420 });
    }

    async ticketPost() {
        return axios.post("http://localhost:1234/ticket", {
            ownerId: 420,
            creatorId: 420,
            title: this.state.title,
            description: this.state.description
        },{headers:{'Authorization': `Bearer ${localStorage.getItem('jwt')}`}}).then((res) => {
            console.log("here")
            if (res.status === 200) {
                document.location.href = '/home';
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const ticketInfo = await this.ticketPost();
    }

    /*setOwnerId(User) {
        this.setState({ "ownerId": 420 });
    }

    setCreaterId(User) {
        this.setState({ "creatorId": 420 });
    }*/

    setTitle(Title) {
        this.setState({ "title": Title });
    }

    setDescription(Description) {
        this.setState({ "description": Description });
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
                            value={this.state.title}
                            onChange={(e) => this.setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="Password">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.description}
                            onChange={(e) => this.setDescription(e.target.value)}
                        />
                    </Form.Group>
                   <Button block size="lg" type="submit">
                        Create Ticket
                </Button>
                </Form>
            </div>
        )
    }
}

export default createTicket;