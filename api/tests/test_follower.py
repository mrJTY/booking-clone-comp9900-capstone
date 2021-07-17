import os

import api.tests.utils as u
import requests

API_URL = os.environ["API_URL"]

TEST_INFLUENCER_USER = {
    "username": "test_influencer_user",
    "email": "test_influencer@test.com",
    "password": "test",
}

TEST_FOLLOWER_USER = {
    "username": "test_follower_user",
    "email": "test_follower@test.com",
    "password": "test",
}


def test_follow_user():
    # Register some users
    follower_user_id = u.register_user(TEST_FOLLOWER_USER)
    influencer_user_id = u.register_user(TEST_INFLUENCER_USER)

    # Login as the follower
    token = u.login_user(TEST_FOLLOWER_USER)

    # Follow the influencer
    payload = {"influencer_user_id": influencer_user_id}
    follow_response = u.create_follower(payload, token)
    assert follow_response.json()["follower_user_id"] == follower_user_id
