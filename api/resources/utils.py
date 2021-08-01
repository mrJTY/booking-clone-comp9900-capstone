from api.resources.listing import get_ratings, calculate_avg_rating
from api import engine
from api.resources.user import UserModel


def find_followees(follower_user_id):
    # Given the current user, find out who I am following
    # Return a list of users
    query = f"""
    with tmp as (
        select
            u.*
        from users as u
        join followers as f
            on f.influencer_user_id = u.user_id
        where
            f.follower_user_id = {follower_user_id}
    )
    select
        t.*,
        case
            when f.influencer_user_id is not null then 1
            else 0
        end as is_followed
    from tmp as t
    left join
        (select distinct influencer_user_id from followers) as f
        on f.influencer_user_id = t.user_id
    """

    with engine.connect() as conn:
        results = conn.execute(query)
        out = [dict(r) for r in results]
        return out


def find_followers(influencer_user_id):
    # Given the current user, find who is following me
    # Return a list of users
    query = f"""
    with tmp as(
        select
            u.*
        from users as u
        join followers as f
            on f.follower_user_id  = u.user_id
        where
            f.influencer_user_id = {influencer_user_id}
    )
    select
        t.*,
        case
            when f.influencer_user_id is not null then 1
            else 0
        end as is_followed
    from tmp as t
    left join
        (select distinct influencer_user_id from followers) as f
        on f.influencer_user_id = t.user_id
    """

    with engine.connect() as conn:
        results = conn.execute(query)
        out = [dict(r) for r in results]
        return out


def find_listings_of_followees(followees):
    listings = []
    # # Find the listings that are owned by a followee
    # for f in followees:
    #     query = (
    #         db.session.query(ListingModel)
    #             .filter(ListingModel.listing_id == f["user_id"])
    #             .limit(api.config.Config.RESULT_LIMIT)
    #     )
    #     unpacked_query = [q for q in query]
    #     for u in unpacked_query:
    #         listings.append(u)

    listings = []
    for f in followees:
        user_id = f["user_id"]
        query = f"""
        select
            l.*
        from listings as l
        where
            l.user_id = {user_id}
        """

        with engine.connect() as conn:
            results = conn.execute(query)
            listings_to_add = [dict(r) for r in results]
            for l in listings_to_add:
                listings.append(l)

    # Calculate avg ratings and fetch ratings for that listing
    out = [
        {
            **l,
            "avg_rating": calculate_avg_rating(l["listing_id"]),
            "ratings": get_ratings(l["listing_id"]),
        }
        for l in listings
    ]

    return out
