import os

import api.tests.utils as u
import requests

API_URL = os.environ["API_URL"]


OWNER = {
    "username": "krusty_krab_rating",
    "email": "krusty_rating@test.com",
    "password": "krabbypatties",
}

CONSUMER = {
    "username": "sponge_bob_rating",
    "email": "sponge_rating@bob.com",
    "password": "krabby",
}

LISTING = {
    "listing_name": "Krusty Krab's Ratings Test",
    "address": "Somewhere down in Bikini Bottom",
    "category": "Burgers",
    "description": "Best burgers down in Bikini Bottom",
}

AVAILABILITY = {
    # Fill this later once you create a listing
    "listing_id": None,
    "start_time": 1625214000,
    "end_time": 162521500,
}


def test_create_rating():
    # Register resouce owner
    owner_user_id = u.register_user(OWNER)
    consumer_user = u.register_user(CONSUMER)
    # Login
    owner_token = u.login_user(OWNER)
    consumer_token = u.login_user(CONSUMER)

    # Resource owner creates a listing and availability
    listing_id = u.create_listing(LISTING, owner_token)
    availability_id = u.create_availability(AVAILABILITY, listing_id, owner_token)

    # Consumer makes a booking
    booking_id = u.create_booking(
        consumer_user["user_id"],
        consumer_user["username"],
        listing_id,
        availability_id,
        consumer_token,
    )
    assert type(booking_id) == int

    # Consumer makes a rating
    rating_payload = {
        "booking_id": booking_id,
        "user_id": consumer_user["user_id"],
        "rating": 5,
        "comment": "best burgers in town",
    }
    rating_response = u.create_rating(rating_payload, consumer_token)
