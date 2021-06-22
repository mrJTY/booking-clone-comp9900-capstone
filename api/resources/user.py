import logging
import json

from flask import jsonify, request
from flask_restplus import Resource, fields
import api
from api import db
from api.utils.req_handling import *
import hashlib

user = api.api.namespace("users", description="User operations")

create_user_details = api.api.model(
    "User",
    {
        "username": fields.String(required=True, description="Username of the user"),
        "password": fields.String(required=True, description="The password of the user"),
        "email": fields.String(required=True, description="Email address of the user"),
    },
)

get_user_details = api.api.model(
    "User",
    {
        "id": fields.Integer(required=True, description="The UserID"),
        "username": fields.String(required=True, description="Username of the user"),
        "email": fields.String(required=True, description="Email address of the user"),
    },
)


class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    email = db.Column(db.Text, unique=True)
    password_hash = db.Column(db.Text)

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        data = {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }
        return data


# See example: https://github.com/noirbizarre/flask-restplus/blob/master/examples/todo.py
@user.route("/<int:user_id>")
@user.param("user_id", "The user identifier")
@user.response(404, "User not found")
class User(Resource):
    @user.doc(description=f"UserID must be provided")
    @user.marshal_with(get_user_details)
    def get(self, user_id):
        logging.info(f"Getting user {user_id}")
        return UserModel.query.get_or_404(user_id).to_dict()

    # TODO: Delete a user
    # def delete(self, todo_id):
    #     del TODOS[todo_id]
    #     return '', 204

    # TODO: Update a user
    # def put(self, todo_id):
    #     args = parser.parse_args()
    #     task = {'task': args['task']}
    #     TODOS[todo_id] = task
    #     return task, 201


@user.route("")
class UserList(Resource):
    @user.doc(description=f"Creates a new User")
    @user.expect(create_user_details)
    @user.marshal_with(get_user_details)
    def post(self):
        logging.info("Registering a user")
        content = get_request_json()
        if request.method == "POST":
            try:
                # Receive contents from request
                logging.info(content)
                username = content["username"]
                password = content["password"]
                email = content["email"]
                password_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
                u = UserModel(
                    username=username,
                    email=email,
                    # FIXME, generate_hash breaks auth
                    password_hash=password_hash,
                )
                logging.info(u)
                db.session.add(u)
                db.session.commit()
                id = u.id
                logging.info(f"UserID created: {id}")
                return UserModel.query.get_or_404(id).to_dict()

            except Exception as e:
                logging.error(e)
                api.abort(500, f"{e}")
