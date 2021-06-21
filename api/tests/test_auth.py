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
    auth_url = f"{API_URL}/auth"
    auth_response = requests.post(
        auth_url,
        json={
            "username": TEST_USER["username"],
            "password": TEST_USER["password"],
        },
    )
    access_token = auth_response.json()["access_token"]
    # # Try to access the protected url
    protected_url = f"{API_URL}/current_user"
    headers = {"Authorization": f"JWT {access_token}"}
    response = requests.get(protected_url, headers=headers)
    assert response.status_code == 200
