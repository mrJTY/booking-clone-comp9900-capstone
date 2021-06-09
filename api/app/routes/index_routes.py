import logging

from app import app
from app import db
from app.models.user import User
from flask import jsonify, request

logging.basicConfig(level=logging.INFO)

@app.route('/')
@app.route('/index')
def index():
    logging.info("hello!")
    return "Hello, World!"
