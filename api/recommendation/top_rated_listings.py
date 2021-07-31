from api import engine


def get_top_rated_listings(n_listings: int = 5):
    """
    Returns the top n highest avg rated listings
    :param n_listings: Number of listings to return. Defaults to 5
    :return:
    """
    query_text = f"""
    select
        l.*,
        r.avg_rating
    from listings as l
    left join
        (
            select
                b.listing_id,
                avg(r.rating) as avg_rating
            from ratings as r
            join bookings as b
                on b.booking_id = r.booking_id 
            group by b.listing_id
        ) as r
        on r.listing_id = l.listing_id 
    order by r.avg_rating desc
    limit {n_listings} 
    """
    with engine.connect() as conn:
        results = conn.execute(query_text)
        top_listings = [dict(r) for r in results]
        return {"listings": top_listings}
