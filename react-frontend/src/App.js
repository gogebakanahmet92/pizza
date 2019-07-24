import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import SignUpForm from './pages/SignUpForm' ;
import LogInForm from './pages/LogInForm' ;
import Home from './pages/Home' ;
import './App.css';

function App() {

  return (
    <Router>
      
          <Route  exact path="/" component={SignUpForm}> 
          </Route>
          <Route path="/logIn" component={LogInForm}>
          </Route>
          <Route path="/home" component={Home}>
          </Route>
     
    </Router>
  );
}

export default App;
