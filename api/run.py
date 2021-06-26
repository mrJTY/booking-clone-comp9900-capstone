from api import app

if __name__ == "__main__":
    import api.resources.user
    import api.resources.venue

    app.run(debug=True, host="0.0.0.0")
