import os
from datetime import datetime, timedelta
import api.tests.utils as u
import requests

API_URL = os.environ["API_URL"]


TEST_AVAILABILITY_USER = {
    "username": "test_availability_user",
    "email": "test_availability@test.com",
    "password": "test123",
    "user_description": "sport",
}

TEST_LISTING = {
    "listing_name": "Some other coffee shop",
    "address": "Sydney NSW 2000",
    "category": "Coffee Shop",
    "description": "Delicious selection of sandwiches and coffee",
}

now = datetime.now().strftime("%Y-%m-%d-00:00:00")
current_date = datetime.strptime(now, "%Y-%m-%d-00:00:00")

avaliability_date = current_date + timedelta(2)
avaliability_date_start = avaliability_date.strftime("%Y-%m-%d 09:00:00")
avaliability_date_finish = avaliability_date.strftime("%Y-%m-%d 10:00:00")

avaliability_date_start_ue = datetime.strptime(
    avaliability_date_start, "%Y-%m-%d %H:%M:%S"
).strftime("%s")
avaliability_date_finish_ue = datetime.strptime(
    avaliability_date_finish, "%Y-%m-%d %H:%M:%S"
).strftime("%s")

TEST_AVAILABILITY = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (9am-10am)
    "start_time": int(avaliability_date_start_ue) * 1000,
    "end_time": int(avaliability_date_finish_ue) * 1000,
    "is_available": True,
}

avaliability_date2 = current_date + timedelta(2)
avaliability_date2_start = avaliability_date2.strftime("%Y-%m-%d 10:00:00")
avaliability_date2_finish = avaliability_date2.strftime("%Y-%m-%d 11:00:00")

avaliability_date2_start_ue = datetime.strptime(
    avaliability_date2_start, "%Y-%m-%d %H:%M:%S"
).strftime("%s")
avaliability_date2_finish_ue = datetime.strptime(
    avaliability_date2_finish, "%Y-%m-%d %H:%M:%S"
).strftime("%s")

TEST_2_AVAILABILITY = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (10am-11am) - 2 days start time
    "start_time": int(avaliability_date2_start_ue) * 1000,
    "end_time": int(avaliability_date2_finish_ue) * 1000,
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
