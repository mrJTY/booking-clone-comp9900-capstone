import os

import requests

API_URL = os.environ["API_URL"]


TEST_LISTING = {
    "listing_name": "Coffee On Campus",
    "address": "Kensington NSW 2033",
    "category": "Coffee Shop",
    "description": "Delicious selection of sandwiches and coffee",
}
TEST_2_LISTING = {
    "listing_name": "Coffee On Campus",
    "address": "Kensington NSW 2033",
    "category": "Coffee Shop",
    "description": "Great way to get coffee at UNSW",
}

TEST_LISTING_USER = {
    "username": "test_listing_user",
    "email": "test_listing@test.com",
    "password": "test123",
}


def test_register_user():
    url = f"{API_URL}/users"
    response = requests.post(url, json=TEST_LISTING_USER)
    actual = response.json()
    expected = {
        "email": TEST_LISTING_USER["email"],
        "username": TEST_LISTING_USER["username"],
    }
    assert actual["email"] == expected["email"]
    assert actual["username"] == expected["username"]


def test_create_listing():

    with requests.session() as s:
        # Login first
        login_response = s.post(
            f"{API_URL}/auth/login",
            json={
                "username": TEST_LISTING_USER["username"],
                "password": TEST_LISTING_USER["password"],
            },
        )
        assert login_response.status_code == 200
        assert login_response.text == "true\n"

        # Create a listing
        url = f"{API_URL}/listings"
        response = s.post(url, json=TEST_LISTING)
        actual = response.json()
        assert actual["listing_name"] == TEST_LISTING["listing_name"]
        assert actual["address"] == TEST_LISTING["address"]
        assert actual["category"] == TEST_LISTING["category"]
        assert actual["description"] == TEST_LISTING["description"]


def test_update_listing():
    with requests.session() as s:
        # Login first
        login_response = s.post(
            f"{API_URL}/auth/login",
            json={
                "username": TEST_LISTING_USER["username"],
                "password": TEST_LISTING_USER["password"],
            },
        )
        assert login_response.status_code == 200

        listing_url = f"{API_URL}/listings/1"
        response = s.put(listing_url, json=TEST_2_LISTING)
        actual = response.json()
        assert actual["listing_name"] == TEST_2_LISTING["listing_name"]
        assert actual["address"] == TEST_2_LISTING["address"]
        assert actual["category"] == TEST_2_LISTING["category"]
        assert actual["description"] == TEST_2_LISTING["description"]


# def test_delete_listing():
#    listing_url = f"{API_URL}/listings/1"
#    response = requests.delete(listing_url,json=TEST_2_LISTING)
#    actual = response.json()
#    print("What is coming from the actual:")
#    print(actual)
#    expected = {""}
#    assert actual == expected
