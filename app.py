from flask import Flask, jsonify, request
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from functools import wraps
from flask_cors import CORS
import jwt
import datetime
import os
import bcrypt

# Flask app setup
app = Flask(__name__)
CORS(app)
# Load Secret Key (Best practice: store in .env in real apps!)
SECRET_KEY = "your_super_secret_key"

# MongoDB connection URI
uri = "mongodb+srv://abhigupta220901:mFRLQBDKbQSppkpc@cluster0.nmws91j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create MongoDB client
client = MongoClient(uri, server_api=ServerApi('1'))

# Database and Collection
db = client['Expense-tracker']  # Your database name
users_collection = db['Users']  # User collection
expenses_collection = db['Expenses']  # Expense collection


# Home Route to Check Connection
@app.route('/')
def home():
    try:
        client.admin.command('ping')
        return "✅ Connected to MongoDB successfully!"
    except Exception as e:
        return f"❌ MongoDB Connection Error: {e}"


# JWT Token Required Decorator
def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token missing!'}), 403
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user = data  # attach user info to request
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired!'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid Token!'}), 403
        return f(*args, **kwargs)

    return decorated


# User Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'username': username})
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = jwt.encode(
            {
                'user_id': str(user['_id']),
                'username': username,
                'role': user.get('role', 'user'),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            },
            SECRET_KEY,
            algorithm='HS256')
        return jsonify({'token': token})

    return jsonify({'error': 'Invalid credentials!'}), 401



@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required!'}), 400

    if users_collection.find_one({'$or': [{'username': username}, {'email': email}]}):
        return jsonify({'error': 'User with this username or email already exists!'}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user = {
        'username': username,
        'email': email,
        'password': hashed_password,
        'role': 'user'
    }
    users_collection.insert_one(new_user)

    token = jwt.encode(
        {
            'username': username,
            'role': 'user',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        },
        SECRET_KEY,
        algorithm='HS256'
    )

    return jsonify({'token': token})

# Get All Users (Protected Route)
@app.route('/names', methods=['GET'])
@token_required
def get_names():
    names = users_collection.find()
    name_list = []

    for doc in names:
        doc['_id'] = str(
            doc['_id'])  # Convert ObjectId to string for JSON serialization
        name_list.append(doc)

    return jsonify(name_list)


# Add Expense (Protected Route)
@app.route('/add-expense', methods=['POST'])
@token_required
def add_expense():
    data = request.json
    # Example schema: {'title': 'Lunch', 'amount': 200}
    data['user_id'] = request.user['user_id']  # Attach user info from token
    expenses_collection.insert_one(data)

    return jsonify({'message': 'Expense added successfully!', 'data': data})


# Fetch Expenses for Current User
@app.route('/my-expenses', methods=['GET'])
@token_required
def my_expenses():
    expenses = expenses_collection.find({'user_id': request.user['user_id']})
    expense_list = []

    for doc in expenses:
        doc['_id'] = str(doc['_id'])
        expense_list.append(doc)

    return jsonify(expense_list)


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
