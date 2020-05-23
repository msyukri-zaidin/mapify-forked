from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

#Allows login to get user from database, given name
@login.user_loader
def load_user(id):
    return User.query.get(id)


class Question(db.Model):
    __tablename__ = 'question'
    #Initialise question statement
    id = db.Column(db.Integer, primary_key = True)
    question = db.Column(db.String(128))
    question_type = db.Column(db.String(128))
    answer = db.Column(db.String(128))
    child = db.relationship("CurrentQuestion", backref="parent")
    option_child = db.relationship("Option", backref="parent")
    reference_value = db.Column(db.String(128))

    #Print current question
    def __repr__(self):
        return self.question

class CurrentQuestion(db.Model):
    __tablename__ = 'current_question'
    #Initialise current question statement
    
    id = db.Column(db.Integer, primary_key = True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))
    questionset_id = db.Column(db.Integer, db.ForeignKey('questionset.id'))
    question_number = db.Column(db.Integer)
    #Print current question
    '''
    def __repr__(self):
        return self.question'''

class QuestionSet(db.Model):
    __tablename__ = 'questionset'
    #Initialise question set statement
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(64))
    number_of_questions = db.Column(db.Integer)
    child = db.relationship("CurrentQuestion")
    score_child = db.relationship('Score')

    def __repr__(self):
        return self.name

class Option(db.Model):
    #Initialise option statement
    id = db.Column(db.Integer, primary_key = True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))
    option_value = db.Column(db.String(64))

    def __repr__(self):
        return self.option_value

class User(UserMixin, db.Model):
    __tablename__ = 'user_table'
    id = db.Column(db.Integer, primary_key = True)
    user_type = db.Column(db.String(64))
    username = db.Column(db.String(64))
    password_hash = db.Column(db.String(128))
    score_child = db.relationship("Score", backref = 'parent')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Score(db.Model):
    __tablename__ = 'score'
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'))
    questionset_id = db.Column(db.Integer, db.ForeignKey('questionset.id'))
    score = db.Column(db.Integer)
    feedback = db.Column(db.String(128))