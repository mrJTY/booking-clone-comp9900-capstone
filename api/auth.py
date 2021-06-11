from werkzeug.security import safe_str_cmp
from flask_jwt import JWT, jwt_required, current_identity
from api import app
from api.models.user import  User

# TODO: use database
users = [
    User(1, 'user1', 'abcxyz', 'foo@bar.com'),
    User(2, 'user2', 'abcxyz', 'foo2@bar.com'),
]

username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}


def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user


def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)


jwt = JWT(app, authenticate, identity)
