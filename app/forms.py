from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, RadioField, TextAreaField
from wtforms.validators import DataRequired
from wtforms.validators import InputRequired

class QuestionForm(FlaskForm):
    question = TextAreaField("Question")
    questionType = RadioField('Type', choices=[('multiple-choice', 'Multiple-Choice'), ('short-answer', 'Short-Answer')])
    answer = StringField("Answer")
#, validators = [DataRequired()]
    submit = SubmitField("Submit")