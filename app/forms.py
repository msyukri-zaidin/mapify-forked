from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, RadioField, TextAreaField, IntegerField
from wtforms.validators import DataRequired
from wtforms.validators import InputRequired

class QuestionForm(FlaskForm):
    question = TextAreaField("Question")
    questionType = RadioField('Type', choices=[('multiple-choice', 'Multiple-Choice'), ('short-answer', 'Short-Answer')])
    short_answer = StringField("Answer")
    multiple_choice_answer = StringField("Answer")
    option_value_1 = StringField("Option")
    option_value_2 = StringField("Option")
    option_value_3 = StringField("Option")
    option_value_4 = StringField("Option")
#, validators = [DataRequired()]
    submit = SubmitField("Submit")

class QuestionsetForm(FlaskForm):
    name = StringField("Name")
    number_of_questions = IntegerField("Number of Questions")
    submit = SubmitField("Submit")