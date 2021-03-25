import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Search = (props) => {

    const [allTickets, setTickets] = useState([])

    useEffect(() => { 
        const tickets = props.allTickets;
        setTickets(tickets);
    },[allTickets]) 

    
    const filterTickets = (e) => {
        //const setAllTickets = props.setAllTickets;

        const query = e.target.value;
        if(query != ""){

        let results = allTickets.filter(ticket => {
            return JSON.stringify(ticket).toLowerCase().match(query);
            
        });

        props.setAllTickets(results);
    }else{
        props.setAllTickets(allTickets)
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