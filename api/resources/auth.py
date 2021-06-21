from flask_jwt import jwt_required, current_identity
from api import app


@app.route("/current_user")
@jwt_required()
def current_user():
    return f"{current_identity}"
