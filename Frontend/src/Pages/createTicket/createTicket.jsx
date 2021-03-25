import React, { useState } from "react";
import axios from "axios";
import JWT from 'jsonwebtoken';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormGroup from "react-bootstrap/esm/FormGroup";
import FormLabel from "react-bootstrap/esm/FormLabel";

class createTicket extends React.Component {
    constructor(props) {
        var jwt = localStorage.getItem('jwt');
        const token = jwt.split(' ')[1];
        var user = JWT.decode(token);
        super(props);
        this.state = {
            user: user,
            ownerId: user.userId,
            creatorId: user.userId,
            title: "",
            description: "",
        }

        this.ticketPost = this.ticketPost.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.ownerId = this.setOwnerId.bind(this);
        this.creatorId = this.setCreatorId.bind(this);
        this.title = this.setTitle.bind(this);
        this.description = this.setDescription.bind(this);
    }

    async ticketPost() {
        return axios.post("http://localhost:1234/ticket", {
            ownerId: this.state.ownerId,
            creatorId: this.state.creatorId,
            title: this.state.title,
            description: this.state.description
        }, { headers: { 'Authorization': `${localStorage.getItem('jwt')}` } }).then((res) => {
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

    setCreatorId(creatorId) {
        this.setState({ "creatorId": creatorId });
    }

    setOwnerId(ownerId) {
        this.setState({ "ownerId": ownerId });
    }

    setTitle(Title) {
        this.setState({ "title": Title });
    }

    setDescription(Description) {
        this.setState({ "description": Description });
    }

    render() {
        if (this.state.user.userRole == "Client") {
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
            );
        }
        if (this.state.user.userRole == "Support") {
            return (
                <div className="createTicket">
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup size="lg" controlId="OwnerId">
                            <FormLabel>Owner Id</FormLabel>
                            <Form.Control
                                autoFocus
                                type="text"
                                value={this.state.ownerId}
                                onChange={(e) => this.setOwnerId(e.target.value)}
                                required
                            />
                        </FormGroup>
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
            );
        }
    }
}

export default createTicket;