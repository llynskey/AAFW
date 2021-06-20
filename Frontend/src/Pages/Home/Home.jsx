import React from "react";
import Table from 'react-bootstrap/Table';
import Ticket from '../../components/Ticket/Ticket'
import axios from 'axios';
import JWT from 'jsonwebtoken';
import Search from '../../components/Search/Search';



class Home extends React.Component {
    constructor(props) {
        var jwt = localStorage.getItem('jwt');
        const token = jwt.split(' ')[1];
        var user = JWT.decode(token);
        super(props);
        this.state = {
            user: user,
            myTickets: [],
            allTickets: [],
            filteredTickets: []
        }
        this.setMyTickets = this.setMyTickets.bind(this);
        this.setAllTickets = this.setAllTickets.bind(this);
        this.setFilteredTickets = this.setFilteredTickets.bind(this);
    }

    componentDidMount() {
        switch (this.state.user.userRole) {
            case "Client":
                this.getUserTickets();
                break;
            case "Support":
                this.getUserTickets();
                this.getAllTickets();
                break;
            case "Admin":
                this.getAllTickets();
                break;
        }
    }

    setFilteredTickets(filteredTickets){
        this.setState({"filteredTickets": filteredTickets})
    }

    setMyTickets(myTickets) {
        this.setState({ "myTickets": myTickets });
    }

    setAllTickets(allTickets) {
        this.setState({ "allTickets": allTickets });
    }

    getUserTickets() {
        axios.get('http://localhost:1234/ticket', {
            headers: {
                'Authorization': `${localStorage.getItem('jwt')}`
            }
        }).then((res) => {
            this.setMyTickets(res.data.tickets);
        });
    }

    getAllTickets() {
        axios.get('http://localhost:1234/tickets', {
            params: {
                query: ""
            },
            headers: {
                'Authorization': `${localStorage.getItem('jwt')}`
            }
        }).then((res) => {
            this.setAllTickets(res.data.data);
            this.setFilteredTickets(res.data.data);
        });
    }

    render() {
        var title = `Hello ${this.state.user.username} and welcome to the UoK Ticket System`;
        var subtitle = `${this.state.user.userRole} Dashboard`;
        switch (this.state.user.userRole) {
            case "Support":
                return (<div className='Home'>
                        <div className="jumbotron">
                        <h1>{title}</h1>
                        <h2>{subtitle}</h2>
                    </div>
                    <div>
                        <Table className="mt-5">
                            <thead>
                                <tr><th>Creator Name</th>
                                    <th>Owner Name</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Time Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.myTickets.map((value) => {
                                    return <Ticket key={value["_id"]} ticketValue={value} User={this.state.user}></Ticket>
                                })}
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <Search setTickets={this.setFilteredTickets} tickets={this.state.allTickets} />
                        <Table className="mt-5">
                            <thead>
                                <tr><th>Creator Name</th>
                                    <th>Owner Name</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Time Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.filteredTickets.map((value) => {
                                    return <Ticket key={value["_id"]} ticketValue={value} User={this.state.user}></Ticket>
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
                );
            case "Admin":
                return (
                    <div className='Home'>
                        <div className="jumbotron">
                            <h1>{title}</h1>
                            <h2>{subtitle}</h2>
                        </div>
                        <Search setTickets={this.setAllTickets} tickets={this.state.allTickets}/>
                        <Table className="mt-5">
                            <thead>
                                <tr><th>Creator Name</th>
                                    <th>Owner Name</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Time Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.allTickets.map((value) => {
                                    return <Ticket key={value["_id"]} ticketValue={value} User={this.state.user}></Ticket>
                                })}
                            </tbody>
                        </Table>
                    </div>
                )
            case "Client":
                return(
                    <div className='Home'>
                        <div className="jumbotron">
                            <h1>{title}</h1>
                            <h2>{subtitle}</h2>
                        </div>
                        <Search setTickets={this.setMyTickets} tickets={this.state.myTickets}/>
                        <Table className="mt-5">
                            <thead>
                                <tr><th>Creator Name</th>
                                    <th>Owner Name</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Time Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.myTickets.map((value) => {
                                    return <Ticket key={value["_id"]} ticketValue={value} User={this.state.user}></Ticket>
                                })}
                            </tbody>
                        </Table>
                    </div>
                )
        }
    }
}
export default Home;