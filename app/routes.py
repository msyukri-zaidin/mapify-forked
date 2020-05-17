from flask import render_template, flash, redirect, url_for, request
from app import app
from app import db
from app.models import Question, CurrentQuestion, QuestionSet
from app.forms import QuestionForm, QuestionsetForm
import sys
import json

@app.route('/admin', methods=['GET', 'POST'])
def index():
    form = QuestionForm()
    questionset_form = QuestionsetForm()

    questionsetID = request.args.get('questionsetID')
    if questionsetID:
        questionsetID = int(questionsetID)
        #print("QUESTION SET ID ", questionsetID)
    else: 
        questionsetID = 1

    #print(form.errors)

    if form.validate_on_submit():
        q = Question(question = form.question.data, answer = form.answer.data, question_type = form.questionType.data)
        db.session.add(q)
        db.session.commit()
        return redirect(url_for('index'))

    if questionset_form.validate_on_submit():
        q = QuestionSet(name = questionset_form.name.data, number_of_questions = questionset_form.number_of_questions.data)
        db.session.add(q)
        db.session.commit()
        #Add new empty questions into question set
        q = QuestionSet.query.filter(QuestionSet.name==questionset_form.name.data).all()[0]
        for i in range(1, questionset_form.number_of_questions.data+1):
            CQ = CurrentQuestion(question_id = '', questionset_id = q.id, question_number = i)
            db.session.add(CQ)
        db.session.commit()
        return redirect(url_for('index'))

    if len(Question.query.all()) == 0:
        q = Question(question = 'What is the capital of Australia', question_type = 'Short-Answer', answer = 'Canberra')
        db.session.add(q)
        db.session.commit()
    if len(CurrentQuestion.query.all()) == 0:
        for i in range(1, 6):
            q = CurrentQuestion(question_id = '', questionset_id = 1, question_number = i)
            db.session.add(q)
        db.session.commit()
    if len(QuestionSet.query.all()) == 0:
        q = QuestionSet(name = 'Test', number_of_questions = 5)
        db.session.add(q)
        db.session.commit()

    questionPool = Question.query.all()
    currentQuestion = CurrentQuestion.query.filter(CurrentQuestion.questionset_id==questionsetID).all() #Set to 1 later
    questionSet = QuestionSet.query.all()

    filterList = []
    filterListLength = Question.query.count()
    #filterListLength = QuestionSet.query.filter(QuestionSet.id == questionsetID).all()[0].number_of_questions
    #print("FILTER LIST ", filterListLength)
    for i in range(1, filterListLength + 1):
        filterList.append(i)
        
    for cQuestion in currentQuestion:
        for pQuestion in questionPool:
            if cQuestion.question_id == pQuestion.id:
                #print(cQuestion.question_id) #To check what question IDs are in question slots
                filterList.remove(cQuestion.question_id)
    #print(filterList)
    questionPool = Question.query.filter(Question.id.in_(filterList)).all()

    #print("Number of questions in pool: ", len(questionPool))
    #print("Number of question slots: ", len(currentQuestion))

    questionset_number_of_questions = questionSet[questionsetID - 1].number_of_questions# Deduct ID by 1 to get position
    return render_template(
        'admin_page.html', 
        questionPool = questionPool, 
        form = form, 
        questionset_form = questionset_form, 
        currentQuestion = currentQuestion, 
        questionSet = questionSet, 
        currentQuestionset = questionsetID - 1,
        questionSetNumberOfQuestions = questionset_number_of_questions,#Number of questions in the question set
        questionSetTotal = len(questionSet)) #Total number of question sets

@app.route('/base')
def base():
    #return render_template('base.html')
    return redirect(url_for('index', questionsetID = 2))

@app.route('/postquestion', methods = ['POST'])
def get_question_data():
    questionDict = request.get_json(force=True)
    newQuestion = ''
    newAnswer = ''
    for i in range (1, len(questionDict)): #Ignores id=0
        questionID = questionDict[str(i)]['questionID']
        questionNumber = questionDict[str(i)]['questionNumber']
        questionSetID = questionDict[str(i)]['questionSetID']
        if questionDict[str(i)]['questionID'] != '':
            newQuestion = Question.query.get(questionID).question
            newAnswer = Question.query.get(questionID).answer

        questionList = CurrentQuestion.query.filter(CurrentQuestion.questionset_id == questionSetID).all()
        for question in questionList:
            if question.question_number == questionNumber:
                question.question_id = questionID
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/loadquestionset', methods = ['GET','POST'])
def questionset():
    setDict = request.get_json(force=True)
    questionsetID = setDict['questionsetID']
    return redirect(url_for('index', questionsetID = questionsetID))