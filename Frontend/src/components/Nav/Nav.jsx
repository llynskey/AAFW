import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logout from '../Logout/Logout';
import JWT from 'jsonwebtoken';
import axios from 'axios';




class NavbarClass extends React.Component {



  constructor(props) {
    super(props);
    var jwt = localStorage.getItem('jwt');
    if (jwt) {
      var token = jwt.split(' ')[1];
      var user = JWT.decode(token);
      this.state = {
        user: user
      }
    }
  }

  managementActions() {
    if (this.state != null) {
      var user = this.state.user;
      if (user.userRole === 'Client') {
        return (
          <div>
            <NavDropdown.Item href="/createTicket">Create Ticket</NavDropdown.Item>
          </div>
        )
      }
      if(user.userRole === 'Support'){
        return(
          <div>
            
          </div>
        )
      }
      if(user.userRole === 'Admin'){
        return(
          <div>
            <NavDropdown.Item href="/"/>
          </div>
        )
      }
    }
  }




loggedIn() {
  if (this.state != null) {
    return (
      <Nav.Link>Welcome {this.state.user.username}</Nav.Link>,
      <Logout />
    );
  } else {
    return (<Nav.Link href="/login">Login</Nav.Link>);
  }
}




render() {
  return (
    <Navbar class="navbar-dark" fluid>
      <Navbar.Brand href="/home">Uok Tickets</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/register">Register</Nav.Link>
          <NavDropdown title="Management Actions" id="basic-nav-dropdown">
            {this.managementActions()}
          </NavDropdown>
          {this.loggedIn()}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
}

export default NavbarClass;


