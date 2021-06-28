from api import app, db
from api import login_manager
from api.resources.user import UserModel

if __name__ == "__main__":
    import api.resources.user
    import api.resources.listing
    import api.resources.auth

    # Create all database tables
    db.create_all()

    app.run(debug=True, host="0.0.0.0")
