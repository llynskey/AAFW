import React, { useState, useEffect } from 'react';

const Search = (props) => {

    const [tickets, setTickets] = useState([])

    useEffect(() => {
        const tickets = props.tickets;
        setTickets(tickets);
    }, [props.tickets])


    const filterTickets = (e) => {
        const query = e.target.value;
        if (query != "") {
            let results = tickets.filter(ticket => {
                return JSON.stringify(ticket).toLowerCase().match(query);
                
            });
            props.setTickets(results);
        } else {
            props.setTickets(tickets)
        }
    }


    return (
        <>
            <input
                placeholder="Search for ..."
                onChange={filterTickets}
            />
        </>
    )
}

export default Search;