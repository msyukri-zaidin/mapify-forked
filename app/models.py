from app import db

class Question(db.Model):

    #Initialise question statement
    id = db.Column(db.Integer, primary_key = True)
    question = db.Column(db.String(128))
    answer = db.Column(db.String(128))

    #Print current question
    def __repr__(self):
        return self.question

class CurrentQuestion(db.Model):

    #Initialise questioon statement
    number = db.Column(db.Integer, primary_key = True)
    id = db.Column(db.Integer)
    question = db.Column(db.String(128))
    answer = db.Column(db.String(128))

    #Print current question
    def __repr__(self):
        return self.question