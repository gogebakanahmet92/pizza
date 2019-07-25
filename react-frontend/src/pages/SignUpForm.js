import React , { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from "axios";

class SignUpForm extends Component {
    
  constructor(){
    super();

    this.state = {
      name: '',
      password: '',
      email: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e){
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e){
    e.preventDefault();

    var signUp = this.state
    axios.post('/api/sign-up', {
        parameters:signUp
      }).then((response) => {
        var new_user = response.data;
        console.log(new_user);
        if (new_user['name'] && new_user['email']){
          this.setState({success: true})
        }
       
      })
  }
  

    render() {
        return (
          <div className="App">
          <div className="App__Form">
            
            <div className="PageSwitcher">
              <NavLink to="/logIn" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">LOG IN</NavLink>
              <NavLink exact to="/"  activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">SIGN UP</NavLink>
            </div>
          
            <div className="FormTitle">
              <NavLink  to="/logIn" activeClassName="FormTitle__Link FormTitle__Link--Active" className="FormTitle__Link">LOG IN</NavLink> or 
              <NavLink exact to="/" activeClassName="FormTitle__Link FormTitle__Link--Active" className="FormTitle__Link">SIGN UP</NavLink>
            </div>
            <div className="FormCenter">
            <form onSubmit={this.handleSubmit} className="FormFields" >
              <div className="FormField">
                <label className="FormField__Label" htmlFor="name">Full Name</label>
                <input type="text" id="name" className="FormField__Input" placeholder="Enter your full name" name="name"></input>
              </div>

              <div className="FormField">
                <label className="FormField__Label" htmlFor="name">Username</label>
                <input type="text" id="name" className="FormField__Input" placeholder="Enter your username" name="name"
                value={this.state.name} onChange={this.handleChange}></input>
              </div>

              <div className="FormField">
                <label className="FormField__Label" htmlFor="password">Password</label>
                <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password"
                  value={this.state.password} onChange={this.handleChange}></input>
              </div>

              <div className="FormField">
                <label className="FormField__Label" htmlFor="email">Email Address</label>
                <input type="email" id="email" className="FormField__Input" placeholder="Enter your email address" name="email"
                  value={this.state.email} onChange={this.handleChange}></input>
              </div>

              <div className="FormField">
                <button className="FormField__Button mr-20">SIGN UP</button> <Link to="/logIn" className="FormField__Link">I'm already member</Link>
              </div>
              <div>
                {this.state.success === true ? (<div>New user created succesfully!</div>) : ''}
              </div>
            </form>
            
          </div>
            
          </div>
      </div>
            
        )
    }
}

export default SignUpForm ; 