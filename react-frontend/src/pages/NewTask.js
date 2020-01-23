import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

class NewTask extends Component {
  constructor() {
    super();

    this.state = {
      home: true,
      taskname: "",
      predictionStep: "",
      fileInfo: "",
      validFile: false,
      seeError: false,
      seeError2: false,
      displayMenu: false
    };

    this.getHome = this.getHome.bind(this);
    this.getLogOut = this.getLogOut.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
  }

  showDropdownMenu(event) {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
      document.addEventListener("click", this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener("click", this.hideDropdownMenu);
    });
  }

  getHome(e) {
    let path = `/home`;
    this.props.history.push({
      pathname: path,
      state: {
        name: this.props.location.state.name
      }
    });
  }

  getLogOut(e) {
    let path = `/logIn`;
    this.props.history.push(path);
  }

  handleChange(e) {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  onChange(e) {
    let files = e.target.files;
    this.state.fileInfo = files;
    let uploadedFileName = this.state.fileInfo[0].name;
    if (uploadedFileName.includes(".xlsx")) {
      this.setState({
        validFile: true,
        seeError: false,
        seeError2: false
      });
    } else {
      this.setState({
        seeError: true,
        seeError2: false
      });
    }
  }

  handleSettings(e) {
    e.preventDefault();
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    var sending_task_name = this.state.taskname;
    var sending_prediction_step = this.state.predictionStep;
    formData.append("file", this.state.fileInfo[0]);
    if (sending_task_name && sending_prediction_step && formData) {
      axios({
        method: "post",
        url: "/api/files",
        data: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } }
      }).then(response => {
        if (response.data.status === 200) {
          this.setState({
            home: true,
            newTask: false,
            taskname: "",
            predictionStep: "",
            fileInfo: ""
          });
          let path = `/home`;
          this.props.history.push({
            pathname: path,
            state: {
              name: this.props.location.state.name
            }
          });
        }
      });

      axios
        .post("/api/addNewTask", {
          sending_prediction_step: sending_prediction_step,
          sending_task_name: sending_task_name,
          current_user: this.props.location.state.name
        })
        .then(response => {
          console.log("Added new task");
        });
    } else {
      this.setState({
        seeError2: true,
        seeError: false
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="NavBarField">
          <button onClick={this.getHome} className="NavBarField__Button ">
            HOME
          </button>
          <button
            onClick={this.getNewTask}
            className="NavBarField__Button mr-20"
          >
            NEW TASK
          </button>
          <button
            onClick={this.showDropdownMenu}
            className="NavBarField__Button__Account mr-20"
          >
            ACCOUNT SETTINGS
          </button>
          {this.state.displayMenu ? (
            <ul>
              <li>
                <button>All Tasks</button>
              </li>
              <li>
                <button onClick={this.getLogOut}>Log Out</button>
              </li>
            </ul>
          ) : null}
          <div className="Seperator"></div>
        </div>

        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <div className="TaskFormField">
            <div className="FormField TaskFormField__Label TaskFormField__Label__First">
              <label className="FormField__Label" htmlFor="name">
                Task Name
              </label>
              <input
                type="text"
                id="taskname"
                className="FormField__Input"
                placeholder="Enter your task name"
                name="taskname"
                value={this.state.taskname}
                onChange={this.handleChange}
              ></input>
            </div>

            <div className="FormField TaskFormField__Label">
              <label className="FormField__Label" htmlFor="password">
                Task Field
              </label>
              <input
                type="file"
                id="file"
                accept=".xlsx"
                className="FormField__Input"
                placeholder="Choose a file"
                name="file"
                value={this.state.file}
                onChange={e => this.onChange(e)}
              ></input>
            </div>

            <div className="FormField TaskFormField__Label">
              <label className="FormField__Label" htmlFor="password">
                Prediction Step
              </label>
              <input
                type="text"
                id="predictionStep"
                className="FormField__Input"
                placeholder="Write a prediction step"
                name="predictionStep"
                value={this.state.predictionStep}
                onChange={this.handleChange}
              ></input>
            </div>

            <div className="FormField">
              <button
                onClick={this.createNewTask}
                className="TaskField__Button mr-20"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>

        {this.state.seeError ? (
          <div className="FileValidationField">
            Please select a valid file (.xlsx)
          </div>
        ) : null}

        {this.state.seeError2 ? (
          <div className="FileValidationField">Please fill in the blank!!!</div>
        ) : null}
      </div>
    );
  }
}

export default NewTask;
