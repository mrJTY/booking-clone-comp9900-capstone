from flask import Flask
from api.config import Config

# Init the app and configs
app = Flask(__name__)
app.config.from_object(Config)
app.debug = True

# Flask Restplus
# https://flask-restplus.readthedocs.io/en/stable/index.html
from flask_restplus import Api

api = Api(app)

# Database
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# CORS
import flask_cors

cors = flask_cors.CORS()
cors.init_app(app)

# JWT for auth
# https://pythonhosted.org/Flask-JWT/
from api.auth import authenticate, identity
from flask_jwt import JWT
from api.resources.auth import current_user

jwt = JWT(app, authenticate, identity)
