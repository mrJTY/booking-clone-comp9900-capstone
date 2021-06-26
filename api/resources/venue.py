import logging
import json

from api import db
from api.utils.req_handling import *
from flask_restplus import Resource, fields
import api

venue = api.api.namespace("venues", description="Venue operations")

venue_details = api.api.model(
    "Venue",
    {
        "venue_id": fields.Integer(required=True, description="The ID of the venue"),
        "venue_name": fields.String(required=True, description="The name of the venue"),
        "address": fields.String(required=True, description="The address of the venue"),
        "category": fields.String(required=True, description="The category"),
        "description": fields.String(required=True, description="The description"),
    },
)


class VenueModel(db.Model):
    venue_id = db.Column(db.Integer, primary_key=True)
    venue_name = db.Column(db.Text, unique=True)
    address = db.Column(db.Text, unique=True)
    category = db.Column(db.Text, unique=True)
    description = db.Column(db.Text, unique=True)

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        data = {
            "venue_id": self.venue_id,
            "venue_name": self.venue_name,
            "address": self.address,
            "category": self.category,
            "description": self.description,
        }
        return data


# See example: https://github.com/noirbizarre/flask-restplus/blob/master/examples/todo.py
@venue.route("/<int:venue_id>")
@venue.param("venue_id", "The venue identifier")
@venue.response(404, "venue not found")
class Venue(Resource):
    @venue.doc(description=f"venue_id must be provided")
    @venue.marshal_with(venue_details)
    def get(self, venue_id):
        logging.info(f"Getting venue {venue_id}")
        return VenueModel.query.get_or_404(venue_id).to_dict()

    @venue.doc(description=f"venue_id must be provided")
    @venue.marshal_with(venue_details)
    def delete(self, venue_id):
        logging.info(f"Deleting venue {venue_id}")
        venue = VenueModel.query.get_or_404(venue_id)
        db.session.delete(venue)
        db.session.commit()
        return venue

    #HP: Updating a venue
    #Need to see what changes are required in this
    #@venue.doc(description=f"venue_id must be provided")
    #def put(self, venue_id):
    #    logging.info(f"Updating venue {venue_id}")

        #get venue id
    #    get_venue = VenueModel.query.get_or_404(venue_id)
    #    #update the venue data
    #    get_venue.venue_name = request.json
    #    pass

    # TODO: Update a venue
    # def put(self, todo_id):
    #     args = parser.parse_args()
    #     task = {'task': args['task']}
    #     TODOS[todo_id] = task
    #     return task, 201


@venue.route("")
class VenueList(Resource):
    @venue.doc(description=f"Creates a new venue")
    @venue.expect(venue_details)
    @venue.marshal_with(venue_details)
    def post(self):
        logging.info("Registering a venue")
        content = get_request_json()
        if request.method == "POST":
            try:
                # Receive contents from request
                logging.info(content)
                venue_name = content["venue_name"]
                address = content["address"]
                description = content["description"]
                category = content["category"]
                v = VenueModel(
                    venue_name=venue_name,
                    address=address,
                    description=description,
                    category=category,
                )
                db.session.add(v)
                db.session.commit()
                venue_id = v.venue_id
                logging.info(f"venue_id created: {venue_id}")
                return VenueModel.query.get_or_404(venue_id).to_dict()

            except Exception as e:
                logging.error(e)
                api.api.abort(500, f"{e}")
