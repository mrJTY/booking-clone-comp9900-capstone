import os

import requests

API_URL = os.environ["API_URL"]


TEST_VENUE = {
    "venue_name": "Coffee On Campus",
    "address": "Kensington NSW 2033",
    "category": "Coffee Shop",
    "description": "Delicious selection of sandwiches and coffee",
}
TEST_2_VENUE = {
    "venue_name": "Coffee On Campus",
    "address": "Kensington NSW 2033",
    "category": "Coffee Shop",
    "description": "Great way to get coffee at UNSW",
}

TEST_VENUE_USER = {
    "username": "test_venue_user",
    "email": "test_venue@test.com",
    "password": "test123",
}


def test_register_user():
    url = f"{API_URL}/users"
    response = requests.post(url, json=TEST_VENUE_USER)
    actual = response.json()
    expected = {
        "email": TEST_VENUE_USER["email"],
        "username": TEST_VENUE_USER["username"],
    }
    assert actual["email"] == expected["email"]
    assert actual["username"] == expected["username"]


def test_create_venue():

    with requests.session() as s:
        # Login first
        login_response = s.post(
            f"{API_URL}/auth/login",
            json={
                "username": TEST_VENUE_USER["username"],
                "password": TEST_VENUE_USER["password"],
            },
        )
        assert login_response.status_code == 200
        assert login_response.text == "true\n"

        # Create a venue
        url = f"{API_URL}/venues"
        response = s.post(url, json=TEST_VENUE)
        actual = response.json()
        assert actual["venue_name"] == TEST_VENUE["venue_name"]
        assert actual["address"] == TEST_VENUE["address"]
        assert actual["category"] == TEST_VENUE["category"]
        assert actual["description"] == TEST_VENUE["description"]


def test_update_venue():
    with requests.session() as s:
        # Login first
        login_response = s.post(
            f"{API_URL}/auth/login",
            json={
                "username": TEST_VENUE_USER["username"],
                "password": TEST_VENUE_USER["password"],
            },
        )
        assert login_response.status_code == 200

        venue_url = f"{API_URL}/venues/1"
        response = s.put(venue_url, json=TEST_2_VENUE)
        actual = response.json()
        assert actual["venue_name"] == TEST_2_VENUE["venue_name"]
        assert actual["address"] == TEST_2_VENUE["address"]
        assert actual["category"] == TEST_2_VENUE["category"]
        assert actual["description"] == TEST_2_VENUE["description"]


# def test_delete_venue():
#    venue_url = f"{API_URL}/venues/1"
#    response = requests.delete(venue_url,json=TEST_2_VENUE)
#    actual = response.json()
#    print("What is coming from the actual:")
#    print(actual)
#    expected = {""}
#    assert actual == expected
