import json

from api import db


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
