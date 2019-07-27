import React , { Component } from 'react';
import axios from "axios";
import LogInForm from './LogInForm';
import NewTask from './NewTask';
import { BrowserRouter as Route} from 'react-router-dom';



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
      displayMenu:false,
      logOut:false,
      validFile:false,
      seeError:false,
      pizzaTypes:'',
      indexValue:'',
      user:'',
      task_names:[],
      task_path:[],
      current_task_name:'',
      images:[],
      current_image:''
      
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
    this.getLogOut = this.getLogOut.bind(this);
    this.seeResult= this.seeResult.bind(this);
    this.showImage= this.showImage.bind(this);
  }

  componentDidMount() {
    this.setState({
      user:this.props.location.state.name
    })
    axios.post('/api/taskInfo', {
      current_user : this.props.location.state.name
    }).then((response) => {
      this.setState ({
        final_tasks : response.data,
        task_names:response.data.task.task_name,
        task_path:response.data.task.task_path
      })
    }
    )
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

  showImage(e) {
    this.setState({
      current_image:e.target.firstChild.nodeValue
    })
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
          validFile:false
        }
        
        )
        let path = `/newTask`;
        this.props.history.push(
          {
            pathname:path,
            state:{
              name:this.props.location.state.name
            }
          }
        );
    }

    getLogOut(e){
      let path = `/logIn`;
      this.props.history.push(path); }

    seeResult(e){
      let indexValue = e.target.parentNode.parentNode.querySelectorAll("[data-index]")[0].getAttribute("data-index")
      this.setState(
        {
          image_container:true,
          newTask:false,
          home:false,
          validFile:false,
          indexValue:indexValue,
          current_task_name:this.state.task_names[indexValue],
          images : this.state.task_path[indexValue].split(', ')
        }
        
        )
    }

    getAccountSetting(e){
      this.setState(
        {
          accountSettings:true,
          validFile:false
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
          image_container:false,
          validFile:false
        }
        
        )
    }

    handleSettings(e){
      e.preventDefault();
    }
  
  handleSubmit(e){
    e.preventDefault();
    const formData = new FormData()
    var sending_task_name = this.state.taskname;
    var sending_prediction_step = this.state.predictionStep;
    let name = this.state.fileInfo[0].name
    
    if (name.includes('.xlsx')){
      this.setState({
        validFile:true
      })
      formData.append('file', this.state.fileInfo[0])
    axios({
      method: 'post',
            url: '/api/files',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } 
            }
      
  }).then(response => {
    if(response.data.status === 200 && this.state.validFile === true){
      this.setState ( {
        home:true,
        newTask:false,
        taskname: '',
        predictionStep:'',
        fileInfo:'',
        validFile:false,
        seeError:false,
        pizzaTypes:response.data.pizza_types
      })

     
      
    }
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
  })



  

    }
    else{
      this.setState({
        validFile:true,
        seeError:true

      })
    }
  }    

  onChange(e) {
    let files=e.target.files
    this.state.fileInfo = files
    let name = this.state.fileInfo[0].name
    
    if (name.includes('.xlsx')){
      this.setState({
        validFile:true
      })
      
    }
  }
    
    render() {
      
        var task_names = this.state.task_names
        var task_path = this.state.task_path
        var current_image_name = this.state.current_task_name + this.state.current_image + '.png'
        console.log(this.state.current_task_name)
        console.log(current_image_name)
        return (
            <div className="App">
                <div className="NavBarField">
                    <button  onClick={this.getHome} className="NavBarField__Button ">HOME</button>
                    <button  onClick={this.getNewTask} className="NavBarField__Button mr-20">NEW TASK</button>
                    <button  onClick={this.showDropdownMenu} className="NavBarField__Button__Account mr-20">ACCOUNT SETTINGS</button>
                    
                    { this.state.displayMenu ? (
                      <ul>
                    <li><button>All Tasks</button></li>
                    <li><button onClick={this.getLogOut}>Log Out</button></li>
                    
                      </ul>
                    ):
                    (
                      null
                        )
                        }
                    <div className="Seperator"></div>

                
                </div>

                {this.state.home === true ? 
                   <div className='UserTaskField'>

                      <table className="table1">
                        <tr>
                          <th className="TableHeaders">NO</th>
                          <th className="TableHeaders">TASK NAME</th>
                          <th className="TableHeaders">PIZZA TYPES</th>
                          <th className="TableHeaders">EDIT</th>
                        </tr>
                      <table className="table2">
                      {task_names.map((column, index) => 
                      <tr>
                        <td>{index+1}</td>
                        <td>{column}</td>
                        <td data-index={index}>{task_path[index]}</td>
                         <td><button onClick={this.seeResult} className="SeeResultsField">Results</button><button className="DeleteField">Delete</button></td>
                      </tr>)}

                      </table>
         


                        </table>
                   
                   </div>
                   : ''}

                {this.state.image_container === true ? 
                   <div className="ImageContainerField">
                     <div className="ImageField">
                        <img src={"/images/" + current_image_name} /> )}
                     </div>
                     <div className="PizzaSelectionField">
                     {task_path[this.state.indexValue].split(",").map((column, index) => 
                                <button onClick={this.showImage} className="Results">{column.trim()}</button>)}
                     </div>
                   </div>
                   
                   
                       
                     
               
             
                   : ''}


                

                </div>
        )
    }
}

export default Home ; 