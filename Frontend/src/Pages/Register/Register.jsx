import React from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Register.css";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      type: "Client" // set to default selected value in user role switch
    }

    this.registerPost = this.registerPost.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setType = this.setType.bind(this);
  }

  async registerPost() {
    return axios.post('http://localhost:1234/user/register', {
      FirstName: this.state.firstName,
      LastName:  this.state.lastName,
      Email:      this.state.email,
      Username: this.state.username,
      Password: this.state.password,
      Type: this.state.type
    },{headers: { 'Authorization': `${localStorage.getItem('jwt')}`}}).then((res) => {
      if (res.status === 200) {
        document.location.href = '/login';
      } else {
        console.error("registration error");
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const token = await this.registerPost();
  }

  setFirstName(FirstName) {
    this.setState({ "firstName": FirstName });
  }

  setLastName(LastName) {
    this.setState({ "lastName": LastName });
  }

  setEmail(Email) {
    this.setState({ "email": Email });
  }

  setUsername(Username) {
    this.setState({ "username": Username });
  }

  setPassword(Password) {
    this.setState({ "password": Password });
  }

  setType(Type) {
    this.setState({ "type": Type });
  }

  render() {
    return (
      <div className="Register">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group size="lg" controlId="FirstName">
            <Form.Control
              type="text"
              value={this.state.firstName}
              onChange={(e) => this.setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
          </Form.Group>
          <Form.Group size="lg" controlId="LastName">
            <Form.Control
              type="text"
              value={this.state.lastName}
              onChange={(e) => this.setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
          </Form.Group>
          <Form.Group size="lg" controlId="Email">
            <Form.Control
              type="Email"
              value={this.state.email}
              onChange={(e) => this.setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </Form.Group>
          <Form.Group size="lg" controlId="Username">
            <Form.Control
              autoFocus
              type="text"
              value={this.state.username}
              onChange={(e) => this.setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </Form.Group>
          <Form.Group size="lg" controlId="Pass">
            <Form.Control
              type="password"
              value={this.state.password}
              onChange={(e) => this.setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </Form.Group>
          <Form.Group size="lg" controlId="Type">
            <Form.Control as="select" value={this.state.type} onChange={(e) => this.setType(e.target.value)}>
              <option selected value="Client">Client</option>
              <option value="Support">Support</option>
              <option value="Admin">Admin</option>
            </Form.Control>
          </Form.Group>
          <Button block size="lg" type="submit">
            Register
        </Button>
        </Form>
      </div>

    );
  }
}

export default Register;