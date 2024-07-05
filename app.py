from flask import Flask, jsonify, render_template, request, redirect, url_for
from pymongo import MongoClient
from config import Config
from bson import ObjectId

app = Flask(__name__)
app.config.from_object(Config)

# Connect to Mongo
client = MongoClient(app.config['MONGO_URI'])
db = client['sizzles']
food_menu = db.food
orders = db.orders

# Custom filter for min function
@app.template_filter('min')
def min_filter(a, b):
    return min(a, b)

@app.route('/', methods=('GET', 'POST'))
def index():
    return render_template('index.html')

@app.route('/add-food', methods=['GET', 'POST'])
def add_food():
    # Get the current page number from the query parameters
    page = int(request.args.get('page', 1))
    per_page = 10
    
    # Fetch food items with pagination
    total_count = food_menu.count_documents({})
    foods = list(food_menu.find().skip((page - 1) * per_page).limit(per_page))
    
    # Convert ObjectId to string for each food item
    for food in foods:
        food['_id'] = str(food['_id'])
        
    if request.method == 'POST':
        name = request.form.get('name')
        price = request.form.get('price')
        
        if name and price:
            food_menu.insert_one({'name': name, 'price': float(price)})
            return redirect(url_for('add_food'))
    
    # Calculate total pages
    total_pages = (total_count + per_page - 1) // per_page
    
    return render_template('add_food.html', foods=foods, page=page, total_pages=total_pages, total_count=total_count)

@app.route('/delete-food/<food_id>', methods=['POST'])
def delete_food(food_id):
    try:
        # Convert the string ID to ObjectId
        object_id = ObjectId(food_id)
        
        # Delete the food item from the database
        result = food_menu.delete_one({'_id': object_id})
        
        if result.deleted_count == 1:
            return jsonify({'success': True, 'message': 'Food item deleted successfully'})
        else:
            return jsonify({'success': False, 'message': 'Food item not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500    

if __name__ == '__main__':
    app.run(debug=True)
