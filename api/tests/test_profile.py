import os

import api.tests.utils as u
import requests

API_URL = os.environ["API_URL"]

TEST_USER = {
    "username": "test_user_profile",
    "email": "test_profile@test.com",
    "password": "test",
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
    assert type(response.json()["user_id"]) == int

    # A missing user should return a 404
    url = f"{API_URL}/profiles/unknown"
    response = requests.get(
        url,
    )
    assert response.status_code == 404
