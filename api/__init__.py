from api.config import Config
from flask import Flask
from flask_migrate import Migrate
from flask_jwt import JWT
from flask_sqlalchemy import SQLAlchemy

# Init the app and configs
app = Flask(__name__)
app.config.from_object(Config)
app.debug = True

# Flask Restplus
# https://flask-restplus.readthedocs.io/en/stable/index.html
from flask_restplus import Api

api = Api(app)

# Database
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# CORS
import flask_cors

cors = flask_cors.CORS()
cors.init_app(app)

# JWT for auth
# https://pythonhosted.org/Flask-JWT/
from api.auth import authenticate, identity

jwt = JWT(app, authenticate, identity)
