import os

import requests

API_URL = os.environ["API_URL"]

TEST_VENUE = {"venue_id": 1, "venue_name": "random place", "address": "11 high street", "category": "university", "description": "lecture hall"}

# TODO(Harris/Saksham)
def test_create_venue():
    url = f"{API_URL}/venues"
    response = requests.post(url, json=TEST_VENUE)
    actual = response.json()
    expected = {"venue_id": TEST_VENUE["venue_id"], "venue_name": TEST_VENUE["venue_name"], "address": TEST_VENUE["address"], "category": TEST_VENUE["category"], "description": TEST_VENUE["description"]}
    assert actual == expected


# TODO(Harris/Saksham)
def test_update_venue():
    assert 1 == 1
    # url = f"{API_URL}/venues"
    # response = requests.post(url, json=...)
    # actual = response.json()
    # expected = {""}
    # assert actual == expected


# TODO(Harris/Saksham)
def test_delete_venue():
    assert 1 == 1
    # url = f"{API_URL}/venues"
    # response = requests.post(url, json=...)
    # actual = response.json()
    # expected = {""}
    # assert actual == expected
