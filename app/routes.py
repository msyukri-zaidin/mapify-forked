from flask import render_template, flash, redirect, url_for, request
from app import app
from app import db
from app.models import Question, CurrentQuestion
from app.forms import QuestionForm
import sys
import json



@app.route('/admin', methods=['GET', 'POST'])
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

@app.route('/postquestion', methods = ['POST'])
def get_question_data():
    convertedQuestionNumber = int(request.form['questionNumber'])

    questionID = request.form['questionID']
    newQuestion = ''
    newAnswer = ''
    #If question slot is filled, newQuestion & newAnswer gets initialised accordingly
    if(questionID != ''):
        print("questionID: ", questionID, "is present")
        newQuestion =  Question.query.get(questionID).question
        newAnswer = Question.query.get(questionID).answer

    #Question slots get initalised accordingly
    CurrentQuestion.query.get(convertedQuestionNumber).id = questionID
    CurrentQuestion.query.get(convertedQuestionNumber).question = newQuestion
    CurrentQuestion.query.get(convertedQuestionNumber).answer = newAnswer
    db.session.commit()
    return redirect(url_for('index'))