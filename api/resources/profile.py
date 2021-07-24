import logging
import api
from api.models.user import UserModel
from api.models.listing import ListingModel
from api.models.rating import RatingModel
from api.models.booking import BookingModel
from flask_restplus import Resource
import api
from flask_login import current_user
from flask_restplus import Resource, fields
from sqlalchemy.orm.attributes import flag_modified
from api.utils.req_handling import *
from api import db
import numpy as np
from api.resources.listing import calculate_avg_rating, get_ratings

profile = api.api.namespace("profiles", description="User operations")


@profile.route("/<username>")
@profile.param("username", "The username of the user")
@profile.response(404, "user not found")
class Profile(Resource):
    @profile.doc(description=f"Returns the profile of a given username")
    def get(self, username):
        u = UserModel.query.filter(UserModel.username == username).first()
        if u:
            return u.to_dict()
        else:
            return {"error": "user not found"}, 404

    @profile.doc(description=f"Allows one to update an avatar")
    def put(self, username):
        logging.info(f"Updating profile picture of {username}")
        # get listing id
        content = get_request_json()
        user = UserModel.query.filter(UserModel.username == username).first()
        user.avatar = content["avatar"]
        flag_modified(user, "avatar")
        db.session.merge(user)
        db.session.flush()
        db.session.commit()
        return user.to_dict()


@profile.route("/<username>/listings")
class Listings(Resource):
    @profile.doc(description=f"Fetch users listings given some username provided")
    def get(self, username):
        my_listings = ListingModel.query.filter(
            ListingModel.username == username
        ).limit(api.config.Config.RESULT_LIMIT)

        my_listings = [l.to_dict() for l in my_listings]
        # Calculate avg ratings and fetch ratings for that listing
        out = [
            {
                **l,
                "avg_rating": calculate_avg_rating(l["listing_id"]),
                "ratings": get_ratings(l["listing_id"]),
            }
            for l in my_listings
        ]
        return {"mylistings": out}
