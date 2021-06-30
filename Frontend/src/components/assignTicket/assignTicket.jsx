import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

class AssignUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Show: false,
      Options: [],
      Users: [],
      Selected: {}
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setUsers = this.setUsers.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.addSupportToUser = this.addSupportToUser.bind(this);
  }

  setUsers(users) {
    this.setState({ Users: users });
  }

  setOptions(options) {
    this.setState({ Options: options });
  }

  setShow(value) {
    this.setState({ Show: value });
  }

  setSelected(option) {
    this.setState({ Selected: option });
  }

  handleClose() {
    this.setState({ Show: false });
  }

  handleShow() {
    this.getSupportUsers();
    this.setState({ Show: true });
  }

  async getSupportUsers() {
    axios.get('http://localhost:1234/user/supportUsers', {
      headers: { "Authorization": `${localStorage.getItem('jwt')}` }
    }).then((res) => {
      this.setUsers(res.data);
      this.setOptions(this.state.Users.supportUsers.map(user => ({ label: user.FirstName + " " + user.LastName, value: user._id })));
    });
  }

  async addSupportToUser() {
    axios.put('http://localhost:1234/ticket/assign',{id: this.state.Selected.value}, {
     headers:{"Authorization":`${localStorage.getItem('jwt')}`} 
    ,params:{id: this.props.ticketId},
    }).then((res) => {
      if (res.status === 200) {
        this.handleClose();
        document.location.href='/home'
      }
    })
  }


  render() {
    //getAllUsers();
    return (
      <Fragment>
        <Button variant="primary" onClick={this.handleShow}>
          Assign User
        </Button>

        <Modal show={this.state.Show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add User to Venue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Select value={this.state.Selected} options={this.state.Options} onChange={this.setSelected} />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.addSupportToUser}>
              Assign User
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

export default AssignUser;
