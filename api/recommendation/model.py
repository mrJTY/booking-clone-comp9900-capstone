from api import db
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource, fields
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import or_
from api.models.listing import ListingModel

# This is just a placeholder
class Model:
    def train(self):
        pass

    def predict(self, input_data):
        return input_data
