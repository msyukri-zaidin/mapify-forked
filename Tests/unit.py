import unittest, os
from app import app, db
from app.models import Question, CurrentQuestion, QuestionSet, Option, Score, User

class UserModelTest(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client() #Creates a venv where we can run our tests
        #make sure databse is empty
        db.create_all()
        u = User(
            id = 1,
            username = 'Bob',
            user_type = 'regular'
        )
        db.session.add(u)
        db.session.commit()

    def tearDown(self):
        db.session.remove()

    def test_set_pw(self):
        u = User.query.get(1)
        u.set_password('pw')
        self.assertFalse(u.check_password('hunter2'))
        self.assertTrue(u.check_password('pw'))

if __name__ == '__main__':
    unittest.main(verbosity=2)