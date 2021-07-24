import hashlib
import random
import uuid

from api import db
from api.models.availability import AvailabilityModel
from api.models.booking import BookingModel
from api.models.listing import ListingModel
from api.models.rating import RatingModel
from api.models.user import UserModel
from faker import Faker
import pandas as pd

fake = Faker()
fake_seed = 1

users = []
listings = []
availabilities = []
bookings = []
ratings = []

user_data = pd.read_csv("utils/users.csv")
listing_data = pd.read_csv("utils/listings.csv")
rating_data = pd.read_csv("utils/ratings.csv")


n_users = 6
n_listings = len(listing_data)
n_availabilities = n_ratings = n_bookings = 15


def create_fake_users():
    for i, r in user_data.iterrows():
        password_hash = hashlib.sha256(r[2].encode("utf-8")).hexdigest()
        u = UserModel()
        u.username = r[0]
        u.email = r[1]
        u.password_hash = password_hash
        users.append(u)

    db.session.add_all(users)
    db.session.commit()


def create_fake_listings():
    for i, r in listing_data.iterrows():
        company = r[0]
        address = r[1]
        category = r[2]
        description = r[3]
        # Faker.seed(fake_seed + i)
        # company = fake.company().lower()

        # All belong to user 1
        username = users[0].username

        l = ListingModel()
        l.listing_id = i
        # All belong to user id 1
        l.user_id = users[0].user_id
        l.listing_name = company
        l.category = category.lower()
        l.address = address
        l.description = description
        l.username = username
        listings.append(l)

    db.session.add_all(listings)
    db.session.commit()


def create_fake_availabilties():
    for i in range(0, n_availabilities):
        # All dummy availabilities on one listing id
        listing_id = listings[i].listing_id
        # Give me a random start time (hourly blocks)
        random.seed(123)
        start_time = (1626458400 + random.randrange(0, 2629746, 60 * 60)) * 1000
        # Set end time as 1 hour
        end_time = start_time + (60 * 60 * 1000)
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
        # All bookings made by user 1, except first 8 which are made by 'test user'
        if i <= 8:
            user_id = 16
        else:
            user_id = users[1].user_id
        # All bookings on listing 0
        listing_id = listings[i].listing_id
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
        booking_id = bookings[i].booking_id
        # Generate a random rating with some random comment
        random_index = random.randrange(0, 4)
        rating = rating_data["rating"][random_index].astype(float)
        comment = rating_data["comment"][random_index]
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
