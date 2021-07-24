from api import app
from api import db
import api.utils.generate_fake_data as g
import nltk

# Download NLTK
nltk.download("vader_lexicon")


if __name__ == "__main__":
    import api.resources.user
    import api.resources.listing
    import api.resources.auth
    import api.resources.availability
    import api.resources.booking
    import api.resources.rating
    import api.resources.recommendation
    import api.resources.follower
    import api.resources.profile

    # Create all database tables
    db.create_all()

    # Generate some fake data
    g.generate_fake_data()

    app.run(debug=True, host="0.0.0.0", use_reloader=False)
