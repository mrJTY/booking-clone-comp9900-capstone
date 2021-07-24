import json

from api import db


class UserModel(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    email = db.Column(db.Text, unique=True)
    password_hash = db.Column(db.Text)
    authenticated = db.Column(db.Boolean, default=False)
    avatar = db.Column(db.Text, nullable=True, default=False)

    # See: https://realpython.com/using-flask-login-for-user-management-with-flask/
    def is_active(self):
        """True, as all users are active."""
        return True

    def get_id(self):
        """Return the email address to satisfy Flask-Login's requirements."""
        return self.user_id

    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self.authenticated

    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        data = {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "avatar": self.avatar,
        }
        return data
