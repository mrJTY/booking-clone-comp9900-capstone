from datetime import datetime, timedelta
import hashlib
import logging
from api.models.availability import AvailabilityModel
from api.models.booking import BookingModel
from api import db, login_manager
from api.config import Config
from api.resources.user import UserModel
from api.utils.req_handling import *
from flask_login import login_user, logout_user, login_required, current_user
from flask_restplus import Resource, fields
import api
import jwt

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

# start time vs end time
def start_vs_end(end, start):
    interval = round((float(end) - float(start)) / (60.0 * 60.0 * 1000.0))
    return int(interval)


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
                user.authenticated = True
                db.session.add(user)
                db.session.commit()
                # Flask-Login logs the user in the db
                login_user(user, remember=True)
                # Generate token to pass back to client with JWT
                # https://medium.com/@apcelent/json-web-token-tutorial-with-example-in-python-df7dda73b579
                iat = datetime.utcnow()
                exp = datetime.utcnow() + timedelta(
                    minutes=Config.JWT_ACCESS_LIFESPAN["minutes"]
                )
                token = jwt.encode(
                    {
                        "sub": user.username,
                        "iat": iat,
                        "exp": exp,
                    },
                    Config.SECRET_KEY,
                    algorithm="HS256",
                )
                # Return the access token
                return {
                    "accessToken": token.decode("utf-8"),
                }
            # If wrong password, throw 403
            return api.api.abort(403, "Incorrect user credentials")
        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")


@auth.route("/logout")
@auth.response(404, "User not found")
class AuthLogout(Resource):
    @auth.doc(description="Logs a user out")
    def post(self):
        try:
            user = current_user
            user.authenticated = False
            db.session.add(user)
            db.session.commit()
            logout_user()
            return True
        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")


@auth.route("/me")
@auth.response(404, "User not logged in")
class AuthMe(Resource):
    @auth.doc(
        description="Access a protected endpoint and show details of the current user"
    )
    def get(self):
        try:
            logging.info(current_user)
            get_user_dict = current_user.to_dict()
            # get existing bookings
            list_bookings = BookingModel.query.filter_by(
                user_id=get_user_dict["user_id"]
            ).all()
            list_bookings = [l.to_dict() for l in list_bookings]
            hours_booked = 0
            ##Search through the existing bookings
            for i in range(len(list_bookings)):
                timeslot = AvailabilityModel.query.get_or_404(
                    list_bookings[i]["availability_id"]
                ).to_dict()
                get_interval = start_vs_end(
                    timeslot["end_time"], timeslot["start_time"]
                )
                hours_booked += get_interval
            get_user_dict["hours_booked"] = hours_booked
            return get_user_dict
        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")


# Add a user loader:
# https://www.digitalocean.com/community/tutorials/how-to-add-authentication-to-your-app-with-flask-login
@login_manager.user_loader
def load_user(user_id):
    return UserModel.query.get(user_id)


# Flask login and Flask JWT integration
# https://stackoverflow.com/questions/50856038/using-flask-login-and-flask-jwt-together-in-a-rest-api
@login_manager.request_loader
def load_user_from_request(request):
    # Get the authorization header
    auth_headers = request.headers.get("Authorization", "").split()
    if len(auth_headers) != 2:
        return None
    try:
        token = auth_headers[1]
        # If user found and token not expired, return user
        # Decode JWT
        data = jwt.decode(token, Config.SECRET_KEY)
        # Fetch the username in the JWT
        username = data["sub"]
        user = UserModel.query.filter_by(username=username).first()
        if user:
            return user
    except jwt.ExpiredSignatureError as e:
        logging.error(e)
        return None
    except (jwt.InvalidTokenError, Exception) as e:
        logging.error(e)
        return None
    return None
