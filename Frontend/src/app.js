import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Login, Home ,Register, createTicket, updateTicket } from './Pages'; 
import withAuth from './components/withAuth/withAuth';
import Nav from './components/Nav/Nav';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav/>
        <Switch>
          <Route path="/login"><Login/></Route>,
          <Route path="/home" component={withAuth(Home)} />,
          <Route path="/register" component={withAuth(Register)}/>
          <Route path="/createTicket" component={withAuth(createTicket)} />
          <Route path="/editTicket:id" component={withAuth(updateTicket)} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}



export default App;
