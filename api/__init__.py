from api.config import Config
from flask import Flask
from flask_migrate import Migrate
from flask_jwt import JWT, jwt_required, current_identity
from flask_sqlalchemy import SQLAlchemy

# Init the app
app = Flask(__name__)
app.config.from_object(Config)
app.debug = True
app.config["SECRET_KEY"] = "top secret"
app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}

# Migrate DB
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# CORS
import flask_cors
cors = flask_cors.CORS()
cors.init_app(app)

# Must be loaded later
from api.routes import index_routes, user_routes
import api.models

