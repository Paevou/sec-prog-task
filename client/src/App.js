import React, { Component } from 'react';
import ReactDOM from "react-dom";

import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';

import UserForm from './components/UserForm'
import Login from './components/Login'
import UserProfile from './components/UserProfile'

class App extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    user: {},
    users: [],
    isAuthenticated: false
  };

  componentDidMount() {
    const authenticationState = JSON.parse(localStorage.getItem("isAuthenticated"));
    if(authenticationState !== undefined) {
      this.setState( { isAuthenticated: authenticationState } );
    } 
    console.log("AUthenticated?: ", this.state.isAuthenticated);
  }

  login = () => {
    console.log("Login")
    this.setState( { isAuthenticated: true } );
    localStorage.setItem("isAuthenticated", true);
  }

  logout = () => {
    fetch('/user/logout', {
      method: 'GET'
    })
    .then(result => {
      if(result.ok) {
        this.setState( { isAuthenticated: false } );
        localStorage.clear();
        window.location.href = "/";
      } else {
        // #TODO: Handle error in logout?
      }
    })
  }

  render() {

    return ( 
      <HashRouter>
        <div>
          <h1> SPA Application </h1>
          <u1 className="header">

            {!this.state.isAuthenticated && (<li className="btn btn-dark"> <NavLink to="/login"> Login </NavLink> </li>)} 
            {!this.state.isAuthenticated && (<li className="btn btn-dark"> <NavLink to="/register"> Register </NavLink> </li>)} 

            {this.state.isAuthenticated && (<li className="btn btn-dark" onClick={this.logout}> Logout </li>)}
            {this.state.isAuthenticated && (<li className="btn btn-dark"> <NavLink to="/profile"> Profile </NavLink> </li>)}

          </u1>
          <div className="content">

            <Route path="/login" render={(props) => <Login login={this.login}/>}/>
            <Route path="/register" component={UserForm}/>

            <Route path="/profile" component={UserProfile}/>

          </div>
        </div>
      </HashRouter>
    )
  }
}

export default App;
