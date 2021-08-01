import hashlib
import logging

from api import db
from api.models.follower import FollowerModel
from api.models.user import UserModel
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource, fields
from sqlalchemy.orm.attributes import flag_modified
import api

user = api.api.namespace("users", description="User operations")

create_user_details = api.api.model(
    "User",
    {
        "username": fields.String(required=True, description="Username of the user"),
        "password": fields.String(
            required=True, description="The password of the user"
        ),
        "email": fields.String(required=True, description="Email address of the user"),
    },
)

get_user_details = api.api.model(
    "User",
    {
        "user_id": fields.Integer(required=True, description="The UserID"),
        "username": fields.String(required=True, description="Username of the user"),
        "email": fields.String(required=True, description="Email address of the user"),
        "is_followed": fields.Boolean(
            required=False, description="Whether the user is being followed or not"
        ),
    },
)

# See example: https://github.com/noirbizarre/flask-restplus/blob/master/examples/todo.py
@user.route("/<int:user_id>")
@user.param("user_id", "The user identifier")
@user.response(404, "User not found")
class User(Resource):
    @user.doc(description=f"UserID must be provided")
    @user.marshal_with(get_user_details)
    def get(self, user_id):
        logging.info(f"Getting user {user_id}")
        u = UserModel.query.get_or_404(user_id).to_dict()
        is_followed = is_user_followed(user_id)
        return {**u, "is_followed": is_followed}

    # TODO: Delete a user
    # def delete(self, todo_id):
    #     del TODOS[todo_id]
    #     return '', 204

    def put(self, user_id):
        content = get_request_json()
        try:

            # Fetch the user
            user = UserModel.query.get_or_404(user_id)

            if user.user_id != current_user.user_id:
                return {"error": "unauthorized"}, 403

            # Update the user conditionally
            if "avatar" in content.keys():
                avatar = content["avatar"]
                user.avatar = avatar
                flag_modified(user, "avatar")

            if "email" in content.keys():
                email = content["email"]
                user.email = email
                flag_modified(user, "email")

            if "password" in content.keys():
                # new password, don't bother checking the old password for simplicity
                password = content["password"]
                password_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
                user.password_hash = password_hash
                flag_modified(user, "password_hash")

            db.session.merge(user)
            db.session.flush()
            db.session.commit()
            return user.to_dict()

        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")


@user.route("")
@user.param("username", "The username to search")
class UserList(Resource):
    @user.doc(description=f"Creates a new User")
    @user.expect(create_user_details)
    @user.marshal_with(get_user_details)
    def post(self):
        logging.info("Registering a user")
        content = get_request_json()
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
                password_hash=password_hash,
            )
            logging.info(u)
            db.session.add(u)
            db.session.commit()
            logging.info(f"UserID created: {u}")
            return UserModel.query.filter_by(user_id=u.user_id).first()

        except Exception as e:
            logging.error(e)
            # Previously throws a 500 because of uniqueness constraint insert into DB
            # The error message was correct but this just makes it more explicit!
            api.api.abort(
                403,
                f"Cannot add user due to database constraints (user may be existing already)",
            )

    @user.doc(description=f"Returns a user by search")
    @user.expect(get_user_details)
    def get(self):
        keyword = request.args.get("username")
        logging.info(f"Searching for usernames like: {keyword}")
        search_return = UserModel.query.filter(
            UserModel.username.ilike(f"%{keyword}%")
        ).limit(api.config.Config.RESULT_LIMIT)
        search_users = [l.to_dict() for l in search_return]
        with_is_followed = [
            {**u, "is_followed": is_user_followed(u["user_id"])} for u in search_users
        ]
        return {"users": with_is_followed}


def is_user_followed(user_id: int):
    followers = FollowerModel.query.filter(
        FollowerModel.influencer_user_id == user_id
    ).limit(api.config.Config.RESULT_LIMIT)
    if followers is None:
        return False
    else:
        unpacked = [f for f in followers]
        if len(unpacked) > 0:
            return True
        return False
