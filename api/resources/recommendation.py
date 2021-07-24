import json
import logging

from api import db
from api.models.booking import BookingModel
from api.models.listing import ListingModel
from api.models.rating import RatingModel
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource
from sqlalchemy import func
import api
import numpy as np
import pandas as pd
from api.recommendation.top_rated_listings import get_top_rated_listings
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

sid = SentimentIntensityAnalyzer()


recommendation = api.api.namespace(
    "recommendations", description="Recommendation operations"
)


@recommendation.route("/listings")
@recommendation.response(404, "recommendation not found")
class RecommendationListings(Resource):
    @recommendation.doc(description="Placeholder recommendations for listings")
    def get(self):
        user_id = current_user.user_id
        username = current_user.username
        logging.info(f"User {username} is requesting a recommendation for listings...")

        # get all bookings
        all_bookings = BookingModel.query.all()
        all_bookings = [l.to_dict() for l in all_bookings]
        all_bookings = pd.DataFrame(all_bookings)

        # get all listings
        all_listings = ListingModel.query.all()
        all_listings = [l.to_dict() for l in all_listings]
        all_listings = pd.DataFrame(all_listings)

        # get all ratings
        all_ratings = RatingModel.query.all()
        all_ratings = [l.to_dict() for l in all_ratings]
        all_ratings = pd.DataFrame(all_ratings)

        # get all bookings made by current user
        my_bookings = all_bookings[all_bookings["user_id"] == user_id]

        # join to get which categories current user has booked
        my_bookings = my_bookings.merge(
            all_listings, left_on="listing_id", right_on="listing_id", how="left"
        )

        # count how many of each category current user has booked, and store in dictionary
        my_bookings = my_bookings.groupby(["category"]).count()
        my_bookings = my_bookings.reset_index()
        my_bookings = my_bookings[["category", "booking_id"]]
        my_bookings.columns = ["category", "count_categories"]

        # get sentiment from each rating
        sent_arr = []
        for i, r in all_ratings.iterrows():
            comment = r[4]
            comment = comment.lower()

            sentiment = sid.polarity_scores(comment)
            sent_arr.append(sentiment["compound"])

        all_ratings["sentiment"] = sent_arr

        # get all available bookings (remove bookings made by current user)
        avail_bookings = all_listings[(all_listings["user_id"] != user_id)]

        # merge mybookings with available bookings to get number of times current user has booked each category
        avail_bookings = avail_bookings.merge(
            my_bookings, left_on="category", right_on="category", how="left"
        )

        # merge ratings with all bookings to get listing id. Get average ratings and sentiments for each rating/booking
        all_ratings = all_bookings.merge(
            all_ratings, left_on="booking_id", right_on="booking_id", how="left"
        )
        all_ratings = all_ratings[["listing_id", "rating", "sentiment"]]
        all_ratings = all_ratings.dropna()
        all_ratings = all_ratings.groupby(["listing_id"]).mean()
        all_ratings = all_ratings.reset_index()

        # merge all_ratings with available bookings to get average rating/sentiment data of each venue
        avail_bookings = avail_bookings.merge(
            all_ratings, left_on="listing_id", right_on="listing_id", how="left"
        )

        # fill all na's with 0
        avail_bookings = avail_bookings.fillna(0)

        # sort by #times category has been booked by current user, then rating, then sentiment
        avail_bookings.sort_values(
            by=["count_categories", "rating", "sentiment"],
            inplace=True,
            ascending=False,
        )
        avail_bookings = avail_bookings.rename(columns={"rating": "avg_rating"})

        top5reco = avail_bookings.head(5)
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
        # get top 5 recommendations
        top5recojson = top5reco.to_json(orient="table")
        parsed = json.loads(top5recojson)
        final_recommendations = parsed["data"]

        # Return as json
        return {"listings": final_recommendations}


@recommendation.route("/top_5_rated_listings")
@recommendation.response(404, "recommendation not found")
class Top5RatedListings(Resource):
    @recommendation.doc(description="Returns the top 5 avg rated listings")
    def get(self):
        out = get_top_rated_listings(5)
        return out
