import logging

from api import app
from api.models.user import User
from flask import jsonify, request, make_response

logging.basicConfig(level=logging.INFO)

@app.route('/')
@app.route('/healthcheck')
def index():
    logging.info("Healthcheck endpoint")
    return make_response(jsonify({"health": "ok"}), 200)
