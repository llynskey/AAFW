import React from 'react';
import axios from 'axios';
import AssignTicket from '../assignTicket/assignTicket';

const TicketButtons = (props) => {

    const UserID = props.User.userId;
    const UserRole = props.UserRole;
    const TicketValue = props.TicketValue;
    const TicketStatus = props.TicketValue.Status;

    async function chat() {
        document.location.href = `/chat:${TicketValue._id}`;
    }

    async function editTicket() {
        document.location.href = `/editTicket:${TicketValue._id}`;
    }

    async function actionTicket() {
        document.location.href = `/actionTicket:${TicketValue._id}`;
    }

    async function reopenTicket() {
        axios.put('http://localhost:1234/ticket/reopen', {}
            , {
                headers: { 'Authorization': `${localStorage.getItem('jwt')}` }
                , params: { id: TicketValue._id }
            }).then((res) => {
                document.location.href = '/home';
            }).catch((err) => {
                console.log(err);
            });
    }

    async function closeTicket() {
        return axios.put('http://localhost:1234/ticket/close', {}
            , {
                headers: { 'Authorization': `${localStorage.getItem('jwt')}` }
                , params: { id: TicketValue._id }
            }).then((res) => {
                document.location.href = '/home';
            }).catch((err) => {
                console.log(err);
            });
    }

    async function AssignToSelf() {
        axios.put(`http://localhost:1234/ticket/assign?id=${TicketValue._id}`, {
            id: UserID
        }, { headers: { 'Authorization': `${localStorage.getItem('jwt')}` } }).then((res) => {
            if (res.status == 200) {
                document.location.href = '/home';
            }
        });
    }

    async function deleteTicket() {
        return axios.delete('http://localhost:1234/ticket/ticket:id', {
            params: { ticketId: TicketValue._id },
            headers: { 'Authorization': `${localStorage.getItem('jwt')}` }
        }).then((res) => {
            if (res.status === 200) {
                document.location.href = '/home';
            }
        });
    }

    switch (UserRole) {
        case "Admin":
            switch (TicketStatus) {
                case "Open":
                    return (
                        <td>
                            <AssignTicket ticketId={TicketValue._id}/>
                        </td>
                    );
                case "Assigned":
                    return (
                        <td>

                        </td>
                    );
                case "Suspended":
                    return (
                        <td>

                        </td>
                    );
                case "Solved":
                    return (
                        <td>
                            <button type="button" class="btn btn-danger mx-2" onClick={deleteTicket}>Cancel expired ticket</button>
                        </td>
                    );
                default:
                    return (
                        <td>

                        </td>
                    )
            }
            break;
        case "Support":
            switch (TicketStatus) {
                case "Open":
                    return (
                        <td>
                            <button type="button" class="btn btn-primary mx-2" onClick={AssignToSelf}>Assign To Self</button>
                        </td>
                    );
                case "Assigned":
                    return (
                        <td>
                            <button type="button" class="btn btn-primary mx-2" onClick={actionTicket}>Check Ticket</button>
                        </td>
                    );
                case "Suspended":
                    return (
                        <td>
                            <button type="button" class="btn btn-success mx-2" onClick={actionTicket}>View Full Ticket</button>
                            <button type="button" class="btn btn-danger mx-2" onClick={deleteTicket}>Cancel abandoned ticket</button>
                        </td>
                    );
                case "Solved":
                    return (
                        <td>
                            <button type="button" class="btn btn-danger mx-2" onClick={deleteTicket}>Cancel expired ticket</button>
                        </td>
                    );
                default:
                    return (
                        <td>

                        </td>
                    )
            }
            break;
        case "Client":
            switch (TicketStatus) {
                case "Open":
                    return (
                        <td>
                            <button type="button" class="btn btn-danger mx-2" onClick={deleteTicket}>Cancel Ticket</button>
                        </td>
                    );
                case "Assigned":
                    return (
                        <td>
                            <button type="button" class="btn btn-primary mx-2" onClick={chat}>Chat</button>
                            <button type="button" class="btn btn-success mx-2" onClick={editTicket}>Edit</button>

                        </td>
                    );
                    break;
                case "Suspended":
                    return (
                        <td>
                            <button type="button" class="btn btn-primary mx-2" onClick={editTicket}>Add more information</button>
                            <button type="button" class="btn btn-danger mx-2" onClick={deleteTicket}>Cancel Ticket</button>
                        </td>
                    );
                case "Solved":
                    return (
                        <td>
                            <button type="button" class="btn btn-success mx-2" onClick={reopenTicket}>Reopen Ticket</button>
                            <button type="button" class="btn btn-danger mx-2" onClick={closeTicket}>Close Ticket</button>
                        </td>
                    );
                default:
                    return (
                        <td>

                        </td>
                    )
            }
            break;
    }
}

export default TicketButtons;
