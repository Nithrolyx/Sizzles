from flask import Flask, jsonify
from pymongo import MongoClient
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

#Connect to Mongo
client = MongoClient(app.config['MONGO_URI'])
db = client['sizzles']

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/data')
def get_data():
    collection = db['sizzles']
    data = list(collection.find({}, {'_id': 0}))
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
    
    