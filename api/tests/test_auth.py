import os

import api.tests.utils as u
import requests

API_URL = os.environ["API_URL"]

TEST_USER = {
    "username": "test_user",
    "email": "test@test.com",
    "password": "test",
    "hours_booked": 0,
}


def test_register_user():
    u.register_user(TEST_USER)


def test_authenticate():
    # Login
    token = u.login_user(TEST_USER)

    # Access a protected endpoint
    protected_url = f"{API_URL}/auth/me"
    protected_response = requests.get(
        protected_url,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    assert protected_response.status_code == 200
    assert protected_response.json()["username"] == TEST_USER["username"]
    assert protected_response.json()["email"] == TEST_USER["email"]
    assert protected_response.json()["hours_booked"] == TEST_USER["hours_booked"]

    # Logout
    logout_response = requests.post(
        f"{API_URL}/auth/logout",
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    assert logout_response.status_code == 200


def test_search_user():
    token = u.login_user(TEST_USER)
    # Search for users - No matching returns
    search_url = f"{API_URL}/users?username=xXZealXx"
    search_response = requests.get(
        search_url,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    actual = search_response.json()
    assert search_response.status_code == 200
    assert "users" in actual.keys()

    # Search for users - 1 matching return
    search_url = f"{API_URL}/users?username=Harris"
    search_response = requests.get(
        search_url,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    actual = search_response.json()
    assert search_response.status_code == 200
    assert "users" in actual.keys()
    assert len(actual["users"]) == 1

    # Search for users - 2 matching returns
    search_url = f"{API_URL}/users?username=st"
    search_response = requests.get(
        search_url,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    actual = search_response.json()
    assert search_response.status_code == 200
    assert "users" in actual.keys()
    assert len(actual["users"]) == 3
