import logging
import hashlib

from api.resources.user import UserModel
from flask_login import login_user, logout_user, login_required, current_user
from flask_restplus import Resource, fields
import api
from api.utils.req_handling import *

auth = api.api.namespace("auth", description="Auth operations")

############################
# LOGIN
############################

login_details_request = api.api.model(
    "User",
    {
        "username": fields.String(required=True, description="Username of the user"),
        "password": fields.String(
            required=True, description="The password of the user"
        ),
    },
)


@auth.route("/login")
@auth.response(404, "User not found")
class AuthLogin(Resource):
    @auth.doc(description="Logs a user in")
    @auth.expect(login_details_request)
    def post(self):
        try:
            content = get_request_json()
            username = content["username"]
            password = content["password"]
            # Find the user
            user = UserModel.query.filter_by(username=username).first()

            stored_password_hash = user.password_hash.encode("utf-8").decode("utf-8")
            given_password_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

            # Log the user in
            if stored_password_hash == given_password_hash:
                login_user(user)
                return True
            return False
        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")


@auth.route("/logout")
@auth.response(404, "User not found")
class AuthLogout(Resource):
    @auth.doc(description="Logs a user out")
    def post(self):
        try:
            # Log the user out
            logout_user()
            return True
        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")

# FIXME! This fails
@auth.route("/me")
@auth.response(404, "User not logged in")
class AuthMe(Resource):
    @auth.doc(
        description="Access a protected endpoint and show details of the current user"
    )
    @login_required
    def get(self):
        logging.info(current_user)
        return current_user
