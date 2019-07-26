import React , { Component } from 'react';
import { Link, NavLink} from 'react-router-dom';
import axios from "axios";

class LogInForm extends Component {

    constructor(){
        super();
        this.state = {
          name: '',
          password: '',
          
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
    
        var logIn = this.state
        axios.post('/api/log-in', {
            parameters:logIn
          }).then((response) => {
            var new_user = response.data;
            if (new_user['name']){
              this.props.history.push(
                {
                  pathname:'/home',
                  state:{
                    name:new_user['name']
                  }
                }
              );
              this.setState(
                {success: true,
                  fail: false,
                 user_name:new_user['name']
                }
                
                )
            }
            else {
              this.setState(
                {fail: true,
                  success: false,
                }
                
                )
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
                <label className="FormField__Label" htmlFor="name">Username</label>
                <input type="text" id="name" className="FormField__Input" placeholder="Enter your full name" name="name"
                    value={this.state.name} onChange={this.handleChange}></input>
              </div>

              <div className="FormField">
                <label className="FormField__Label" htmlFor="password">Password</label>
                <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password"
                    value={this.state.password} onChange={this.handleChange}></input>
              </div>


              <div className="FormField">
                <button className="FormField__Button mr-20">LOG IN</button> <Link to="/" className="FormField__Link">Create an account</Link>
              </div>
              <div>
                {this.state.fail === true ? (<div>Username or password are incorrect!</div>) : ''}
              </div>

            </form>
            </div>
            </div>
          </div>
        )
    }
}

export default LogInForm ; 