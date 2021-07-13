import os

import requests

API_URL = os.environ["API_URL"]


TEST_LISTING = {
    "listing_name": "Recommendation coffee shop",
    "address": "Kensington NSW 2033",
    "category": "Coffee Shop",
    "description": "Delicious selection of sandwiches and coffee",
}

TEST_RECOMMENDATION_USER = {
    "username": "test_recommendation_user",
    "email": "test_recommendation@test.com",
    "password": "test123",
}


def test_register_user():
    url = f"{API_URL}/users"
    response = requests.post(url, json=TEST_RECOMMENDATION_USER)
    actual = response.json()
    expected = {
        "email": TEST_RECOMMENDATION_USER["email"],
        "username": TEST_RECOMMENDATION_USER["username"],
    }
    assert actual["email"] == expected["email"]
    assert actual["username"] == expected["username"]


def test_create_listing():
    # Login first
    login_response = requests.post(
        f"{API_URL}/auth/login",
        json={
            "username": TEST_RECOMMENDATION_USER["username"],
            "password": TEST_RECOMMENDATION_USER["password"],
        },
    )
    assert login_response.status_code == 200
    token = login_response.json()["accessToken"]

    url = f"{API_URL}/listings"
    response = requests.post(
        url,
        json=TEST_LISTING,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    actual = response.json()
    assert actual["listing_name"] == TEST_LISTING["listing_name"]
    assert actual["address"] == TEST_LISTING["address"]
    assert actual["category"] == TEST_LISTING["category"]
    assert actual["description"] == TEST_LISTING["description"]


def test_get_recommendations():
    # Login first
    login_response = requests.post(
        f"{API_URL}/auth/login",
        json={
            "username": TEST_RECOMMENDATION_USER["username"],
            "password": TEST_RECOMMENDATION_USER["password"],
        },
    )
    assert login_response.status_code == 200
    token = login_response.json()["accessToken"]

    # Get recommendations
    url = f"{API_URL}/recommendations/listings"
    recommendations_response = requests.get(
        url,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    assert recommendations_response.status_code == 200
    assert "listings" in recommendations_response.json().keys()
