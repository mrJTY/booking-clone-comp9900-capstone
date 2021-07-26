import hashlib
import logging

from api import db
from api.models.booking import BookingModel
from api.models.follower import FollowerModel
from api.models.listing import ListingModel
from api.models.rating import RatingModel
from api.models.user import UserModel
from api.resources.listing import calculate_avg_rating, get_ratings
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource
from flask_restplus import Resource, fields
from sqlalchemy.orm.attributes import flag_modified
import api
import numpy as np

profile = api.api.namespace("profiles", description="User operations")


@profile.route("/<username>")
@profile.param("username", "The username of the user")
@profile.response(404, "user not found")
class Profile(Resource):
    @profile.doc(description=f"Returns the profile of a given username")
    def get(self, username):
        u = UserModel.query.filter(UserModel.username == username).first()
        if u:
            followers = find_followers(u.user_id)
            followees = find_followees(u.user_id)
            is_followed = True if len(followers) > 0 else False
            user = u.to_dict()
            out = {
                **user,
                "followers": followers,
                "followees": followees,
                "is_followed": is_followed,
            }
            return out
        else:
            return {"error": "user not found"}, 404

    @profile.doc(description=f"Allows one to update an avatar")
    def put(self, username):
        logging.info(f"Updating profile picture of {username}")
        content = get_request_json()
        avatar = content["avatar"]
        email = content["email"]
        # new password, don't bother checking the old password for simplicity
        password = content["password"]
        password_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

        # Fetch the user
        user = UserModel.query.filter(UserModel.username == username).first()

        if user.user_id != current_user.user_id:
            return {"error": "unauthorized"}, 403

        # Update the user
        user.avatar = avatar
        user.email = email
        user.password_hash = password_hash
        flag_modified(user, "avatar")
        flag_modified(user, "email")
        flag_modified(user, "password_hash")
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


def find_followees(follower_user_id: int):
    query = (
        db.session.query(UserModel, FollowerModel)
        .filter(FollowerModel.follower_id == follower_user_id)
        .limit(api.config.Config.RESULT_LIMIT)
    )
    unpacked_query = [q for q in query]
    followers = [{**u.to_dict()} for (u, f) in unpacked_query]
    return followers


def find_followers(influencer_user_id: int):
    query = (
        db.session.query(UserModel, FollowerModel)
        .filter(FollowerModel.influencer_user_id == influencer_user_id)
        .limit(api.config.Config.RESULT_LIMIT)
    )
    unpacked_query = [q for q in query]
    followers = [{**u.to_dict()} for (u, f) in unpacked_query]
    return followers
