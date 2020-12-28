from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, RadioField, TextAreaField, IntegerField, PasswordField, HiddenField, SelectField
from wtforms.validators import DataRequired
from wtforms.validators import InputRequired

NUMBER_OF_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                        11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

class QuestionForm(FlaskForm):
    question = TextAreaField("Question", validators = [DataRequired()])
    questionType = RadioField('Type', choices=[('multiple-choice', 'Multiple-Choice'), ('short-answer', 'Short-Answer')])
    short_answer = StringField("Answer")
    multiple_choice_answer = StringField("Answer")
    option_value_1 = StringField("Option")
    option_value_2 = StringField("Option")
    option_value_3 = StringField("Option")
    option_value_4 = StringField("Option")
    id_list = HiddenField("TEST")
    reference_value = StringField("Location Search")
    submit = SubmitField("Submit")
    def __repr__(self):
        return self.question


class QuestionsetForm(FlaskForm):
    name = StringField("Name", validators = [DataRequired()])
    number_of_questions = SelectField(label="Number of Questions", choices=[(str(num), str(num)) for num in NUMBER_OF_QUESTIONS])
    submit = SubmitField("Submit")
    
class LoginForm(FlaskForm):
    username = StringField("Username", validators = [DataRequired()])
    password = PasswordField("Password", validators = [DataRequired()])
    submit = SubmitField('Log In')

class RegistrationForm(FlaskForm):
    username = StringField("Username", validators = [DataRequired()])
    password = PasswordField("Password", validators = [DataRequired()])
    submit = SubmitField('Sign Up')

class RegistrationAnonForm(FlaskForm):
    username = StringField("Username", validators = [DataRequired()])
    question_set_id = StringField("setID", validators = [DataRequired()])
    submit = SubmitField('Enter Game')

class SubmitResultsForm(FlaskForm):
    userID = StringField("UserID", validators = [DataRequired()])
    question_set_id = StringField("setID", validators = [DataRequired()])
    score = StringField("Score", validators = [DataRequired()])
    time_taken = StringField("TimeTaken", validators = [DataRequired()])