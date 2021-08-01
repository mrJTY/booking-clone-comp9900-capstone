import os

from api.models.default_avatar import DEFAULT_AVATAR
import api.tests.utils as u
import requests

API_URL = os.environ["API_URL"]

TEST_USER = {
    "username": "test_user",
    "email": "test@test.com",
    "password": "test",
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
    assert protected_response.json()["avatar"] == DEFAULT_AVATAR
    assert type(protected_response.json()["avatar"]) == str
    assert protected_response.json()["user_description"] == ""
    assert type(protected_response.json()["user_description"]) == str
    # Nothing booked yet
    assert protected_response.json()["hours_booked"] == 0

    # Logout
    logout_response = requests.post(
        f"{API_URL}/auth/logout",
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    assert logout_response.status_code == 200


def test_userfeed():
    # Login
    token = u.login_user(TEST_USER)

    # Access a protected endpoint
    protected_url = f"{API_URL}/auth/userfeed"
    protected_response = requests.get(
        protected_url,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    assert protected_response.status_code == 200
    # No followers yet
    assert len(protected_response.json()["followers"]) == 0
    # No followees yet
    assert len(protected_response.json()["followees"]) == 0
    # No listings followed yet
    assert len(protected_response.json()["listings"]) == 0


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
    assert actual["users"][0]["is_followed"] == False

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
