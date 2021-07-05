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
    # Fill this later once you create a listing
    "listing_id": None,
    # Unix Epoch time
    "start_time": 1625214000,
    "end_time": 162521500,
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
    avaibilities = u.get_availabilities(listing_id, token)

    # TODO(Saksham/Harris): test update and delete
    # availability_url = f"{API_URL}/availabilities/{actual['availability_id']}"
    # response = requests.put(
    #     availability_url,
    #     json=TEST_2_AVAILABILITY,
    #     headers={
    #         "Authorization": f"JWT {token}",
    #     },
    # )
    # actual = response.json()
    # assert actual["availability_name"] == TEST_2_AVAILABILITY["availability_name"]
    # assert actual["address"] == TEST_2_AVAILABILITY["address"]
    # assert actual["category"] == TEST_2_AVAILABILITY["category"]
    # assert actual["description"] == TEST_2_AVAILABILITY["description"]
    #
    # # Test delete
    # availability_url = f"{API_URL}/availabilitys/{actual['availability_id']}"
    # response = requests.delete(availability_url, json=TEST_2_AVAILABILITY)
    # assert response.status_code == 200
