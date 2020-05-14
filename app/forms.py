from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, RadioField
from wtforms.validators import DataRequired
from wtforms.validators import InputRequired

class QuestionForm(FlaskForm):
    question = StringField("Question")
    answer = StringField("Answer")
#, validators = [DataRequired()]
    submit = SubmitField("Submit"