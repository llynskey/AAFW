import React, { useState, useEffect } from 'react'
import axios from 'axios';

const ActionTicket = (props) => {
    const [ticket, setTicket] = useState({})

    useEffect(() => {
        getTicket();
    }, []);

    function getTicket() {
        let path = document.location.pathname
        var ticketId = path.split(':')[1];
        return axios.get('http://localhost:1234/ticket:id', {
            params: { ticketId: ticketId },
            headers: { 'Authorization': `${localStorage.getItem('jwt')}` }
        }).then((res) => {
            if (res.status === 200)
                setTicket(res.data.ticket)
        });
    }

    function solveTicket() {
        return axios.put('http://localhost:1234/solve', {}
            , {
                headers: { 'Authorization': `${localStorage.getItem('jwt')}` }
                , params: { id: ticket._id }
            }).then((res) => {
                getTicket();
            });
    }

    function suspendTicket() {
        return axios.put('http://localhost:1234/suspend', {}
            , {
                headers: { 'Authorization': `${localStorage.getItem('jwt')}` }
                , params: { id: ticket._id }
            }).then((res) => {
                getTicket();
            });
    }

    function ReallocateTicket() {
        return axios.put('http://localhost:1234/reassign', {}
            , {
                headers: { 'Authorization': `${localStorage.getItem('jwt')}` }
                , params: { id: ticket._id }
            }).then((res) => {
                if (res.status === 200) {
                    document.location.href = '/home';
                }
            });
    }

    function deleteTicket() {
        console.log("delete ticket")
        return axios.delete('http://localhost:1234/ticket:id', {
            params: { ticketId: ticket._id },
            headers: { 'Authorization': `${localStorage.getItem('jwt')}` }
        }).then((res) => {
            if (res.status === 200) {
                document.location.href = '/home';
            }
        });
    }

    function Buttons() {
        switch (ticket.Status) {
            case "Assigned":
                return (
                    <div>
                        <button type="button" class="btn btn-primary mx-2" onClick={solveTicket}>Solve Ticket</button>
                        <button type="button" class="btn btn-primary mx-2" onClick={suspendTicket}>Suspend Ticket</button>
                        <button type="button" class="btn btn-primary mx-2" onClick={ReallocateTicket}>Reallocate Ticket</button>
                        <button type="button" class="btn btn-danger mx-2" onClick={deleteTicket}>Cancel Ticket by Support</button>
                    </div>
                );
                break;
            case "Suspended":
                return (
                    <div>
                        <button type="button" class="btn btn-danger mx-2" onClick={deleteTicket}>Close abandoned ticket</button>
                    </div>
                );
            case "Closed":

                break;
        }
    }

    const Ticket = ticket;
    return (
        <div>
            <h2>{Ticket.Title}</h2>
            <p>{Ticket.Description}</p>
            <p>{Ticket.Status}</p>
            <p>{Ticket.createdAt}</p>
            <p>{Ticket.updatedAt}</p><br></br>
            {Buttons()}
        </div>
    );
}


export default ActionTicket;