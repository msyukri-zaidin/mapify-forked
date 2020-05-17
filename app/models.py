from app import db

class Question(db.Model):
    __tablename__ = 'question'
    #Initialise question statement
    id = db.Column(db.Integer, primary_key = True)
    question = db.Column(db.String(128))
    question_type = db.Column(db.String(128))
    answer = db.Column(db.String(128))
    child = db.relationship("CurrentQuestion", backref="parent")

    #Print current question
    def __repr__(self):
        return self.question

class CurrentQuestion(db.Model):
    __tablename__ = 'current_question'
    #Initialise questioon statement
    
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
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(64))
    number_of_questions = db.Column(db.Integer)
    child = db.relationship("CurrentQuestion")
    def __repr__(self):
        return self.name
        
'''
class Option(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    #question_id
    option_value = db.Column(db.String(64))
    is_answer = db.Column(db.Boolean, default=False)

        def __repr__(self):
        return self.option_value
'''