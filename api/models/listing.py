import json

from api import db
from api.models.default_listing_image import DEFAULT_LISTING_IMAGE


class ListingModel(db.Model):
    __tablename__ = "listings"
    listing_id = db.Column(db.Integer, primary_key=True)
    listing_name = db.Column(db.Text, unique=True)
    address = db.Column(db.Text)
    category = db.Column(db.Text)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    username = db.Column(db.Text, db.ForeignKey("users.username"), nullable=False)
    listing_image = db.Column(db.Text, nullable=True, default=DEFAULT_LISTING_IMAGE)

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        data = {
            "listing_id": self.listing_id,
            "listing_name": self.listing_name,
            "address": self.address,
            "category": self.category,
            "description": self.description,
            "user_id": self.user_id,
            "username": self.username,
            "listing_image": self.listing_image,
        }
        return data
