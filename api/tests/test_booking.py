import os

import api.tests.utils as u
import requests

API_URL = os.environ["API_URL"]


OWNER = {
    "username": "krusty_krab",
    "email": "krusty@test.com",
    "password": "krabbypatties",
}

CONSUMER = {
    "username": "sponge_bob",
    "email": "sponge@bob.com",
    "password": "krabby",
}

LISTING = {
    "listing_name": "Krusty Krab's",
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


def test_create_booking():
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
    assert type(booking_id) == int
