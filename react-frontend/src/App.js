import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink} from 'react-router-dom';
import SignUpForm from './pages/SignUpForm' ;
import LogInForm from './pages/LogInForm' ;
import pizza from './pizza.jpeg';
import './App.css';

function App() {
  return (
    <Router>

      <div className="App">

        <div className="App__Form">
          
          <div className="PageSwitcher">
            <NavLink to="/log-in" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">LOG IN</NavLink>
            <NavLink exact to="/"  activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">SIGN UP</NavLink>
          </div>
        
          <div className="FormTitle">
            <NavLink  to="/log-in" activeClassName="FormTitle__Link FormTitle__Link--Active" className="FormTitle__Link">LOG IN</NavLink> or 
            <NavLink exact to="/" activeClassName="FormTitle__Link FormTitle__Link--Active" className="FormTitle__Link">SIGN UP</NavLink>
          </div>

          <Route exact path="/" component={SignUpForm}> 
          </Route>
          <Route path="/log-in" component={LogInForm}>
          </Route>
        </div>
    </div>
    
    </Router>
  );
}

export default App;
