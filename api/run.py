from api import app, db

if __name__ == "__main__":
    import api.resources.user
    import api.resources.venue

    db.create_all()
    app.run(debug=True, host="0.0.0.0")
