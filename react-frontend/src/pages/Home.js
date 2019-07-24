import React , { Component } from 'react';
import axios from "axios";

export class Home extends Component {
    state = {
        newTask:false
    }
    componentDidMount() {
        console.log(this.props.location.state)
      }
    
      onItemClickTask =  (newTask) => {
          this.setState(
              {
                  newTask:true
              }
          )
      }
      onItemClickHome =  (newTask) => {
        this.setState(
            {
                newTask:false
            }
        )
    }

        onChange(e){
            let files = e.target.files[0];
            console.log(files)
        }

    render() {
        return (
            <div className="App">
                <div className="NavBarField">
                    <button onClick={this.onItemClickHome} className="NavBarField__Button ">HOME</button>
                    <button onClick={this.onItemClickTask} className="NavBarField__Button mr-20">NEW TASK</button>
                    <button className="NavBarField__Button__Account mr-20">ACCOUNT SETTINGS</button>
                    <div className="Seperator"></div>
                    
                </div>
                   {this.state.newTask === true ? 
                   <div className="TaskFormField">
                    <div className="FormField TaskFormField__Label TaskFormField__Label__First">
                            <label className="FormField__Label" htmlFor="name">Task Name</label>
                            <input type="text" id="taskname" className="FormField__Input" placeholder="Enter your task name" name="name"></input>
                    </div>
    
                 <div className="FormField TaskFormField__Label">
                    <label className="FormField__Label" htmlFor="password">Task Field</label>
                    <input onChange={(e)=>this.onChange(e)} type="file" id="taskfield" className="FormField__Input" placeholder="Choose a file" name="file"></input>
                  </div>

                  <div className="FormField TaskFormField__Label">
                    <label className="FormField__Label" htmlFor="password">Prediction Step</label>
                    <input type="text" id="predictionfield" className="FormField__Input" placeholder="Write a prediction step" name="predictionfield"></input>
                  </div>

                  <div className="FormField">
                        <button className="TaskField__Button mr-20">Create Task</button> 
                    </div>
                 </div>
                   : ''}
                </div>
        )
    }
}

export default Home ; 