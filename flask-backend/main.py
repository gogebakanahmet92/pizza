from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
import json
import bcrypt
import os,binascii

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Pass1234'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/ahmetgog/Desktop/huawei/git/pizza/flask-backend/pizza.sqlite'

db = SQLAlchemy(app)

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

    task_dict = {
        'task_path': [],
        'task_name' : []
    }

    task = Tasks.query.filter(Tasks.user_id == user_id).all()
    for i in task:
        task_dict['task_path'].append(i.task_path)
        task_dict['task_name'].append(i.task_name)
    
    if (user_name == name and bcrypt.hashpw(password, user_password) == user_password):
        return jsonify({'message' : 'User login!', 'name':name, 'task':task_dict})
    else:
        return jsonify({'message' : 'Username or password are incorrect!'})

    return ''


@app.route('/api/files' , methods=['POST'])
def get_files(): 
    data = request.data
    print(data)
    return ''


@app.route('/home' , methods=['GET'])
def home():
    return render_template('index.html')



@app.route('/logIn' , methods=['GET'])
def logIn():
    return render_template('index.html')













@app.route('/')
def index():
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)