import logging

from werkzeug.security import safe_str_cmp
from api.models.user import User
from api import db

logging.basicConfig(level=logging.INFO)

def authenticate(username, password):
    logging.info(f"Authenticating user: {username}")
    logging.info("Querying user...")
    user = db.session\
        .query(User)\
        .filter_by(username=username)\
        .first()
    logging.info(f"Found user: ${user}")

    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user


def identity(payload):
    """
    Flask JWT for confirming identity

    :param payload: Dict with {"exp": ..., "iat": ..., "nbf": ..., "identity": ...}
    :return:
    """
    id = payload['identity']
    user = db.session \
        .query(User) \
        .filter_by(id=id) \
        .first()
    return user


