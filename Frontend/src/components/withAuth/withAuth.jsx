import React, { Component, useState } from "react";
import { ReactDOM, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function withAuth(ComponentToProtect) {
    return class extends Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirect: false,
            };
        }

        componentDidMount() {
            console.log(ComponentToProtect)
            axios.get('http://localhost:1234/user/verify', {
               headers: {'Authorization': `${localStorage.getItem('jwt')}`},
                "token": localStorage.getItem('jwt'),
                "page": ComponentToProtect.name
            }).then((res) => {
                if (res.status === 200){
                    console.log("200")
                    return this.setState({ loading: false }); 
                }else {
                    const error = new Error(res.error);
                    throw error;
                }
            }).catch(error => {
                if(error.status === 401)
                    localStorage.removeItem('jwt');
                    return this.setState({ loading:false, redirect: true })
               //throw error message in future
                return this.setState({ loading:false, redirect: true })
            })
            
        }

        render() {

            if (this.state.loading)
                return null; // Loading Spinner
            
            if (this.state.redirect)
                return <Redirect to="/login" />

            return <ComponentToProtect{...this.props} />
        }
    }
}
