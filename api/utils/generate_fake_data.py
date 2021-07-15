import hashlib
import logging
import uuid
from random import randrange

from faker import Faker
from api import db
from api.resources.user import UserModel
from api.resources.listing import ListingModel
from api.resources.availability import AvailabilityModel
from api.resources.booking import BookingModel
from api.resources.rating import RatingModel

fake = Faker()
fake_seed = 1

n_users = 5
n_listings = 5
n_availabilities = 5
n_bookings = n_availabilities  # Book all availabilities for simplicity
n_ratings = n_bookings  # Rate all bookings for simplicity

users = []
listings = []
availabilities = []
bookings = []
ratings = []


def create_fake_users():
    # Oh no! They all have the same password...
    dummy_password = "password"
    dummy_password_hash = hashlib.sha256(dummy_password.encode("utf-8")).hexdigest()
    for i in range(0, n_users):
        Faker.seed(fake_seed + i)
        username = fake.first_name().lower()
        email = f"{username}@bookit.com"
        u = UserModel()
        u.user_id = i
        u.username = username
        u.email = email
        u.password_hash = dummy_password_hash
        users.append(u)

    db.session.add_all(users)
    db.session.commit()


def create_fake_listings():
    for i in range(0, n_listings):
        Faker.seed(fake_seed + i)
        company = fake.company().lower()
        address = fake.address()

        # TODO: define categories
        category = "category"
        description = "Lorem ipsum dolor"

        # All belongs to user 1
        user_id = users[0].user_id
        username = users[0].username

        l = ListingModel()
        l.listing_id = i
        l.listing_name = company
        l.category = category
        l.address = address
        l.description = description
        l.user_id = user_id
        l.username = username
        listings.append(l)

    db.session.add_all(listings)
    db.session.commit()


def create_fake_availabilties():
    for i in range(0, n_availabilities):
        # All dummy availabilities on one listing id
        listing_id = listings[0].listing_id
        start_time = 123
        end_time = 123
        a = AvailabilityModel(
            start_time=start_time,
            end_time=end_time,
            listing_id=listing_id,
            is_available=True,
        )
        availabilities.append(a)
    db.session.add_all(availabilities)
    db.session.commit()


def create_fake_bookings():
    for i in range(0, n_bookings):
        # All bookings made by user 1
        user_id = users[1].user_id
        # All bookings on listing 0
        listing_id = listings[0].listing_id
        # Availability id must match booking
        availability_id = availabilities[i].availability_id
        booking_id = str(uuid.uuid4())
        b = BookingModel(
            booking_id=booking_id,
            user_id=user_id,
            listing_id=listing_id,
            availability_id=availability_id,
        )
        bookings.append(b)
    db.session.add_all(bookings)
    db.session.commit()


def create_fake_ratings():
    for i in range(0, n_ratings):
        # All ratings made by user 1
        user_id = users[1].user_id
        # All bookings on listing 0
        booking_id = bookings[i].booking_id
        # Generate a random rating with some random comment
        rating = randrange(1, 5)
        comment = "Good! Me'h! Ok! Best!"
        r = RatingModel(
            user_id=user_id, booking_id=booking_id, rating=rating, comment=comment
        )
        ratings.append(r)
    db.session.add_all(ratings)
    db.session.commit()


def generate_fake_data():
    create_fake_users()
    create_fake_listings()
    create_fake_availabilties()
    create_fake_bookings()
    create_fake_ratings()
