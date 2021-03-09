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

  support() {
    if (this.state != null) {
      if (this.state.user.userRole === 'Support' || this.state.user.userRole === 'Admin') {
        return (
          <div>
            <NavDropdown.Item href="/createTicket">Create Ticket</NavDropdown.Item>
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
            {this.loggedIn()}
            <Nav.Link href="/register">Register</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              {this.support()}
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavbarClass;


