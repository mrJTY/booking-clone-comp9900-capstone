from api import db
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource, fields
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import or_, func
from api.models.listing import ListingModel
from api.models.booking import BookingModel
from api.models.rating import RatingModel
import pandas as pd
import api
import json
import logging
import numpy as np


# This is just an example
from api.recommendation.model import Model

recommendation = api.api.namespace(
    "recommendations", description="Recommendation operations"
)


def calculate_avg_rating(listing_id):
    # Calculate an avg rating for a listing

    # Find out the booking ids
    my_bookings = BookingModel.query.filter_by(listing_id=listing_id).all()

    my_ratings = []
    for b in my_bookings:
        booking_id = b.to_dict()["booking_id"]
        my_ratings_in_booking = RatingModel.query.filter_by(booking_id=booking_id).all()
        for r in my_ratings_in_booking:
            my_ratings.append(r)

    # Calculate the avg rating
    if len(my_ratings) == 0:
        avg_rating = 0.0
    else:
        ratings_numeric = [r.to_dict()["rating"] for r in my_ratings]
        avg_rating = np.average(ratings_numeric)

    # Round to two significant digits
    rounded_avg = round(avg_rating, 2)
    return rounded_avg


@recommendation.route("/listings")
@recommendation.response(404, "recommendation not found")
class RecommendationListings(Resource):
    @recommendation.doc(description="Placeholder recommendations for listings")
    def get(self):
        user_id = current_user.user_id
        username = current_user.username
        logging.info(f"User {username} is requesting a recommendation for listings...")
        # Do not use existing listings the user has already booked - creating a subquery
        subquery = (
            db.session.query(ListingModel.listing_id)
            .filter(BookingModel.user_id == current_user.user_id)
            .filter(BookingModel.listing_id == ListingModel.listing_id)
        ).subquery()

        not_booked = db.session.query(ListingModel).filter(
            ListingModel.listing_id.not_in(subquery)
        )

        not_booked_listings = [l.to_dict() for l in not_booked]
        out = [
            {**l, "avg_rating": calculate_avg_rating(l["listing_id"])}
            for l in not_booked_listings
        ]

        # Turn this into a dataframe
        listingdata = pd.DataFrame(out)
        past_current_book = (
            db.session.query(
                BookingModel.listing_id, func.count(BookingModel.booking_id)
            )
            .group_by(BookingModel.listing_id)
            .filter(BookingModel.listing_id.not_in(subquery))
            .all()
        )
        book_history = pd.DataFrame(
            past_current_book, columns=["listing_id", "booking_count"]
        )
        data_table = listingdata.merge(
            book_history, left_on="listing_id", right_on="listing_id", how="left"
        )
        data_table["booking_count"] = data_table["booking_count"].fillna(0)

        # Getting the ratings of the resource
        booking_ratings = RatingModel.query.all()
        ratings_list = [l.to_dict() for l in booking_ratings]
        input_ratings_data = pd.DataFrame(ratings_list)
        # Start of the recommender system algorithm - rank
        data_table["score"] = data_table["booking_count"] + data_table["avg_rating"]

        #########################################
        data_table.sort_values(by=["score"], inplace=True, ascending=False)
        top5reco = data_table.head(5)
        top5reco.set_index(["listing_id"], inplace=True)
        top5reco = top5reco[
            [
                "listing_name",
                "address",
                "category",
                "description",
                "user_id",
                "username",
                "avg_rating",
            ]
        ]
        top5recojson = top5reco.to_json(orient="table")
        parsed = json.loads(top5recojson)
        final_recommendations = parsed["data"]

        # Some dummy model in api.recommendation.model
        # model = Model()
        # You'd probably want to pretrain it before, don't do it on the fly...
        # don't train it here!
        # model.train()
        # predictions = model.predict(listings)

        # Return as json
        # search_recommendations = [p.to_dict() for p in predictions]
        return {"listings": final_recommendations}
