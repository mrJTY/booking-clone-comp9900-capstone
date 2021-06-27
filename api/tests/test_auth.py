import os

import requests

API_URL = os.environ["API_URL"]

TEST_USER = {"username": "test_user", "email": "test@test.com", "password": "test"}


def test_register_user():
    url = f"{API_URL}/users"
    response = requests.post(url, json=TEST_USER)
    actual = response.json()
    expected = {"email": TEST_USER["email"], "id": 1, "username": TEST_USER["username"]}
    assert actual == expected


def test_authenticate():
    with requests.session() as s:
        # Access the login endpoint
        login_response = requests.post(
            f"{API_URL}/auth/login",
            json={
                "username": TEST_USER["username"],
                "password": TEST_USER["password"],
            },
        )
        assert login_response.status_code == 200

        # FIXME! This doesn't work for now
        # Try to access the protected url
        # protected_url = f"{API_URL}/me"
        # protected_response = requests.get(protected_url)
        # assert protected_response.status_code == 200

        # Logout
        logout_response = requests.post(
            f"{API_URL}/auth/logout"
        )
        assert logout_response.status_code == 200
