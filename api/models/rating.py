import json

from api import db


class RatingModel(db.Model):
    __tablename__ = "ratings"
    rating_id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(
        db.Text, db.ForeignKey("bookings.booking_id"), nullable=False
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
