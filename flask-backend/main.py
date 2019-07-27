from flask import Flask, render_template, request, jsonify, session , send_from_directory
from flask_sqlalchemy import SQLAlchemy
import json
import bcrypt
import os,binascii
from werkzeug.utils import secure_filename
import create_task

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Pass1234'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/ahmetgog/Desktop/huawei/git/pizza/flask-backend/pizza.sqlite'

db = SQLAlchemy(app)

class DataStore():
    get_pizza_types = []
    task_dict = {}
    current_user = ''
    current_task = ''

data2 = DataStore()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    password = db.Column(db.String(80))
    email = db.Column(db.String(50))

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_path = db.Column(db.String(250))
    user_id = db.Column(db.Integer)
    task_name = db.Column(db.String(50))

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


@app.route('/api/sign-up' , methods=['POST'])
def sign_up():
    data = request.data
    dataDict = json.loads(data)
    name = dataDict['parameters']['name']
    password = dataDict['parameters']['password'].encode('utf-8')
    hash_password = bcrypt.hashpw(password, bcrypt.gensalt( 12 ))
    email = dataDict['parameters']['email']

    new_user = User(name=name, password=hash_password, email=email)
    new_user.save_to_db()


    user_name = User.query.filter_by(name=name).first().name

    if (name == user_name):
        return jsonify({'message' : 'This username has already taken, please!!' , 'name':name, 'email':email})
    elif (name and password and email):
        return jsonify({'message' : 'New user created!', 'name':name, 'email':email})
    return ''

@app.route('/api/log-in' , methods=['POST'])
def log_in():  
    data = request.data
    dataDict = json.loads(data)
    name = dataDict['parameters']['name']
    password = dataDict['parameters']['password'].encode('utf-8')
    hash_password = bcrypt.hashpw(password, bcrypt.gensalt( 12 ))

    user_id = User.query.filter_by(name=name).first().id
    user_name = User.query.filter_by(name=name).first().name
    user_password = User.query.filter_by(name=name).first().password
    user_email = User.query.filter_by(name=name).first().email

    data2.task_dict = {
        'task_path': [],
        'task_name' : []
    }

    task = Tasks.query.filter(Tasks.user_id == user_id).all()
    for i in task:
        data2.task_dict['task_path'].append(i.task_path)
        data2.task_dict['task_name'].append(i.task_name)
    
    if (user_name == name and bcrypt.hashpw(password, user_password) == user_password):
        return jsonify({'message' : 'User login!', 'name':name, 'task':data2.task_dict})
    else: 
        return jsonify({'message' : 'Username or password are incorrect!'})

    return ''

        

@app.route('/api/taskInfo' , methods=['POST'])
def get_all_tasks(): 
    data = request.data
    dataDict = json.loads(data)

    data2.current_user = dataDict['current_user']
    data2.current_user_id = User.query.filter_by(name=data2.current_user).first().id

    data2.task_dict = {
       'task_path': [],
       'task_name' : []
    }
    task = Tasks.query.filter(Tasks.user_id == data2.current_user_id).all()
    for i in task:
        data2.task_dict['task_path'].append(i.task_path)
        data2.task_dict['task_name'].append(i.task_name)


    return jsonify({'message' : 'File!', 'task':data2.task_dict})




@app.route('/images/<path:path>')
def send_image(path):
    return send_from_directory('images', path)





@app.route('/api/addNewTask' , methods=['POST'])
def add_new_task(): 
    data = request.data
    dataDict = json.loads(data)
    prediction_step = dataDict['sending_prediction_step']
    data2.current_task =  dataDict['sending_task_name']
    data2.current_user = dataDict['current_user']
    data2.current_user_id = User.query.filter_by(name=data2.current_user).first().id


    print(data2.get_pizza_types)
    pizza_string = ''
    for i in data2.get_pizza_types:
        pizza_string = pizza_string + i + ' , '
            
    print(pizza_string)

    new_task = Tasks(task_path=pizza_string, user_id=data2.current_user_id, task_name=data2.current_task)
    new_task.save_to_db()
    return jsonify({'message' : 'File!', 'task':data2.task_dict})


@app.route('/api/files' , methods=['POST'])
def draw_images(): 
    if request.method == 'POST':     
        f = request.files['file']
        f.save(secure_filename(f.filename))
        print("LALSALDALSDLALSDLALS")
        print(data2.current_user)
        create_task.create_task_results(f.filename,data2.current_task)
        data2.get_pizza_types = create_task.get_pizza_type(f.filename)
        return jsonify({'message' : 'File Uploaded successfully!', 'status':200, 'pizza_types':data2.get_pizza_types})















@app.route('/home' , methods=['GET'])
def home():
    return render_template('index.html')



@app.route('/logIn' , methods=['GET'])
def logIn():
    return render_template('index.html')

@app.route('/newTask' , methods=['GET'])
def get_new_task():
    return render_template('index.html')












@app.route('/')
def index():
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)