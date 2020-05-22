from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, RadioField, TextAreaField, IntegerField, PasswordField, HiddenField, SelectField
from wtforms.validators import DataRequired
from wtforms.validators import InputRequired
#from wtforms.widgets.core import HiddenInput

NUMBER_OF_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                        11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

class QuestionForm(FlaskForm):
    question = TextAreaField("Question")
    questionType = RadioField('Type', choices=[('multiple-choice', 'Multiple-Choice'), ('short-answer', 'Short-Answer')])
    short_answer = StringField("Answer")
    multiple_choice_answer = StringField("Answer")
    option_value_1 = StringField("Option")
    option_value_2 = StringField("Option")
    option_value_3 = StringField("Option")
    option_value_4 = StringField("Option")
    #current_list used if question is created from the active question list
    #id_list = IntegerField(widget=HiddenInput())
    id_list = HiddenField("TEST")
#, validators = [DataRequired()]
    reference_value = StringField("Location Search")
    submit = SubmitField("Submit")
    def __repr__(self):
        return self.question


class QuestionsetForm(FlaskForm):
    name = StringField("Name")
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