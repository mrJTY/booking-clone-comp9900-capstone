import os

import requests

API_URL = os.environ["API_URL"]

TEST_USER = {"username": "test_user", "email": "test@test.com", "password": "test"}


def test_register_user():
    url = f"{API_URL}/users"
    response = requests.post(url, json=TEST_USER)
    actual = response.json()
    expected = {"email": TEST_USER["email"], "username": TEST_USER["username"]}
    assert actual["email"] == expected["email"]
    assert actual["username"] == expected["username"]


def test_authenticate():
    with requests.session() as s:
        # Access the login endpoint
        login_response = s.post(
            f"{API_URL}/auth/login",
            json={
                "username": TEST_USER["username"],
                "password": TEST_USER["password"],
            },
        )
        assert login_response.status_code == 200
        assert login_response.text == "true\n"


    # FIXME! Use tokens!
    protected_url = f"{API_URL}/auth/me"
    protected_response = requests.get(
        protected_url,
        headers={
            "Authorization": f"Password {TEST_USER['password']}",
            "Username": TEST_USER["username"],
        },
    )
    print(protected_response.text)
    assert protected_response.status_code == 200

    # TODO: logout
