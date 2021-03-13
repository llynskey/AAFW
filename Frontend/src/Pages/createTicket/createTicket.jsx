import React, { useState } from "react";
import axios from "axios";
import JWT from 'jsonwebtoken';
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

        this.ticketPost = this.ticketPost.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.title = this.setTitle.bind(this);
        this.description = this.setDescription.bind(this);
    }

    async ticketPost() {

        var jwt = localStorage.getItem('jwt');
        const token = jwt.split(' ')[1];
        var user = JWT.decode(token);
        return axios.post("http://localhost:1234/ticket", {
            ownerId: user.userId,
            creatorId: user.userId,
            title: this.state.title,
            description: this.state.description
        },{headers:{'Authorization': `${localStorage.getItem('jwt')}`}}).then((res) => {
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
                            required
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="Password">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.description}
                            onChange={(e) => this.setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                   <Button block size="lg" type="submit"> Create Ticket </Button>
                </Form>
            </div>
        )
    }
}

export default createTicket;