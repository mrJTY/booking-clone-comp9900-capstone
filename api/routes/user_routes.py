import logging

from api import app, db
from api.models.user import User
from flask import jsonify, request
from flask_jwt import current_identity, jwt_required
from werkzeug.security import generate_password_hash

logging.basicConfig(level=logging.INFO)

@app.route('/users/<int:id>', methods=["GET"])
def users(id):
    logging.info(f"Getting user {id}")
    return jsonify(User.query.get_or_404(id).to_dict())

@app.route('/users', methods=["POST"])
def register_user():
    logging.info("Registering a user")
    content = request.json
    if request.method == 'POST':
        try:
            # Receive contents from request
            logging.info(content)
            username = content["username"]
            password = content["password"]
            email = content["email"]
            u = User(
                username=username,
                email=email,
                # FIXME, generate_hash breaks auth
                password_hash=password
            )
            logging.info(u)
            db.session.add(u)
            db.session.commit()
            id = u.id
            logging.info(f"UserID created: {id}")
            return jsonify(User.query.get_or_404(id).to_dict())

        except Exception as e:
            logging.error(e)

# This can only be accessed if /auth was called
# See: https://pythonhosted.org/Flask-JWT/
@app.route('/current_user')
@jwt_required()
def current_user():
    return f"{current_identity}"
