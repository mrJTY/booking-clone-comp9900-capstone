import logging

from api import db
from api.models.follower import FollowerModel
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource, fields
import api

follower = api.api.namespace("followers", description="follower operations")

# You don't need to provide your follower_user_id when following a new user
# Backend knows who you are as current_user.user_id
create_follower_details = api.api.model(
    "Resource",
    {
        "influencer_user_id": fields.Integer(
            required=True, description="The user_id to follow"
        ),
    },
)

get_follower_details = api.api.model(
    "follower",
    {
        "follower_id": fields.Integer(required=True, description="The follower_id"),
        "influencer_user_id": fields.Integer(
            required=True, description="The user_id to follow"
        ),
        "follower_user_id": fields.Integer(
            required=True, description="The user_id of the follower"
        ),
    },
)


@follower.route("/<int:follower_id>")
@follower.param("follower_id", "The follower identifier")
@follower.response(404, "follower not found")
class Follower(Resource):
    @follower.doc(description=f"follower_id must be provided")
    @follower.marshal_with(get_follower_details)
    def get(self, follower_id):
        logging.info(f"Getting follower {follower_id}")
        return FollowerModel.query.get_or_404(follower_id).to_dict()

    @follower.doc(description=f"follower_id must be provided")
    @follower.marshal_with(get_follower_details)
    def delete(self, follower_id):
        logging.info(f"Deleting follower {follower_id}")
        b = FollowerModel.query.filter(FollowerModel.follower_id == follower_id)
        b.delete()
        db.session.commit()
        return b, 204


@follower.route("/follow")
class FollowerList(Resource):
    @follower.doc(
        description="As a follower, follow an influencer user by passing the influencer's user id in the request"
    )
    @follower.expect(create_follower_details)
    @follower.marshal_with(get_follower_details)
    def post(self):
        content = get_request_json()
        try:
            # I am the follower who called /followers/follow
            follower_user_id = current_user.user_id
            # Influencer id must be sent as part of the json request
            influencer_user_id = content["influencer_user_id"]
            f = FollowerModel(
                influencer_user_id=influencer_user_id, follower_user_id=follower_user_id
            )
            db.session.add(f)
            db.session.commit()
            return FollowerModel.query.get_or_404(f.follower_id).to_dict()

        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")
