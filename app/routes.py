from flask import render_template, flash, redirect, url_for, request, jsonify
from app import app
from app import db
from app.models import Question, CurrentQuestion, QuestionSet, Option
from app.forms import QuestionForm, QuestionsetForm
import sys
import json

@app.route('/', methods = ['GET','POST'])
def home():
    questionSet = QuestionSet.query.all()
    return render_template('base.html', questionSet = questionSet)

@app.route('/quiz', methods = ['GET','POST'])
def generate_quiz():
    questionsetID = request.args.get('questionsetID')
    print("Link triggered setID: ", questionsetID)
    #questionList = CurrentQuestion.query.filter(CurrentQuestion.questionset_id == questionsetID).all()

    questionList = CurrentQuestion.query.filter(CurrentQuestion.questionset_id == questionsetID).all()
    myJSON = []
    for i in range(0, len(questionList)):
        if questionList[i].question_id != '':
            myJSON.append({'question':questionList[i].parent.question, 'answer':questionList[i].parent.answer})
        else:
            myJSON.append({'question':'', 'answer':''})
    print(myJSON)
    return render_template('quizPage.html', questions = myJSON)

@app.route('/loadquiz', methods = ['GET'])
def load_quiz():
    questionsetID = request.args.get('questionsetID')
    print("/loadquiz setID: ", questionsetID)
    questionList = CurrentQuestion.query.filter(CurrentQuestion.questionset_id == questionsetID).all()
    myJSON = []
    for i in range(0, len(questionList)):
        if questionList[i].question_id != '':
            myJSON.append({'question':questionList[i].parent.question, 'answer':questionList[i].parent.answer})
        else:
            myJSON.append({'question':'', 'answer':''})
    print(myJSON)
    return jsonify(myJSON)

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    form = QuestionForm()
    questionset_form = QuestionsetForm()

    
    questionsetID = request.args.get('questionsetID')
    #questionsetID will be true only if function was called by questionset()
    if questionsetID:
        questionsetID = int(questionsetID)
    else: 
        questionsetID = 1

    #print(form.errors)

    #Validates to true if the question form was submitted
    if form.validate_on_submit():
        option_value_list = [
            form.option_value_1.data,
            form.option_value_2.data,
            form.option_value_3.data,
            form.option_value_4.data,
        ]
        
        #As the answer field for multiple choice and short answer are different, the following if-else statement takes that into account
        if form.questionType.data == 'short-answer':
            answer = form.short_answer.data
        else:
            answer = form.multiple_choice_answer.data

        #Initialise query object
        q = Question(
            question = form.question.data, 
            answer = answer,
            question_type = form.questionType.data)

        #print("OPTION VALUE LIST: ", option_value_list)

        db.session.add(q)
        db.session.commit()

        #To get the question ID, we query the id of the latest commit to the server
        questionID = Question.query.all()[-1].id    

        #Entering option values into option table
        for i in range(0, len(option_value_list)):
            #Empty option values do not get added into the database
            if option_value_list[i] != '':
                o = Option(
                    question_id = questionID,
                    option_value = option_value_list[i]
                )
                db.session.add(o)

        db.session.commit()
        return redirect(url_for('admin'))

    #Validates to true if question set form was submitted
    if questionset_form.validate_on_submit():
        q = QuestionSet(
            name = questionset_form.name.data, 
            number_of_questions = questionset_form.number_of_questions.data)
        db.session.add(q)
        db.session.commit()

        #Initialise new empty questions into question set
        q = QuestionSet.query.filter(QuestionSet.name==questionset_form.name.data).all()[0]
        for i in range(1, questionset_form.number_of_questions.data+1):
            CQ = CurrentQuestion(question_id = '', questionset_id = q.id, question_number = i)
            db.session.add(CQ)
        db.session.commit()
        return redirect(url_for('admin'))

    #These 3 if statements are temporary. Only used when database is initally empty
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

    #Declare variables and initalise them with all values from the tables
    questionPool = Question.query.all()
    #currentQuestion is initialised where the questionsetID is equal to what was previously set
    currentQuestion = CurrentQuestion.query.filter(CurrentQuestion.questionset_id==questionsetID).all()
    questionSet = QuestionSet.query.all()

    #filterList contains all the questions which are in question slots
    #These questions are then filtered out of questionPool
    filterList = []
    filterListLength = Question.query.all()[-1].id
    for i in range(1, filterListLength + 1):
        filterList.append(i)
        
    for cQuestion in currentQuestion:
        for pQuestion in questionPool:
            if cQuestion.question_id == pQuestion.id:
                #print(cQuestion.question_id) #To check what question IDs are in question slots
                filterList.remove(cQuestion.question_id)

    #The line where filtering occurs
    questionPool = Question.query.filter(Question.id.in_(filterList)).all()


    questionset_number_of_questions = questionSet[questionsetID - 1].number_of_questions    #ID deducted by 1 to get position
    return render_template(
        'admin_page.html', 
        questionPool = questionPool, 
        form = form, 
        questionset_form = questionset_form, 
        currentQuestion = currentQuestion, 
        questionSet = questionSet, 
        currentQuestionset = questionsetID - 1,                         #ID deducted by 1 to get position
        questionSetNumberOfQuestions = questionset_number_of_questions, #Number of questions in the question set
        questionSetTotal = len(questionSet))                            #Total number of question sets

#Test function
@app.route('/base')
def base():

    #return render_template('base.html')
    return redirect(url_for('admin', questionsetID = 2))

#Function that is initiated by an AJAX call that comes from saving changes to the question arrangement
@app.route('/postquestion', methods = ['POST'])
def get_question_data():
    #questionDict holds information about the questions slots. Both those which have questions in them and those which do not
    questionDict = request.get_json(force=True)
    newQuestion = ''
    newAnswer = ''
    for i in range (1, len(questionDict)): #Ignores id==0
        questionID = questionDict[str(i)]['questionID']
        questionNumber = questionDict[str(i)]['questionNumber']
        questionSetID = questionDict[str(i)]['questionSetID']
        
        #If there is a question in that question slot, newQuestion & newAnswer gets initialised
        if questionDict[str(i)]['questionID'] != '':
            newQuestion = Question.query.get(questionID).question
            newAnswer = Question.query.get(questionID).answer

        #Initialise list of questions from the active question set
        questionList = CurrentQuestion.query.filter(CurrentQuestion.questionset_id == questionSetID).all()
        #For loop makes sure that newly filled question slots are accounted for in the database
        for question in questionList:
            if question.question_number == questionNumber:
                question.question_id = questionID
    db.session.commit()
    return redirect(url_for('admin'))

#INCOMPLETE: Function for deleting a question
@app.route('/deletequestion', methods = ['POST'])
def delete_question():
    questionDict = request.get_json(force=True)
    questionID = questionDict['questionID']
    #print("Server has: ", questionDict['questionID'])

    #Deletes the question in Question table
    Question.query.filter_by(id=questionID).delete()

    #Deletes any options the question might have had
    Option.query.filter_by(question_id=questionID).delete()

    #Deletes rows in CurrentQuestion which have this question
    CurrentQuestion.query.filter_by(question_id=questionID).delete()
    db.session.commit()
    return redirect(url_for('admin'))

#Function that is initiated by an AJAX call that comes from selecting a new question set from the dropdown menu
#Function switches the active question set to the selected set
@app.route('/loadquestionset', methods = ['GET','POST'])
def questionset():
    setDict = request.get_json(force=True)
    questionsetID = setDict['questionsetID']
    return redirect(url_for('admin', questionsetID = questionsetID))
