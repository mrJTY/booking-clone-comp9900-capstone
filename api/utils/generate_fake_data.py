import hashlib
import logging

from faker import Faker
from api import db
from api.resources.user import UserModel
from api.resources.listing import ListingModel

fake = Faker()
fake_seed = 1
users = []
listings = []


def create_fake_users():
    # Oh no! They all have the same password...
    dummy_password = "password"
    dummy_password_hash = hashlib.sha256(dummy_password.encode("utf-8")).hexdigest()
    for i in list(range(1, 5)):
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

    for i in list(range(1, 5)):
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


def generate_fake_data():
    create_fake_users()
    create_fake_listings()
