from api.models.user import UserModel
from flask_restplus import Resource
import api

profile = api.api.namespace("profiles", description="User operations")


@profile.route("/<username>")
@profile.param("username", "The username of the user")
class Profile(Resource):
    @profile.doc(description=f"Returns the profile of a given username")
    def get(self, username):
        u = UserModel.query.filter(UserModel.username == username).first()
        if u:
            return u.to_dict()
        else:
            return {"error": "user not found"}, 404
