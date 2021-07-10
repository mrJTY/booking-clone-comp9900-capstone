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
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (9am-10am)
    "start_time": 1625612400,
    "end_time": 1625616000,
}

AVAILABILITY_2 = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (10am-11am) - 3 days start time
    "start_time": 1625616000,
    "end_time": 1625619600,
}

AVAILABILITY_3 = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (10am-12pm) - 11th July 2021
    "start_time": 1625961600,
    "end_time": 1625968800,
}

AVAILABILITY_4 = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (10am-10pm) - 12th July 2021 - 12 hour block
    "start_time": 1626048000,
    "end_time": 1626091200,
}

AVAILABILITY_5 = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (8pm-10pm) - 13th July 2021 - 2 hour block but later - should be approved
    "start_time": 1626170400,
    "end_time": 1626177600,
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
    availability_id_2 = u.create_availability(AVAILABILITY_2, listing_id, owner_token)
    availability_id_3 = u.create_availability(AVAILABILITY_3, listing_id, owner_token)
    availability_id_4 = u.create_availability(AVAILABILITY_4, listing_id, owner_token)
    availability_id_5 = u.create_availability(AVAILABILITY_5, listing_id, owner_token)
    # Consumer makes a booking
    booking_id = u.create_booking(
        consumer_user_id, listing_id, availability_id, consumer_token
    )
    assert type(booking_id) == int
    # Changed their mind - they want the other timeslot (10am-11am). But since its inside 3 days they cannot do it
    BOOKING_CHANGE_ATTEMPT = {
        "booking_id": booking_id,
        "user_id": consumer_user_id,
        "listing_id": listing_id,
        "availability_id": availability_id_2,
    }
    booking_url = f"{API_URL}/bookings/{booking_id}"
    response = requests.put(
        booking_url,
        json=BOOKING_CHANGE_ATTEMPT,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )
    assert response.status_code == 500
    # Also need to test for over 10 hours a month - they cannot proceed as well. Requires a different booking ID
    booking_id_2 = u.create_booking(
        consumer_user_id, listing_id, availability_id_3, consumer_token
    )

    BOOKING_CHANGE_ATTEMPT_2 = {
        "booking_id": booking_id_2,
        "user_id": consumer_user_id,
        "listing_id": listing_id,
        "availability_id": availability_id_4,
    }
    booking_url = f"{API_URL}/bookings/{booking_id_2}"
    response = requests.put(
        booking_url,
        json=BOOKING_CHANGE_ATTEMPT_2,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )
    assert response.status_code == 500

    # Now this one should be approved
    BOOKING_CHANGE_ATTEMPT_3 = {
        "booking_id": booking_id_2,
        "user_id": consumer_user_id,
        "listing_id": listing_id,
        "availability_id": availability_id_5,
    }
    booking_url = f"{API_URL}/bookings/{booking_id_2}"
    response = requests.put(
        booking_url,
        json=BOOKING_CHANGE_ATTEMPT_3,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )
    assert response.status_code == 500
