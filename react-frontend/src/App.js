import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink} from 'react-router-dom';
import SignUpForm from './pages/SignUpForm' ;
import LogInForm from './pages/LogInForm' ;
import pizza from './pizza.jpeg';
import './App.css';

function App() {

  return (
    <Router>
      
          <Route  exact path="/" component={SignUpForm}> 
          </Route>
          <Route path="/log-in" component={LogInForm}>
          </Route>
     
    </Router>
  );
}

export default App;
