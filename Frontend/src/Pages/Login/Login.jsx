import React from "react";
import axios from 'axios';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }

    this.loginPost = this.loginPost.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }


  async loginPost() {
    return axios.post("http://localhost:1234/user/login", {
      Username: this.state.username,
      Password: this.state.password
    }).then((res) => {
      console.log(res)
      if (res.status === 200) {
        console.log(res.data.token);
        localStorage.setItem('jwt', res.data.token);
        console.log("redirecting")
        document.location.href = '/home';
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    await this.loginPost();
  }

  setUsername(Username) {
    this.setState({ "username": Username });
  }
  setPassword(Password) {
    this.setState({ "password": Password });
  }

  render() {
    return (
      <div className="Login">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group size="lg" controlId="Username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              value={this.state.username}
              onChange={(e) => this.setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="Password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={this.state.password}
              onChange={(e) => this.setPassword(e.target.value)}
            />
          </Form.Group>
          <Button block size="lg" type="submit">
            Login
        </Button>
        </Form>
      </div>
    )
  }
}


export default Login;
