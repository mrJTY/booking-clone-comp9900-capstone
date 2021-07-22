import json

from api import db


class FollowerModel(db.Model):
    __tablename__ = "followers"
    follower_id = db.Column(db.Integer, primary_key=True)
    influencer_user_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id"), nullable=False
    )
    follower_user_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id"), nullable=False
    )

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        data = {
            "follower_id": self.follower_id,
            "influencer_user_id": self.influencer_user_id,
            "follower_user_id": self.follower_user_id,
        }
        return data
