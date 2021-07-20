import os

import requests

API_URL = os.environ["API_URL"]


TEST_LISTING = {
    "listing_name": "Coffee On Campus",
    "address": "Kensington NSW 2033",
    "category": "enterTAinmeNT",
    "description": "Delicious selection of sandwiches and coffee",
}
TEST_2_LISTING = {
    "listing_name": "Coffee On Campus",
    "address": "Kensington NSW 2033",
    "category": "entertainment",
    "description": "Great way to get coffee at UNSW",
}

TEST_LISTING_USER = {
    "username": "test_listing_user",
    "email": "test_listing@test.com",
    "password": "test123",
}


def test_register_user():
    url = f"{API_URL}/users"
    response = requests.post(url, json=TEST_LISTING_USER)
    actual = response.json()
    expected = {
        "email": TEST_LISTING_USER["email"],
        "username": TEST_LISTING_USER["username"],
    }
    assert actual["email"] == expected["email"]
    assert actual["username"] == expected["username"]


def test_create_listing():
    # Login first
    login_response = requests.post(
        f"{API_URL}/auth/login",
        json={
            "username": TEST_LISTING_USER["username"],
            "password": TEST_LISTING_USER["password"],
        },
    )
    assert login_response.status_code == 200
    token = login_response.json()["accessToken"]

    url = f"{API_URL}/listings"
    response = requests.post(
        url,
        json=TEST_LISTING,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    actual = response.json()
    assert actual["listing_name"] == TEST_LISTING["listing_name"]
    assert actual["address"] == TEST_LISTING["address"]
    assert actual["category"] == TEST_LISTING["category"].lower()
    assert actual["description"] == TEST_LISTING["description"]

    # It must be zero at the start
    get_listing_url = f"{API_URL}/listings/{actual['listing_id']}"
    get_response = requests.get(
        get_listing_url,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    get_actual = get_response.json()
    # Avg rating must still be zero
    assert type(get_actual["ratings"]) == list
    assert get_actual["avg_rating"] == 0.0

    # Test update
    listing_url = f"{API_URL}/listings/{actual['listing_id']}"
    response = requests.put(
        listing_url,
        json=TEST_2_LISTING,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    actual = response.json()
    assert actual["listing_name"] == TEST_2_LISTING["listing_name"]
    assert actual["address"] == TEST_2_LISTING["address"]
    assert actual["category"] == TEST_2_LISTING["category"].lower()
    assert actual["description"] == TEST_2_LISTING["description"]

    # Test delete
    listing_url = f"{API_URL}/listings/{actual['listing_id']}"
    response = requests.delete(listing_url, json=TEST_2_LISTING)
    assert response.status_code == 200


def test_get_my_listings():
    # Login first
    login_response = requests.post(
        f"{API_URL}/auth/login",
        json={
            "username": TEST_LISTING_USER["username"],
            "password": TEST_LISTING_USER["password"],
        },
    )
    assert login_response.status_code == 200
    token = login_response.json()["accessToken"]

    # Get my listings
    url = f"{API_URL}/listings/mylistings"
    mylistings_response = requests.get(
        url,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    assert mylistings_response.status_code == 200
    assert "mylistings" in mylistings_response.json().keys()


def test_search_resource():
    # Login first
    login_response = requests.post(
        f"{API_URL}/auth/login",
        json={
            "username": TEST_LISTING_USER["username"],
            "password": TEST_LISTING_USER["password"],
        },
    )
    assert login_response.status_code == 200
    token = login_response.json()["accessToken"]

    url = f"{API_URL}/listings"
    response = requests.post(
        url,
        json=TEST_LISTING,
        headers={
            "Authorization": f"JWT {token}",
        },
    )

    # Search for listings - No matching returns
    search_url = f"{API_URL}/listings?search_query=UNSW"
    search_response = requests.get(
        search_url,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    actual = search_response.json()
    assert search_response.status_code == 200
    assert "listings" in actual.keys()

    # Search for listings - One match
    search_url_2 = f"{API_URL}/listings?search_query=Campus"
    search_response_2 = requests.get(
        search_url_2,
        headers={
            "Authorization": f"JWT {token}",
        },
    )
    actual_2 = search_response_2.json()
    assert search_response_2.status_code == 200
    assert "listings" in actual_2.keys()
    assert len(actual_2["listings"]) == 1
    # It must have an avg rating of zero
    assert actual_2["listings"][0]["avg_rating"] == 0.0
