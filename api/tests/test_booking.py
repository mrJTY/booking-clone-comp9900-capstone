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

OWNER2 = {
    "username": "krusty_krab2",
    "email": "krust2y@test.com",
    "password": "krabbypatties",
}

CONSUMER = {
    "username": "sponge_bob",
    "email": "sponge@bob.com",
    "password": "krabby",
}

CONSUMER2 = {
    "username": "sponge_bob2",
    "email": "sponge2@bob.com",
    "password": "krabby",
}

LISTING = {
    "listing_name": "Krusty Krab's",
    "address": "Somewhere down in Bikini Bottom",
    "category": "Burgers",
    "description": "Best burgers down in Bikini Bottom",
}

LISTING2 = {
    "listing_name": "Krusty Krab's 2",
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
    assert response.status_code == 403
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
    assert response.status_code == 403

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

    # Test my bookings before deletion
    booking_url = f"{API_URL}/bookings/mybookings"
    response = requests.get(
        booking_url,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )
    assert response.status_code == 200
    assert response.json()["mybookings"]["upcoming"][0]["booking_id"] is not None
    assert response.json()["mybookings"]["upcoming"][0]["user_id"] is not None

    # Test delete
    booking_url = f"{API_URL}/bookings/{booking_id_2}"
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


def test_must_not_have_more_than_10_booking_hours():
    # Register resouce owner
    owner_user_id = u.register_user(OWNER2)
    consumer_user_id = u.register_user(CONSUMER2)

    # Login
    owner_token = u.login_user(OWNER2)
    consumer_token = u.login_user(CONSUMER2)

    # Resource owner creates a listing and availability
    listing_id = u.create_listing(LISTING2, owner_token)

    # Owner creates 20 availabilities
    availability_ids = [
        u.create_availability(AVAILABILITY, listing_id, owner_token)
        for i in range(0, 20)
    ]

    # Consumer attempts to book a lot
    last_booking_id = None
    last_availability_id = None
    for i, availability_id in enumerate(availability_ids):
        create_booking_response = u.create_booking_response(
            listing_id, availability_id, consumer_token
        )
        # On the 10th booking attempt, expect it to fail afterward
        if i >= 10:
            assert create_booking_response.status_code == 403
            assert (
                create_booking_response.json()["error"]
                == "Cannot book more than 10 hours per calendar month"
            )
        else:
            assert create_booking_response.status_code == 200
            # Save the last booking id
            last_booking_id = create_booking_response.json()["booking_id"]
            last_availability_id = availability_id

    # Update last availability to have 5 hours
    availability_url = f"{API_URL}/availabilities/{last_availability_id}"
    requests.put(
        availability_url,
        json={
            "listing_id": listing_id,
            "start_time": int(avaliability_date2_start_ue) * 1000,
            "end_time": (int(avaliability_date2_start_ue) + (5 * 60)) * 1000,
            "is_available": True,
        },
        headers={
            "Authorization": f"JWT {owner_token}",
        },
    )

    # Let's try updating an existing booking to more than 1 hour...
    BOOKING_CHANGE_ATTEMPT = {
        "booking_id": last_booking_id,
        "user_id": consumer_user_id,
        "listing_id": listing_id,
        "availability_id": last_availability_id,
    }
    booking_url = f"{API_URL}/bookings/{last_booking_id}"
    update_response = requests.put(
        booking_url,
        json=BOOKING_CHANGE_ATTEMPT,
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )

    # We should not be able to change less than 3 days before start of the booking
    assert update_response.status_code == 403
    assert (
        update_response.json()["error"]
        == "Cannot update booking less than 3 days of start time of the booking"
    )

    auth_me_response = requests.get(
        f"{API_URL}/auth/me",
        headers={
            "Authorization": f"JWT {consumer_token}",
        },
    )

    # I should just have 9 hours booked after all this
    assert auth_me_response.json()["hours_booked"] == 9
