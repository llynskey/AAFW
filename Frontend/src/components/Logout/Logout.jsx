import React, { Component } from 'react';
import axios from 'axios';
import Button from "react-bootstrap/Button";
var token = localStorage.getItem('jwt');
class Logout extends React.Component {

    async logoutPost() {
        console.log("logging out")
        localStorage.removeItem('jwt');
        return axios.post("http://localhost:1234/user/logout", {
        }, { headers: { 'Authorization': `${token}` } }).then(()=>{
            document.location.href='/login';   
        });
    }


    render(){
        if(token)
            return(
                <Button onClick={this.logoutPost}>Logout</Button>
                 )
        else
            return null;
    }
}

export default Logout;