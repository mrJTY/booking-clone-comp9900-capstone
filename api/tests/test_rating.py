import os
from datetime import datetime, timedelta
import api.tests.utils as u
import requests

API_URL = os.environ["API_URL"]


OWNER = {
    "username": "krusty_krab_rating",
    "email": "krusty_rating@test.com",
    "password": "krabbypatties",
    "user_description": "sport",
}

CONSUMER = {
    "username": "sponge_bob_rating",
    "email": "sponge_rating@bob.com",
    "password": "krabby",
    "user_description": "sport",
}

LISTING = {
    "listing_name": "Krusty Krab's Ratings Test",
    "address": "Somewhere down in Bikini Bottom",
    "category": "Burgers",
    "description": "Best burgers down in Bikini Bottom",
}

# We will need to change the times as it goes along - static.
# Ratings only activate if its past the start time - setup by frontend
now = datetime.now().strftime("%Y-%m-%d-00:00:00")
current_date = datetime.strptime(now, "%Y-%m-%d-00:00:00")

avaliability_date = current_date + timedelta(-2)
avaliability_date_start = avaliability_date.strftime("%Y-%m-%d 12:00:00")
avaliability_date_finish = avaliability_date.strftime("%Y-%m-%d 13:00:00")

avaliability_date_start_ue = datetime.strptime(
    avaliability_date_start, "%Y-%m-%d %H:%M:%S"
).strftime("%s")
avaliability_date_finish_ue = datetime.strptime(
    avaliability_date_finish, "%Y-%m-%d %H:%M:%S"
).strftime("%s")

AVAILABILITY = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (12pm-1pm - 2 days behind)
    "start_time": int(avaliability_date_start_ue) * 1000,
    "end_time": int(avaliability_date_finish_ue) * 1000,
}


def test_create_rating():
    # Register resouce owner
    owner_user_id = u.register_user(OWNER)
    consumer_user_id = u.register_user(CONSUMER)

    # Login
    owner_token = u.login_user(OWNER)
    consumer_token = u.login_user(CONSUMER)

    # Resource owner creates a listing and availability
    listing_id = u.create_listing(LISTING, owner_token)
    availability_id = u.create_availability(AVAILABILITY, listing_id, owner_token)

    # Consumer makes a booking
    booking_id = u.create_booking(
        consumer_user_id, listing_id, availability_id, consumer_token
    )
    assert type(booking_id) == str

    # Consumer makes a rating
    rating_payload = {
        "booking_id": booking_id,
        "user_id": consumer_user_id,
        "rating": 5,
        "comment": "best burgers in town",
    }

    # Get my listings as the owner
    url = f"{API_URL}/listings/mylistings"
    mylistings_response = requests.get(
        url,
        headers={
            "Authorization": f"JWT {owner_token}",
        },
    )
    # The rating must be 0 at first
    assert mylistings_response.json()["mylistings"][0]["avg_rating"] == 0.0
    rating_response = u.create_rating(rating_payload, consumer_token)
    rating_id = rating_response["rating_id"]
    # Then 5 at first review, get mylistings again
    mylistings_response = requests.get(
        url,
        headers={
            "Authorization": f"JWT {owner_token}",
        },
    )
    assert mylistings_response.json()["mylistings"][0]["avg_rating"] == 5.0
    # There should be 1 rating attached to this
    assert len(mylistings_response.json()["mylistings"][0]["ratings"]) == 1

    # Update the rating
    ratings_url = f"{API_URL}/ratings/{rating_id}"
    rating_payload_updated = {
        "booking_id": booking_id,
        "user_id": consumer_user_id,
        "rating": 3,
        "comment": "On second thought, burgers were OKAY... it could have been better. Slightly dry for me...",
    }

    updated_rating_response = requests.put(
        ratings_url,
        json=rating_payload_updated,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )
    assert updated_rating_response.status_code == 200
    actual = updated_rating_response.json()
    assert actual["user_id"] == rating_payload_updated["user_id"]
    assert actual["booking_id"] == rating_payload_updated["booking_id"]
    assert actual["rating"] == rating_payload_updated["rating"]
    assert actual["comment"] == rating_payload_updated["comment"]

    # Test delete
    delete_response = requests.delete(ratings_url)
    assert delete_response.status_code == 204
