from flask import render_template, flash, redirect, url_for
from app import app
from app import db
from app.models import Question
from app.forms import QuestionForm
import sys

@app.route('/', methods=['GET', 'POST'])
def index():
    form = QuestionForm()

    print(form.errors)
    if form.is_submitted():
        print("submitted")
    else:
        print("UNSUBMITTED")
    if form.validate():
        print("valid")
    else:
        print("INVALID")

    if form.validate_on_submit():
        #flash(form.question.data)
        
        q = Question(question = form.question.data, answer = form.answer.data, difficulty = form.difficulty.data)
        db.session.add(q)
        db.session.commit()

        return redirect(url_for('index'))

    return render_template('admin_page.html', questionPool = Question.query.all(), form = form)

@app.route('/base')
def base():
    return render_template('base.html')