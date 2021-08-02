import os

import api.tests.utils as u
from api.models.default_avatar import DEFAULT_AVATAR
import requests

API_URL = os.environ["API_URL"]

TEST_USER = {
    "username": "test_user_profile",
    "email": "test_profile@test.com",
    "password": "test",
    "avatar": "0",
    "user_description": "sport",
}

UPDATE_USER = {
    "username": "test_user_profile",
    "email": "test_profile@test.com",
    "password": "test",
    "avatar": "R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs=",
    "user_description": "sport,entertainment",
}


def test_profile():
    # Register
    u.register_user(TEST_USER)

    # Login
    token = u.login_user(TEST_USER)

    # Access a known username
    url = f"{API_URL}/profiles/{TEST_USER['username']}"
    response = requests.get(
        url,
    )

    assert response.status_code == 200
    assert response.json()["username"] == TEST_USER["username"]
    assert response.json()["email"] == TEST_USER["email"]
    assert response.json()["avatar"] == DEFAULT_AVATAR
    assert response.json()["user_description"] == TEST_USER["user_description"]
    assert type(response.json()["followers"]) == list
    assert type(response.json()["followees"]) == list
    assert type(response.json()["user_id"]) == int

    # update the username with some avatar
    update_url = f"{API_URL}/profiles/{UPDATE_USER['username']}"

    response = requests.put(
        update_url, json=UPDATE_USER, headers={"Authorization": f"JWT {token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == UPDATE_USER["username"]
    assert response.json()["email"] == UPDATE_USER["email"]
    assert type(response.json()["user_id"]) == int
    assert response.json()["avatar"] == UPDATE_USER["avatar"]
    assert response.json()["user_description"] == UPDATE_USER["user_description"]

    # A missing user should return a 404
    url = f"{API_URL}/profiles/unknown"
    response = requests.get(
        url,
    )
    assert response.status_code == 404

    # Now looking for stephanie - who has many listings to reference from
    profile_listings_url = f"{API_URL}/profiles/stephanie/listings"
    listing_response = requests.get(
        profile_listings_url,
    )

    assert listing_response.status_code == 200
    assert "mylistings" in listing_response.json().keys()
