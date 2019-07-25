import React , { Component } from 'react';
import axios from "axios";

export class Home extends Component {
  constructor(){
    super();
    
    this.state = {
      taskname: '',
      predictionStep:'',
      newTask:false,
      fileInfo:'',
      home:true,
      deneme:'',
      final_tasks:'',
      image_container:false,
      accountSettings:false,
      accountSettingsValue:'',
      displayMenu:false
      
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNewTask= this.getNewTask.bind(this);
    this.getHome= this.getHome.bind(this);
    this.seeResult= this.seeResult.bind(this);
    this.getAccountSetting = this.getAccountSetting.bind(this);
    this.handleSettings = this.handleSettings.bind(this)
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
  }


  showDropdownMenu(event) {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
    document.addEventListener('click', this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });

  }


  handleChange(e){
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

    getNewTask(e){
      this.setState(
        {newTask: true,
          home:false,
          image_container:false,
        }
        
        )
    }

    seeResult(e){
      this.setState(
        {
          image_container:true,
          newTask:false,
          home:false
        }
        
        )
    }

    getAccountSetting(e){
      this.setState(
        {
          accountSettings:true
        }
        
        )
    }
    

    getHome(e){
      
      this.setState(
        {newTask: false,
          taskname: '',
          predictionStep:'',
          fileInfo:'',
          home:true,
          image_container:false
        }
        
        )
    }

    handleSettings(e){
      e.preventDefault();
    }
  
  handleSubmit(e){
    e.preventDefault();
    const formData = new FormData()
    console.log(this.state.fileInfo[0])
    var sending_task_name = this.state.taskname;
    var sending_prediction_step = this.state.predictionStep;
    formData.append('file', this.state.fileInfo[0])
    axios({
      method: 'post',
            url: '/api/files',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } 
            }
      
  }).then(response => {
    if(response.data.status === 200){
      this.setState ( {
        home:true,
        newTask:false,
        taskname: '',
        predictionStep:'',
        fileInfo:''
      })
    }
  })



  axios.post('/api/taskInfo', {
    sending_prediction_step:sending_prediction_step,
    sending_task_name:sending_task_name,
    current_user : this.props.location.state.name
  }).then((response) => {
    this.setState ({
      final_tasks : response.data.task,
    })
  }
  )
}

  onChange(e) {
    let files=e.target.files
    this.state.fileInfo = files
  }

    render() {
      var task = this.props.location.state.userLoginData.task
      var task_names = task.task_name
      var task_path = task.task_path
      var updated_task_names = this.state.final_tasks.task_name
      var updated_path_names = this.state.final_tasks.task_path
      console.log(updated_path_names)
      if (updated_path_names){
        if (updated_path_names.length > task_names.length){
          task_names = updated_task_names;
          task_path = updated_path_names
        }
      }
      
        return (
            <div className="App">
                <div className="NavBarField">
                    <button  onClick={this.getHome} className="NavBarField__Button ">HOME</button>
                    <button  onClick={this.getNewTask} className="NavBarField__Button mr-20">NEW TASK</button>
                    <button  onClick={this.showDropdownMenu} className="NavBarField__Button__Account mr-20">ACCOUNT SETTINGS</button>
                    { this.state.displayMenu ? (
                      <ul>
                    <li><a className="active" href="#Create Page">Create Page</a></li>
                    <li><a href="#Manage Pages">Manage Pages</a></li>
                    <li><a href="#Create Ads">Create Ads</a></li>
                    <li><a href="#Manage Ads">Manage Ads</a></li>
                    <li><a href="#Activity Logs">Activity Logs</a></li>
                    <li><a href="#Setting">Setting</a></li>
                    <li><a href="#Log Out">Log Out</a></li>
                      </ul>
                    ):
                    (
                      null
        )
        }
                    <div className="Seperator"></div>
                    

                 


                </div>
                   {this.state.newTask === true ? 
                   <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                     <div className="TaskFormField">
                    <div className="FormField TaskFormField__Label TaskFormField__Label__First">
                            <label className="FormField__Label" htmlFor="name">Task Name</label>
                            <input type="text" id="taskname" className="FormField__Input" placeholder="Enter your task name" name="taskname"
                            value={this.state.taskname} onChange={this.handleChange}></input>
                    </div>
    
                 <div className="FormField TaskFormField__Label">
                    <label className="FormField__Label" htmlFor="password">Task Field</label>
                    <input  type="file" id="file" className="FormField__Input" placeholder="Choose a file" name="file"
                        value={this.state.file} onChange={(e) => this.onChange(e)}></input>
                  </div>

                  <div className="FormField TaskFormField__Label">
                    <label className="FormField__Label" htmlFor="password">Prediction Step</label>
                    <input type="text" id="predictionStep" className="FormField__Input" placeholder="Write a prediction step" name="predictionStep"
                        value={this.state.predictionStep} onChange={this.handleChange}></input>
                  </div>

                  <div className="FormField">
                        <button onClick={this.createNewTask} className="TaskField__Button mr-20">Create Task</button> 
                    </div>
                 </div>
                   </form>
                   : ''}
                   {this.state.home === true ? 
                   <div className='UserTaskField'>
                   <table>
                    <tr>
                      <th>NO</th>
                      <th>TASK NAME</th>
                      <th>PATH</th>
                      <th>EDIT</th>
                    </tr>

                      {task_names.map((column, index) => 
                      <tr>
                        <td>{index+1}</td>
                        <td>{column}</td>
                         <td>{task_path[index]}</td>
                         <td><button onClick={this.seeResult} className="SeeResultsField">Results</button><button className="DeleteField">Delete</button></td>
                      </tr>)}
                      
                
                   
                    </table>
                   </div>
                   : ''}

                {this.state.image_container === true ? 
                   <div className="ImageContainerField">
                   </div>
                   : ''}




        

          

       

                
                </div>
        )
    }
}

export default Home ; 