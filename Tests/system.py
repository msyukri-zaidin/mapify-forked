import unittest, os, time
from app import app, db
from app.models import Question, CurrentQuestion, QuestionSet, Option, Score, User
from selenium import webdriver
basedir = os.path.abspath(os.path.dirname(__file__))

class SystemTest(unittest.TestCase):
    driver = None

    def setUp(self):
        self.driver = webdriver.Firefox(executable_path=os.path.join(basedir, 'geckodriver'))
        if not self.driver:
            self.skipTest
        else:
            db.init_app(app) #initialises the flask app
            db.create_all()
            # clearing the rows of the tables in the databse test.db
            # test.db has the same structure
            db.session.query(User).delete() 
            db.session.query(Question).delete()
            db.session.query(CurrentQuestion).delete()
            db.session.query(QuestionSet).delete()
            db.session.query(Option).delete()
            db.session.query(Score).delete()
            # initialize the table row object
            u = User(id=1, username = 'Bob', user_type = 'regular')
            qs = QuestionSet(id = 1, name = 'test-set-1', number_of_questions = 5)

            u.set_password('pw')
            db.session.add(u)
            db.session.add(qs)
            db.session.commit()
            self.driver.maximize_window() # maxise window
            self.driver.get('http://localhost:5000/login') #

    def tearDown(self):
        if self.driver: #If test ran
            self.driver.close()
            db.session.query(User).delete()
            db.session.query(Question).delete()
            db.session.query(CurrentQuestion).delete()
            db.session.query(QuestionSet).delete()
            db.session.query(Option).delete()
            db.session.query(Score).delete()
            db.session.commit() # saving it / writing the changes
            db.session.remove()

    # Testing basci login
    def test_login(self):
        self.driver.get('http://localhost:5000/login')

        user_field = self.driver.find_element_by_id('username-field')
        password_field = self.driver.find_element_by_id('password-field')
        submit = self.driver.find_element_by_id('submit-field')


        user_field.send_keys('Bob')
        password_field.send_keys('pw')
        submit.click()


        welcome = self.driver.find_element_by_id('welcome-user').get_attribute('innerHTML')
        self.assertEqual(welcome, 'Welcome Bob!')
    
    def test_wrong_password(self):
        self.driver.get('http://localhost:5000/login')

        user_field = self.driver.find_element_by_id('username-field')
        password_field = self.driver.find_element_by_id('password-field')
        submit = self.driver.find_element_by_id('submit-field')
        user_field.send_keys('Bob')
        password_field.send_keys('pw123')
        submit.click()


        message = self.driver.find_element_by_id('message').get_attribute('innerHTML')
        self.assertEqual(message, 'invalid username or password')

    #Testing logout
    def test_logout(self):
        self.driver.get('http://localhost:5000/login')

        user_field = self.driver.find_element_by_id('username-field')
        password_field = self.driver.find_element_by_id('password-field')
        submit = self.driver.find_element_by_id('submit-field')

        user_field.send_keys('Bob')
        password_field.send_keys('pw')
        submit.click()
        

        logout = self.driver.find_element_by_id('header-logout-button')
        logout.click()


        loginButton = self.driver.find_element_by_id('header-login-button').get_attribute('innerHTML')
        self.assertEqual(loginButton, 'Log In')

    #Testing registration
    def test_register(self):
        self.driver.get('http://localhost:5000/register')

        user_field = self.driver.find_element_by_id('username-field')
        password_field = self.driver.find_element_by_id('password-field')
        submit = self.driver.find_element_by_id('submit-field')

        user_field.send_keys('john')
        password_field.send_keys('hunter2')
        submit.click()

        welcome = self.driver.find_element_by_id('welcome-user').get_attribute('innerHTML')
        self.assertEqual(welcome, 'Welcome john!')

    def test_register_used_name(self):
        self.driver.get('http://localhost:5000/register')

        user_field = self.driver.find_element_by_id('username-field')
        password_field = self.driver.find_element_by_id('password-field')
        submit = self.driver.find_element_by_id('submit-field')

        user_field.send_keys('Bob')
        password_field.send_keys('hunter2')
        submit.click()


        message = self.driver.find_element_by_id('message').get_attribute('innerHTML')
        self.assertEqual(message, 'Username already taken')



if __name__ == '__main__':
    unittest.main(verbosity=2)