import api
import logging

from api import db
from api.models.booking import BookingModel
from api.models.listing import ListingModel
from api.models.rating import RatingModel
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource, fields
from sqlalchemy import or_
from sqlalchemy.orm.attributes import flag_modified
import numpy as np

listing = api.api.namespace("listings", description="Listing operations")

listing_details = api.api.model(
    "Listing",
    {
        "listing_id": fields.Integer(
            required=True, description="The ID of the listing"
        ),
        "listing_name": fields.String(
            required=True, description="The name of the listing"
        ),
        "address": fields.String(
            required=True, description="The address of the listing"
        ),
        "category": fields.String(required=True, description="The category"),
        "description": fields.String(required=True, description="The description"),
        "user_id": fields.Integer(
            required=True, description="The owner of the listing"
        ),
        "username": fields.String(required=True, description="Username of the user"),
        "avg_rating": fields.Float(
            required=False, description="Avg rating for the listing"
        ),
        # FIXME(justin): Getting a random error with this: cls_or_instance not defined???
        # "ratings": fields.List(
        #     required=False, description="The list of Rating objects attached to this Listing", cls_or_instance=
        # ),
    },
)


# See example: https://github.com/noirbizarre/flask-restplus/blob/master/examples/todo.py
@listing.route("/<int:listing_id>")
@listing.param("listing_id", "The listing identifier")
@listing.response(404, "listing not found")
class Listing(Resource):
    @listing.doc(description=f"listing_id must be provided")
    # @listing.marshal_with(listing_details)
    def get(self, listing_id):
        logging.info(f"Getting listing {listing_id}")
        # Calculate avg ratings
        listing_dict = ListingModel.query.get_or_404(listing_id).to_dict()
        out = {
            **listing_dict,
            "avg_rating": calculate_avg_rating(listing_dict["listing_id"]),
            "ratings": get_ratings(listing_dict["listing_id"]),
        }
        return out

    @listing.doc(description=f"listing_id must be provided")
    @listing.marshal_with(listing_details)
    def delete(self, listing_id):
        logging.info(f"Deleting listing {listing_id}")
        listing = ListingModel.query.filter(ListingModel.listing_id == listing_id)
        listing.delete()
        db.session.commit()
        return listing

    # Need to see what updates are made
    @listing.doc(description=f"listing_id must be provided")
    # @listing.marshal_with(listing_details)
    def put(self, listing_id):
        logging.info(f"Updating listing {listing_id}")
        # get listing id
        content = get_request_json()
        listing = ListingModel.query.get_or_404(listing_id)
        # update the listing data
        listing.listing_name = content["listing_name"]
        listing.address = content["address"]
        listing.category = content["category"]
        listing.description = content["description"]
        listing.user_id = current_user.user_id
        listing.username = current_user.username
        flag_modified(listing, "description")
        db.session.merge(listing)
        db.session.flush()
        db.session.commit()
        return {**listing.to_dict(), "avg_rating": 0}


@listing.route("")
@listing.param("search_query", "Keyword resource search")
class ListingList(Resource):
    @listing.doc(description=f"Creates a new listing")
    @listing.expect(listing_details)
    # @listing.marshal_with(listing_details)
    def post(self):
        logging.info("Registering a listing")
        content = get_request_json()
        try:
            # Receive contents from request
            logging.info(content)
            listing_name = content["listing_name"]
            address = content["address"]
            description = content["description"]
            category = content["category"]
            v = ListingModel(
                listing_name=listing_name,
                address=address,
                description=description,
                category=category,
                user_id=current_user.user_id,
                username=current_user.username,
            )
            db.session.add(v)
            db.session.commit()
            listing_id = v.listing_id
            logging.info(f"listing_id created: {listing_id}")
            return {
                **ListingModel.query.get_or_404(listing_id).to_dict(),
                "avg_rating": 0,
            }

        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")

    @listing.doc(description=f"Returns a listing by search")
    @listing.expect(listing_details)
    def get(self):
        keyword = request.args.get("search_query")
        logging.info(f"Searching for {keyword}")
        search_listings = ListingModel.query.filter(
            or_(
                ListingModel.listing_name.ilike(f"%{keyword}%"),
                ListingModel.description.ilike(f"%{keyword}%"),
                ListingModel.address.ilike(f"%{keyword}%"),
            )
        ).limit(api.config.Config.RESULT_LIMIT)
        # Calculate avg ratings
        search_listings = [l.to_dict() for l in search_listings]
        # Calculate avg ratings and fetch ratings for that listing
        out = [
            {
                **l,
                "avg_rating": calculate_avg_rating(l["listing_id"]),
                "ratings": get_ratings(l["listing_id"]),
            }
            for l in search_listings
        ]
        return {"listings": out}


# TODO: Paginate this and add docs
@listing.route("/mylistings")
class MyListings(Resource):
    @listing.doc(description=f"Fetch my listings")
    def get(self):
        my_listings = ListingModel.query.filter_by(user_id=current_user.user_id).limit(
            api.config.Config.RESULT_LIMIT
        )

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


def get_ratings(listing_id):
    # Pull the ratinsg for this listing
    # Find out the booking ids
    my_bookings = BookingModel.query.filter_by(listing_id=listing_id).all()
    my_ratings = []
    for b in my_bookings:
        booking_id = b.to_dict()["booking_id"]
        my_ratings_in_booking = get_ratings_with_username(booking_id)
        for r in my_ratings_in_booking:
            my_ratings.append(r)
    return my_ratings


def get_ratings_with_username(booking_id):
    with api.engine.connect() as conn:
        query = f"""
            select
                r.*,
                u.username
            from ratings as r
            join users as u
                on u.user_id = r.user_id 
            where r.booking_id = '{booking_id}'
            """
        results = conn.execute(query)
        my_ratings_in_booking = [dict(r) for r in results]
        return my_ratings_in_booking
