from api import db
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource, fields
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import or_
from api.resources.listing import ListingModel
import api
import json
import logging

# This is just an example
from api.recommendation.model import Model

recommendation = api.api.namespace(
    "recommendations", description="Recommendation operations"
)

RESULT_LIMIT = 20


@recommendation.route("/listings")
@recommendation.response(404, "recommendation not found")
class RecommendationListings(Resource):
    @recommendation.doc(description="Placeholder recommendations for listings")
    def get(self):
        user_id = current_user.user_id
        username = current_user.username
        logging.info(f"User {username} is requesting a recommendation for listings...")

        # Simple example just returns listings owned by the user
        listings = ListingModel.query.filter(ListingModel.user_id == user_id).limit(
            RESULT_LIMIT
        )

        # Some dummy model in api.recommendation.model
        model = Model()
        # You'd probably want to pretrain it before, don't do it on the fly...
        # don't train it here!
        # model.train()
        predictions = model.predict(listings)

        # Return as json
        search_recommendations = [p.to_dict() for p in predictions]
        return {"listings": search_recommendations}
