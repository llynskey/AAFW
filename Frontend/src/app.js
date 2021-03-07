import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Login, Home ,Register, createTicket } from './Pages'; 
import withAuth from './components/withAuth/withAuth';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from './components/Nav/Nav';


function App() {
  return (
    <div className="App">
      <Nav/>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login/>
          </Route>,
          <Route path="/home" component={withAuth(Home)} />,
          <Route path="/register" component={withAuth(Register)}/>
          <Route path="/createTicket" component={withAuth(createTicket)} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}



export default App;
