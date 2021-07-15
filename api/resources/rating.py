import json
import logging

from api import db
from api.resources.availability import AvailabilityModel
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource, fields
from sqlalchemy.orm.attributes import flag_modified
import api

rating = api.api.namespace("ratings", description="rating operations")

rating_details = api.api.model(
    "rating",
    {
        "rating_id": fields.Integer(required=True, description="The ID of the rating"),
        "booking_id": fields.Integer(
            required=True, description="The booking_id that was rated"
        ),
        "user_id": fields.Integer(
            required=True, description="The user_id who gave the rating"
        ),
        "rating": fields.Integer(
            required=True,
            description="The rating ranges from 1-5. 1 being bad to 5 being really good.",
        ),
        "comment": fields.String(
            required=True,
            description="Free text comment",
        ),
    },
)


class RatingModel(db.Model):
    __tablename__ = "ratings"
    rating_id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(
        db.Integer, db.ForeignKey("bookings.booking_id"), nullable=False
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String)

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        data = {
            "rating_id": self.rating_id,
            "booking_id": self.booking_id,
            "user_id": self.user_id,
            "rating": self.rating,
            "comment": self.comment,
        }
        return data


# See example: https://github.com/noirbizarre/flask-restplus/blob/master/examples/todo.py
@rating.route("/<int:rating_id>")
@rating.param("rating_id", "The rating identifier")
@rating.response(404, "rating not found")
class Rating(Resource):
    @rating.doc(description=f"rating_id must be provided")
    @rating.marshal_with(rating_details)
    def get(self, rating_id):
        logging.info(f"Getting rating {rating_id}")
        return RatingModel.query.get_or_404(rating_id).to_dict()

    @rating.doc(description=f"rating_id must be provided")
    @rating.marshal_with(rating_details)
    def delete(self, rating_id):
        logging.info(f"Deleting rating {rating_id}")
        b = RatingModel.query.filter(RatingModel.rating_id == rating_id)
        b.delete()
        db.session.commit()
        return b, 204

    @rating.doc(description=f"rating_id must be provided")
    @rating.marshal_with(rating_details)
    def put(self, rating_id):
        logging.info(f"Updating rating {rating_id}")
        # get rating id
        content = get_request_json()
        b = RatingModel.query.get_or_404(rating_id)
        # update the rating data - consists of the relevant fields.
        b.booking_id = content["booking_id"]
        b.user_id = current_user.user_id
        b.rating = content["rating"]
        b.comment = content["comment"]
        flag_modified(b, "rating")
        flag_modified(b, "comment")
        db.session.merge(b)
        db.session.flush()
        db.session.commit()
        return b


@rating.route("")
class RatingList(Resource):
    @rating.doc(description=f"Creates a new rating")
    @rating.expect(rating_details)
    @rating.marshal_with(rating_details)
    def post(self):
        content = get_request_json()
        try:
            # Receive contents from request
            logging.info(content)
            booking_id = content["booking_id"]
            user_id = content["user_id"]
            # Calling it rating_value because rating is already taken
            rating_value = content["rating"]
            comment = content["comment"]

            # Create the rating
            r = RatingModel(
                user_id=user_id,
                booking_id=booking_id,
                rating=rating_value,
                comment=comment,
            )
            db.session.add(r)

            # Commit changes to db
            db.session.commit()

            # Return the rating
            rating_id = r.rating_id
            return RatingModel.query.get_or_404(rating_id).to_dict()

        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")


# TODO: Paginate this and add docs
@rating.route("/myratings")
class MyRatings(Resource):
    @rating.doc(description=f"Fetch my ratings")
    def get(self):
        my_ratings = RatingModel.query.filter_by(user_id=current_user.user_id).all()
        my_ratings = [l.to_dict() for l in my_ratings]
        return {"myratings": my_ratings}
