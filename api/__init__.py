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

# Flask Login
from flask_login import LoginManager

login_manager = LoginManager()
login_manager.init_app(app)

# CORS
import flask_cors

cors = flask_cors.CORS()
cors.init_app(app)
