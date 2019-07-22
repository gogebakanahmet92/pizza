from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import json
import bcrypt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Pass1234'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/ahmetgog/Desktop/huawei/git/pizza/flask-backend/pizza.sqlite'

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    password = db.Column(db.String(80))
    email = db.Column(db.String(50))



@app.route('/api/sign-up' , methods=['POST'])
def sign_up():
    data = request.data
    dataDict = json.loads(data)
    name = dataDict['parameters']['name']
    password = dataDict['parameters']['password'].encode('utf-8')
    hash_password = bcrypt.hashpw(password, bcrypt.gensalt( 12 ))
    email = dataDict['parameters']['email']
    new_user = User(name=name, password=hash_password, email=email)
    db.session.add(new_user)
    db.session.commit()
    print(name)
    if (name and password and email):
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

    if (user_name == name and bcrypt.hashpw(password, user_password) == user_password):
        return jsonify({'message' : 'User login!', 'name':name})
    else:
        return jsonify({'message' : 'Username or password are incorrect!'})

    return ''













@app.route('/')
def index():
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)