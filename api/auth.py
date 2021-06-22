import logging

from api import db
from api.resources.user import UserModel
import hashlib
from werkzeug.security import safe_str_cmp

logging.basicConfig(level=logging.INFO)


def authenticate(username, password):
    logging.info(f"Authenticating user: {username}")
    logging.info("Querying user...")
    user = db.session.query(UserModel).filter_by(username=username).first()
    logging.info(f"Found user: ${user}")
    stored_password_hash = user.password_hash.encode("utf-8").decode("utf-8")
    if user and stored_password_hash == hashlib.sha256(password.encode("utf-8")).hexdigest():
        return user


def identity(payload):
    """
    Flask JWT for confirming identity

    :param payload: Dict with {"exp": ..., "iat": ..., "nbf": ..., "identity": ...}
    :return:
    """
    id = payload["identity"]
    user = db.session.query(UserModel).filter_by(id=id).first()
    return user