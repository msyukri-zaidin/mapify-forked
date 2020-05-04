from app import db

class Question(db.Model):

    #Initialise questioon statement
    id = db.Column(db.Integer, primary_key = True)
    question = db.Column(db.String(128))
    answer = db.Column(db.String(128))
    difficulty = db.Column(db.String(64))

    #Print current question
    def __repr__(self):
        return self.question