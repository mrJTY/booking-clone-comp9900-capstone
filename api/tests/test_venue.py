import os

import requests

API_URL = os.environ["API_URL"]


TEST_VENUE = {"venue_name": "Coffee On Campus", "address": "Kensington NSW 2033", "category": "Coffee Shop","description":"Delicious selection of sandwiches and coffee"}
TEST_2_VENUE = {"venue_name": "Coffee On Campus", "address": "Kensington NSW 2033", "category": "Coffee Shop","description":"Great way to get coffee at UNSW"}

def test_create_venue():
    url = f"{API_URL}/venues"
    response = requests.post(url, json=TEST_VENUE)
    actual = response.json()
    expected = {"venue_id": 1, "venue_name": TEST_VENUE["venue_name"], "address": TEST_VENUE["address"], 
                "category": TEST_VENUE["category"], "description": TEST_VENUE["description"]}
    expected = {"venue_id": 1, **expected}
    assert actual == expected


def test_update_venue():
    venue_url = f"{API_URL}/venues/1"
    response = requests.put(venue_url, json=TEST_2_VENUE)
    actual = response.json()
    expected = {"venue_name": TEST_2_VENUE["venue_name"], "address": TEST_2_VENUE["address"], 
                "category": TEST_2_VENUE["category"], "description": TEST_2_VENUE["description"]}
    expected = {"venue_id": 1, **expected}
    assert actual == expected


#def test_delete_venue():
#    venue_url = f"{API_URL}/venues/1"
#    response = requests.delete(venue_url,json=TEST_2_VENUE)
#    actual = response.json()
#    print("What is coming from the actual:")
#    print(actual)
#    expected = {""}
#    assert actual == expected

