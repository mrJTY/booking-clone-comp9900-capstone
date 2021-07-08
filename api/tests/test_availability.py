import os

import api.tests.utils as u
import requests

API_URL = os.environ["API_URL"]


TEST_AVAILABILITY_USER = {
    "username": "test_availability_user",
    "email": "test_availability@test.com",
    "password": "test123",
}

TEST_LISTING = {
    "listing_name": "Some other coffee shop",
    "address": "Sydney NSW 2000",
    "category": "Coffee Shop",
    "description": "Delicious selection of sandwiches and coffee",
}

TEST_AVAILABILITY = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (9am-10am)
    "start_time": 1625612400,
    "end_time": 1625616000,
    "is_available": True,
}

TEST_2_AVAILABILITY = {
    "listing_id": 5,
    "start_time": 1625616000,
    "end_time": 1625619600,
    "is_available": True,
}


def test_register_user():
    u.register_user(TEST_AVAILABILITY_USER)


def test_create_availability():
    # Login first
    token = u.login_user(TEST_AVAILABILITY_USER)

    # Create a listing
    listing_id = u.create_listing(TEST_LISTING, token)

    # Create an availability
    availability_id = u.create_availability(TEST_AVAILABILITY, listing_id, token)

    # Search for availabilities
    availabilities = u.get_availabilities(listing_id, token)

    # Update availability id if needed
    availability_url = f"{API_URL}/availabilities/{availability_id}"
    response = requests.put(
        availability_url,
        json=TEST_2_AVAILABILITY,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    actual = response.json()
    assert actual["listing_id"] == TEST_2_AVAILABILITY["listing_id"]
    assert actual["start_time"] == TEST_2_AVAILABILITY["start_time"]
    assert actual["end_time"] == TEST_2_AVAILABILITY["end_time"]
    assert actual["is_available"] == TEST_2_AVAILABILITY["is_available"]

    # Test delete
    availability_url = f"{API_URL}/availabilities/{actual['availability_id']}"
    response = requests.delete(availability_url, json=TEST_2_AVAILABILITY)
    assert response.status_code == 204
