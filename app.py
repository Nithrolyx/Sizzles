from flask import Flask, jsonify, render_template
from pymongo import MongoClient
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

#Connect to Mongo
client = MongoClient(app.config['MONGO_URI'])
db = client['sizzles']
food_menu = db.food
orders = db.orders

@app.route('/', methods=('GET', 'POST'))
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
    
    