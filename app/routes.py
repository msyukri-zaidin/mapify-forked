from flask import render_template, flash, redirect, url_for, request
from app import app
from app import db
from app.models import Question, CurrentQuestion
from app.forms import QuestionForm
import sys
import json



@app.route('/', methods=['GET', 'POST'])
def index():
    form = QuestionForm()

    print(form.errors)

    if form.validate_on_submit():
        q = Question(question = form.question.data, answer = form.answer.data)
        db.session.add(q)
        db.session.commit()
        return redirect(url_for('index'))

    
    questionPool = Question.query.all()
    currentQuestion = CurrentQuestion.query.all()
    filterList = [1,2,3,4,5]
    for cQuestion in currentQuestion:
        for pQuestion in questionPool:
            if cQuestion.id == pQuestion.id:
                filterList.remove(cQuestion.id)
    questionPool = Question.query.filter(Question.id.in_(filterList)).all()

    return render_template('admin_page.html', questionPool = questionPool, form = form, currentQuestion = currentQuestion)

@app.route('/base')
def base():
    return render_template('base.html')

@app.route('/postmethod', methods = ['POST'])
def get_question_data():
    convertedQuestionNumber = int(request.form['questionNumber'])
    questionData = {convertedQuestionNumber : (request.form['questionID'], request.form['questionContent'], request.form['questionAnswer'])}
    CurrentQuestion.query.get(convertedQuestionNumber).id = request.form['questionID']
    CurrentQuestion.query.get(convertedQuestionNumber).question = request.form['questionContent']
    CurrentQuestion.query.get(convertedQuestionNumber).answer = request.form['questionAnswer']
    db.session.commit()
    return redirect(url_for('index'))