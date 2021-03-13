import React, { Component } from 'react'
import axios from 'axios';

class Search extends Component {

    constructor(props) {
        super(props)
        this.props = props;
    }

    filterTickets = (e) => {
        axios.get('http://localhost:1234/tickets', {
            params: {
                query: e.target.value
            },
            headers: {
                'Authorization': `${localStorage.getItem('jwt')}`
            }
        }).then(({ data }) => {
            this.props.updateTickets(data.data)
        })
    }

    render() {
        return (
            <>
                <input
                    placeholder="Search for ..."
                    onChange={this.filterTickets}
                />
            </>
        )
    }
}

export default Search;