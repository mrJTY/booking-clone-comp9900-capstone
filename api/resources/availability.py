import json
import logging

from api import db
from api.resources.listing import ListingModel
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource, fields
from sqlalchemy.orm.attributes import flag_modified
import api

availability = api.api.namespace(
    "availabilities", description="availability operations"
)

availability_details = api.api.model(
    "availability",
    {
        "availability_id": fields.Integer(
            required=True, description="The ID of the availability"
        ),
        "listing_id": fields.Integer(required=True, description="The listing id"),
        "start_time": fields.Integer(
            required=True,
            description="The start time of the availability in Unix epoch time",
        ),
        "end_time": fields.Integer(
            required=True,
            description="The end time of the availability in Unix epoch time",
        ),
    },
)


class AvailabilityModel(db.Model):
    __tablename__ = "availabilities"
    availability_id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(
        db.Integer, db.ForeignKey("listings.listing_id"), nullable=False
    )
    # Store them in Unix Time
    start_time = db.Column(db.Integer)
    end_time = db.Column(db.Integer)
    is_available = db.Column(db.Boolean)

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        data = {
            "availability_id": self.availability_id,
            "listing_id": self.listing_id,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "is_available": self.is_available,
        }
        return data


# See example: https://github.com/noirbizarre/flask-restplus/blob/master/examples/todo.py
@availability.route("/<int:availability_id>")
@availability.param("availability_id", "The availability identifier")
@availability.response(404, "availability not found")
class Availability(Resource):
    @availability.doc(description=f"Gets the availability slot")
    @availability.marshal_with(availability_details)
    def get(self, availability_id):
        logging.info(f"Getting availability {availability_id}")
        a = AvailabilityModel.query.get_or_404(availability_id).to_dict()
        return a

    # TODO(Harris/Saksham): Update & Delete
    # @availability.doc(description=f"availability_id must be provided")
    # @availability.marshal_with(availability_details)
    # def delete(self, availability_id):
    #     logging.info(f"Deleting availability {availability_id}")
    #     a = AvailabilityModel.query.filter(
    #         AvailabilityModel.availability_id == availability_id
    #     )
    #     a.delete()
    #     db.session.commit()
    #     return availability

    # TODO(Harris/Saksham): Update & Delete
    # @availability.doc(description=f"availability_id must be provided")
    # @availability.marshal_with(availability_details)
    # def put(self, availability_id):
    #     logging.info(f"Updating availability {availability_id}")
    #     # get availability id
    #     content = get_request_json()
    #     a = AvailabilityModel.query.get_or_404(availability_id)
    #     # update the availability data
    #     a.listing_id = content["listing_id"]
    #     a.start_time = content["start_time"]
    #     a.end_time = content["end_time"]
    #     flag_modified(a, "listing_id")
    #     db.session.merge(a)
    #     db.session.flush()
    #     db.session.commit()
    #     return a


@availability.route("")
class AvailabilityList(Resource):
    @availability.doc(description=f"Creates a new availability")
    @availability.expect(availability_details)
    @availability.marshal_with(availability_details)
    def post(self):
        logging.info("Registering a availability")
        content = get_request_json()
        try:
            # Receive contents from request
            logging.info(content)
            listing_id = content["listing_id"]

            # Save them in unix time
            start_time = content["start_time"]
            end_time = content["end_time"]

            # You can only create an availability if you own the listing
            listing = ListingModel.query.filter(
                ListingModel.listing_id == listing_id
            ).first()
            if listing is None:
                raise Exception("Listing not found")
            if listing.user_id != current_user.user_id:
                raise Exception("You are not the owner, can't create availability")

            # Continue creating the availability
            a = AvailabilityModel(
                listing_id=listing_id,
                start_time=start_time,
                end_time=end_time,
                is_available=True,
            )
            db.session.add(a)
            db.session.commit()
            availability_id = a.availability_id
            logging.info(f"availability_id created: {availability_id}")

            # Return what you just created
            a = AvailabilityModel.query.get_or_404(availability_id).to_dict()
            return a

        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")

    @availability.doc(
        description=f"Returns a list of availabilities given a listing_id. For example: /availabilities?listing_id=1."
    )
    @availability.param(
        "listing_id", "The listing_id you want to search availabilities for"
    )
    def get(self):
        listing_id = request.args.get("listing_id")
        logging.info(f"Searching for availabilities under listing_id: {listing_id}")
        availabilities = AvailabilityModel.query.filter(
            AvailabilityModel.listing_id == listing_id
        ).all()
        search_results = [a.to_dict() for a in availabilities]
        return {"availabilities": search_results}
