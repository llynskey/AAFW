import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Ticket from '../../components/Ticket/Ticket'
import axios from 'axios';
import JWT from 'jsonwebtoken';
import Search from '../../components/Search/Search';

const Home = (props) => {
    var jwt = localStorage.getItem('jwt');
    const token = jwt.split(' ')[1];
    var user = JWT.decode(token);

   const [myTickets,setMyTickets] = useState([])
   const [allTickets, setAllTickets] = useState([]);


    useEffect(() => {
        switch (user.userRole) {
            case "Client":
                getUserTickets();
                break;
            case "Support":
                getAllTickets();
                getUserTickets();
                
                break;

            case "Admin":
                getAllTickets();
                break;
        }
    },[])

    function setTickets(props){
        console.log(props)
        setAllTickets(props);
    }

    function getUserTickets() {
        axios.get('http://localhost:1234/ticket', {
            headers: {
                'Authorization': `${localStorage.getItem('jwt')}`
            }
        }).then((res) => {
            setMyTickets(res.data.tickets)
        });
    }

    function getAllTickets() {
        console.log("get All tickets")
        axios.get('http://localhost:1234/tickets', {
            params: {
                query: ""
            },
            headers: {
                'Authorization': `${localStorage.getItem('jwt')}`
            }
        }).then((res) => {
            setAllTickets(res.data.data);
            console.log(allTickets);
        });
    }


    function clientButtons(props) {
        return <button>Open Ticket</button>;
    }

    function supportButtons(props) {
        return <button>Open Ticket on behalf</button>;
    }

    function adminButtons(props) {
        return <button>Show All Tickets</button>;
    }

        var title = `Hello ${user.username} and welcome to the UoK Ticket System`;
        var subtitle = `${user.userRole} Dashboard`;
        switch (user.userRole) {
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
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTickets.map((value) => {
                                    return <Ticket key={value["_id"]} ticketValue={value} User={user}></Ticket>
                                })}
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <Search setAllTickets={setTickets} allTickets={allTickets} />
                        <Table className="mt-5">
                            <thead>
                                <tr><th>Creator Name</th>
                                    <th>Owner Name</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTickets.map((value) => {
                                    return <Ticket key={value["_id"]} ticketValue={value} User={user}></Ticket>
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
                        <Table className="mt-5">
                            <thead>
                                <tr><th>Creator Name</th>
                                    <th>Owner Name</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTickets.map((value) => {
                                    return <Ticket key={value["_id"]} ticketValue={value} User={user}></Ticket>
                                })}
                            </tbody>
                        </Table>
                    </div>
                );
            case "Client":
                return (
                    <div className='Home'>
                        <div className="jumbotron">
                            <h1>{title}</h1>
                            <h2>{subtitle}</h2>
                        </div>
                        <Table className="mt-5">
                            <thead>
                                <tr><th>Creator Name</th>
                                    <th>Owner Name</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTickets.map((value) => {
                                    return <Ticket key={value["_id"]} ticketValue={value} User={user}></Ticket>
                                })}
                            </tbody>
                        </Table>
                    </div>
                );
        }
}
export default Home;