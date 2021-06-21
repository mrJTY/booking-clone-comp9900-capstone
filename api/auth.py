import logging

from api import db
from api.resources.user import UserModel
from werkzeug.security import safe_str_cmp, generate_password_hash

logging.basicConfig(level=logging.INFO)


def authenticate(username, password):
    logging.info(f"Authenticating user: {username}")
    logging.info("Querying user...")
    user = db.session.query(UserModel).filter_by(username=username).first()
    logging.info(f"Found user: ${user}")

    # FIXME(HP): Hashes are failing auth
    stored_password_hash = user.password_hash.encode("utf-8")
    # provided_password_hash = generate_password_hash(password)

    # TODO(HP): Change the comparison after bug has been fixed
    if user and safe_str_cmp(stored_password_hash, password.encode("utf8")):
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
