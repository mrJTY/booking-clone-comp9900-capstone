import os

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
    # WATCH OUT for the format!
    "start_time": "2021-07-01T14:00:00+00:00",
    "end_time": "2021-07-01T15:00:00+00:00",
}


def test_register_user():
    url = f"{API_URL}/users"
    response = requests.post(url, json=TEST_AVAILABILITY_USER)
    actual = response.json()
    expected = {
        "email": TEST_AVAILABILITY_USER["email"],
        "username": TEST_AVAILABILITY_USER["username"],
    }
    assert actual["email"] == expected["email"]
    assert actual["username"] == expected["username"]


def test_create_availability():
    # Login first
    login_response = requests.post(
        f"{API_URL}/auth/login",
        json={
            "username": TEST_AVAILABILITY_USER["username"],
            "password": TEST_AVAILABILITY_USER["password"],
        },
    )
    assert login_response.status_code == 200
    token = login_response.json()["accessToken"]

    # Create a listing
    url = f"{API_URL}/listings"
    create_listing_response = requests.post(
        url,
        json=TEST_LISTING,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    assert create_listing_response.status_code == 200
    listing_id = create_listing_response.json()["listing_id"]

    # Create an availability
    create_availability_payload = {**TEST_AVAILABILITY, "listing_id": listing_id}
    url = f"{API_URL}/availabilities"
    create_availability_response = requests.post(
        url,
        json=create_availability_payload,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    assert create_availability_response.json()["listing_id"] == listing_id
    assert (
        create_availability_response.json()["start_time"]
        == TEST_AVAILABILITY["start_time"]
    )
    assert (
        create_availability_response.json()["end_time"] == TEST_AVAILABILITY["end_time"]
    )

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
