from app.models import User, Post
from app import db

if __name__ == "__main__":
    try:
        u = User(username='john', email='john@example.com')
        db.session.add(u)
        db.session.commit()
        users = User.query.all()
        print("Users created:")
        print(users)
    except Exception as e:
        print(e)
        pass
