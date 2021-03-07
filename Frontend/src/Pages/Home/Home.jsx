import React, { useState } from "react";
import jumbotron from 'react-bootstrap/Jumbotron';
import axios from 'axios';
//import './Home.css'


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: " ",
            accountType: " "
        }
        var jwt = { token: localStorage.getItem('jwt') }

        
       /* axios.post('http://localhost:1234/user/', {
            headers: {'Authorization': `${localStorage.getItem('jwt')}`}   
       });
        this.setState({"username": res.data.user.Username});  
        this.setState({"accountType": res.data.user.Type});    */
       
    }

        clientButtons(props){
            return <button>Open Ticket</button>;
        }

        supportButtons(props){
            return <button>Open Ticket on behalf</button>;
        }

        adminButtons(props){
            return <button>Show All Tickets</button>;
        }

    render() {
        var title = `Hello ${this.state.username} and welcome to the UoK Ticket System`;
        var subtitle = `${this.state.accountType} Dashboard`
        return (
            <div className='Home'>
                <div className="jumbotron">

                    <h1>{title}</h1>
                    <h2>{subtitle}</h2>
                </div>
                <div className="buttons">
                   <button onClick="/createTicke">Create Ticket</button>
                </div>
            </div>
        )
    }
}
export default Home;