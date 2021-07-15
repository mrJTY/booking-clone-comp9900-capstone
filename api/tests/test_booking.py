import os
from datetime import datetime, timedelta
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
# We will need to change the times as it goes along - static.
# Need to create rolling times
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

AVAILABILITY = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (9am-10am)
    "start_time": int(avaliability_date_start_ue) * 1000,
    "end_time": int(avaliability_date_finish_ue) * 1000,
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

AVAILABILITY_2 = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (10am-11am) - 2 days start time
    "start_time": int(avaliability_date2_start_ue) * 1000,
    "end_time": int(avaliability_date2_finish_ue) * 1000,
}

avaliability_date3 = current_date + timedelta(4)
avaliability_date3_start = avaliability_date3.strftime("%Y-%m-%d 10:00:00")
avaliability_date3_finish = avaliability_date3.strftime("%Y-%m-%d 12:00:00")

avaliability_date3_start_ue = datetime.strptime(
    avaliability_date3_start, "%Y-%m-%d %H:%M:%S"
).strftime("%s")
avaliability_date3_finish_ue = datetime.strptime(
    avaliability_date3_finish, "%Y-%m-%d %H:%M:%S"
).strftime("%s")
AVAILABILITY_3 = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (10am-12pm)
    "start_time": int(avaliability_date3_start_ue) * 1000,
    "end_time": int(avaliability_date3_finish_ue) * 1000,
}

avaliability_date4 = current_date + timedelta(4)
avaliability_date4_start = avaliability_date4.strftime("%Y-%m-%d 10:00:00")
avaliability_date4_finish = avaliability_date4.strftime("%Y-%m-%d 22:00:00")

avaliability_date4_start_ue = datetime.strptime(
    avaliability_date4_start, "%Y-%m-%d %H:%M:%S"
).strftime("%s")
avaliability_date4_finish_ue = datetime.strptime(
    avaliability_date4_finish, "%Y-%m-%d %H:%M:%S"
).strftime("%s")
AVAILABILITY_4 = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (10am-10pm)
    "start_time": int(avaliability_date4_start_ue) * 1000,
    "end_time": int(avaliability_date4_finish_ue) * 1000,
}

avaliability_date5 = current_date + timedelta(4)
avaliability_date5_start = avaliability_date5.strftime("%Y-%m-%d 20:00:00")
avaliability_date5_finish = avaliability_date5.strftime("%Y-%m-%d 22:00:00")

avaliability_date5_start_ue = datetime.strptime(
    avaliability_date5_start, "%Y-%m-%d %H:%M:%S"
).strftime("%s")
avaliability_date5_finish_ue = datetime.strptime(
    avaliability_date5_finish, "%Y-%m-%d %H:%M:%S"
).strftime("%s")
AVAILABILITY_5 = {
    # Fill this later once you create a listing - 5
    "listing_id": 5,
    # Unix Epoch time (8pm-10pm)
    "start_time": int(avaliability_date5_start_ue) * 1000,
    "end_time": int(avaliability_date5_finish_ue) * 1000,
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
    assert type(booking_id) == str

    # Access a protected endpoint
    protected_url = f"{API_URL}/auth/me"
    protected_response = requests.get(
        protected_url,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )
    assert protected_response.status_code == 200
    assert protected_response.json()["hours_booked"] == 1

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

    protected_url = f"{API_URL}/auth/me"
    protected_response = requests.get(
        protected_url,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )
    assert protected_response.status_code == 200
    assert protected_response.json()["hours_booked"] == 3

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
    assert response.status_code == 200

    # Test delete
    response = requests.delete(booking_url)
    assert response.status_code == 204

    protected_url = f"{API_URL}/auth/me"
    protected_response = requests.get(
        protected_url,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )
    assert protected_response.status_code == 200
    assert protected_response.json()["hours_booked"] == 1


def test_my_bookings():
    consumer_token = u.login_user(CONSUMER)
    booking_url = f"{API_URL}/bookings/mybookings"
    response = requests.get(
        booking_url,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )
    assert response.status_code == 200
    assert "mybookings" in response.json().keys()
    assert "upcoming" in response.json()["mybookings"].keys()
    assert "past" in response.json()["mybookings"].keys()
