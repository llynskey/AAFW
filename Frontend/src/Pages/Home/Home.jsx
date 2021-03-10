import React, { useState } from "react";
import jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Ticket from '../../components/Ticket/Ticket'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import axios from 'axios';
import JWT from 'jsonwebtoken';
//import './Home.css'



class Home extends React.Component {
    constructor(props) {
        var jwt = localStorage.getItem('jwt');
        const token = jwt.split(' ')[1];
        var user = JWT.decode(token);
        super(props);
        this.state = {
            username: user.username,
            accountType: user.userRole,
            tickets: [],
        }
    }



    componentDidMount() {
        console.log("getting cards")
        axios.get('http://localhost:1234/ticket', {
            headers: {
                'Authorization': `${localStorage.getItem('jwt')}`
            }
        }).then((res) => {
            console.log(res.data.ticket[0]);
            console.log("ticket " + res.data.ticket[0].Title);
            this.setState({ tickets: res.data.ticket });

        });
    }

    setCards(tickets) {
        this.setState({ "tickets": tickets })
        console.log("tickets loaded")
    }


    clientButtons(props) {
        return <button>Open Ticket</button>;
    }

    supportButtons(props) {
        return <button>Open Ticket on behalf</button>;
    }

    adminButtons(props) {
        return <button>Show All Tickets</button>;
    }

    render() {
        var title = `Hello ${this.state.username} and welcome to the UoK Ticket System`;
        var subtitle = `${this.state.accountType} Dashboard`
        const ticketArray = this.state.tickets;
        const tickets = [];

        for (const [index, value] of ticketArray.entries()) {
            tickets.push(
                <Ticket key={index} ticketValue={value}></Ticket>
            );
        }
        return (
            <div className='Home'>
                <div className="jumbotron">
                    <h1>{title}</h1>
                    <h2>{subtitle}</h2>
                </div>
                <div class="input-group mt-5">
                    <div class="form-outline">
                        <input type="search" id="form1" class="form-control" />
                        <label class="form-label" for="form1">Search</label>
                    </div>
                    <button type="button" class="btn btn-primary">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <Table className="mt-5">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Time Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets}
                    </tbody>
                </Table>
            </div>
        )
    }
}
export default Home;