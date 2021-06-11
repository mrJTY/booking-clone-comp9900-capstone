from datetime import datetime
import json

from api import db


# A generic user model that might be used by an app powered by flask-praetorian
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    email = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
        }
        return data
