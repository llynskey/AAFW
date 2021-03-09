import React from 'react';
import Card from 'react-bootstrap/Card';

class Ticket extends React.Component {
    constructor(props) {
        super(props)
        this.ticketValue = props.ticketValue;
    }

    render() {
        return (
            <Card style={{ width: "100%", margin: "15px"}} border="secondary">
                <Card.Header>{this.ticketValue.Title}</Card.Header>
                <Card.Body>{this.ticketValue.Description}</Card.Body>
            </Card>
        );
    }
}

export default Ticket;