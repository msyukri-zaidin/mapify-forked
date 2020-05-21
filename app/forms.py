from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, RadioField, TextAreaField, IntegerField, PasswordField, HiddenField
from wtforms.validators import DataRequired
from wtforms.validators import InputRequired
#from wtforms.widgets.core import HiddenInput

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
    submit = SubmitField("Submit")


class QuestionsetForm(FlaskForm):
    name = StringField("Name")
    number_of_questions = IntegerField("Number of Questions")
    submit = SubmitField("Submit")
    
class LoginForm(FlaskForm):
    username = StringField("Username", validators = [DataRequired()])
    password = PasswordField("Password", validators = [DataRequired()])
    submit = SubmitField('Log In')