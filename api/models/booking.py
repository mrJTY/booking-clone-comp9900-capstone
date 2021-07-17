import json

from api import db


class BookingModel(db.Model):
    __tablename__ = "bookings"
    booking_id = db.Column(db.Text, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    listing_id = db.Column(
        db.Integer, db.ForeignKey("listings.listing_id"), nullable=False
    )
    availability_id = db.Column(
        db.Integer, db.ForeignKey("availabilities.availability_id"), nullable=False
    )

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        data = {
            "booking_id": self.booking_id,
            "user_id": self.user_id,
            "listing_id": self.listing_id,
            "availability_id": self.availability_id,
        }
        return data
