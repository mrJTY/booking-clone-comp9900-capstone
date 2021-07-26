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


TEST_LISTING = {
    "listing_name": "Follow me coffee",
    "address": "Some address 2033",
    "category": "enterTAinmeNT",
    "description": "Follow me on a coffee date",
}


def test_follow_user():
    # Register some users
    follower_user_id = u.register_user(TEST_FOLLOWER_USER)
    influencer_user_id = u.register_user(TEST_INFLUENCER_USER)

    # Login as the follower
    influencer_token = u.login_user(TEST_INFLUENCER_USER)
    follower_token = u.login_user(TEST_FOLLOWER_USER)

    # Influencer creates a listing
    listing_id = u.create_listing(TEST_LISTING, influencer_token)

    # Follow the influencer
    payload = {"influencer_user_id": influencer_user_id}
    follow_response = u.create_follower(payload, follower_token)
    assert follow_response.json()["follower_user_id"] == follower_user_id
    follow_id = follow_response.json()["follower_id"]
    follow_url = f"{API_URL}/followers/{follow_id}"

    # Test is followed
    is_followed_response = requests.get(
        url=f"{API_URL}/users/{influencer_user_id}",
        headers={
            "Authorization": f"JWT {influencer_token}",
        },
    )
    assert is_followed_response.json()["is_followed"] == True

    # Follower's userfeed must include the influencer's listing_id
    userfeed_response = requests.get(
        f"{API_URL}/auth/userfeed",
        headers={
            "Authorization": f"JWT {follower_token}",
        },
    )
    assert listing_id == userfeed_response.json()["listings"][0]["listing_id"]

    # Test delete
    delete_response = requests.delete(follow_url)
    assert delete_response.status_code == 204
