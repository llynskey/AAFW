import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Router, Switch} from 'react-router-dom';
import { Login, Home ,Register, createTicket, updateTicket, addMoreInformation } from './Pages'; 
import withAuth from './components/withAuth/withAuth';
import Nav from './components/Nav/Nav';
import ChatRoom from './Pages/Chat/Chat'
import ActionTicket from './Pages/ActionTicket/ActionTicket';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav/>
        <Switch>
          <Route exact path="/"><Login/></Route>,
          <Route exact path="/login"><Login/></Route>,
          <Route exact path="/home" component={withAuth(Home)} />,
          <Route exact path="/register" component={withAuth(Register)}/>,
          <Route exact path="/createTicket" component={withAuth(createTicket)}/>,
          <Route exact path="/editTicket:id" component={withAuth(updateTicket)}/>,
          <Route exact path="/addMoreInformation:id" component={withAuth(addMoreInformation)}/>,
          <Route exact path="/chat:roomId" component={withAuth(ChatRoom)}/>,
          <Route exact path="/actionTicket:id" component={withAuth(ActionTicket)}/>
        </Switch>
      </BrowserRouter>
    </div>
  )
}



export default App;
