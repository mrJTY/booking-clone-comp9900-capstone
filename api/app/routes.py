from flask import jsonify
from app import app
from app.models import User

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

# https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-xxiii-application-programming-interfaces-apis
@app.route('/users/<int:id>')
def users(id):
    return jsonify(User.query.get_or_404(id).to_dict())
