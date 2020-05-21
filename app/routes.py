from flask import render_template, flash, redirect, url_for, request, jsonify
from app import app
from app import db
from app.models import Question, CurrentQuestion, QuestionSet, Option
from app.forms import QuestionForm, QuestionsetForm, LoginForm
import sys
import json
import random

@app.route('/', methods = ['GET','POST'])
def home():
    questionSet = QuestionSet.query.all()
    loginForm = LoginForm()
    # need to do what happens if the user has laready logged in, would the login button appear differently
    # not too sure on what this success does
    if loginForm.validate_on_submit():
    # if request.method == 'POST':
        flash('Loging requested for user ()'.format(loginForm.username.data))
        # return 'hello'
        return redirect('../templates/admin_page.html')
    else:
        return render_template('home.html', loginForm=loginForm, questionSet = questionSet)

@app.route('/quiz', methods = ['GET','POST'])
def generate_quiz():
    questionsetID = request.args.get('questionsetID')
    print("Link triggered setID: ", questionsetID)
    #questionList = CurrentQuestion.query.filter(CurrentQuestion.questionset_id == questionsetID).all()

    questionList = CurrentQuestion.query.filter(CurrentQuestion.questionset_id == questionsetID).all()
    myJSON = []
    for i in range(0, len(questionList)):
        #Check if there is a question assigned to the questionSet even if the questionSet is missing
        #question from the admin page
        if questionList[i].question_id != '':
            # Check the type of the question
            if questionList[i].parent.question_type.lower() == 'short-answer':
                myJSON.append({'question':questionList[i].parent.question,
                               'qType':'short',
                               'answer':questionList[i].parent.answer})

            elif questionList[i].parent.question_type.lower() == 'multiple-choice':
                answerOptions = Option.query.filter_by(question_id = questionList[i].parent.id).all()
                answerOptions.append(questionList[i].parent.answer)

                # shuffles the answer options so that it randomises the options on the quiz page
                random.shuffle(answerOptions)
                
                myJSON.append({'question':questionList[i].parent.question,
                               'qType':'multiple',
                               'answerOptions': answerOptions,
                               'answer':questionList[i].parent.answer})
    return render_template('quizPage.html', questions = myJSON)

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

        #If form was submitted from active question list
        if(form.id_list.data):
            idDict = json.loads(form.id_list.data)
            print(idDict)
            CurrentQuestion.query.filter_by(question_number=idDict['questionNumber'],questionset_id=idDict['setID']).first().question_id = questionID

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
        return redirect(url_for('admin', questionsetID = idDict['setID']))

    #Validates to true if question set form was submitted
    if questionset_form.validate_on_submit():
        print(questionset_form.name.data)
        print(questionset_form.number_of_questions.data)
        q = QuestionSet(
            name = questionset_form.name.data, 
            number_of_questions = questionset_form.number_of_questions.data)
        db.session.add(q)
        db.session.commit()
    

        #Initialise new empty questions into question set
        q = QuestionSet.query.filter(QuestionSet.name==questionset_form.name.data).all()[0]
        for i in range(1, int(questionset_form.number_of_questions.data)+1):
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


    #print("variable: ", currentQuestion[4].option_child)
    questionset_number_of_questions = QuestionSet.query.filter_by(id=questionsetID).first().number_of_questions
    return render_template(
        'admin_page.html', 
        questionPool = questionPool, 
        form = form, 
        questionset_form = questionset_form, 
        currentQuestion = currentQuestion, 
        questionSet = questionSet, 
        currentSet = QuestionSet.query.filter_by(id=questionsetID).first(),                         #ID deducted by 1 to get position
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

    #Clears question ID rows in CurrentQuestion which have this question
    c = CurrentQuestion.query.filter_by(question_id=questionID).all()
    for row in c:
        row.question_id = ''
    
    db.session.commit()
    return redirect(url_for('admin'))

#Function that is initiated by an AJAX call that comes from selecting a new question set from the dropdown menu
#Function switches the active question set to the selected set
@app.route('/loadquestionset', methods = ['GET','POST'])
def questionset():
    setDict = request.get_json(force=True)
    questionsetID = setDict['questionsetID']
    return redirect(url_for('admin', questionsetID = questionsetID))

#Function that is initiated by an AJAX call that comes from editing a question
@app.route('/editquestion', methods= ['POST'])
def edit_question():
    questionDict = request.get_json(force=True)
    print(questionDict)

    questionID = questionDict['questionID']
    questionType = questionDict['questionType']
    question = questionDict['question']
    questionAnswer = questionDict['questionAnswer']

    if questionType == 'multiple-choice':
        optionList = questionDict['optionList']
        for option in optionList:
            optionID = option.split(':')[0] #ID
            optionValue = option.split(':')[1] #Value
            Option.query.filter_by(id = optionID).first().option_value = optionValue
        
    elif questionType == 'short-answer':
        Question.query.filter_by(id=questionID).first().question = question
        Question.query.filter_by(id=questionID).first().answer = questionAnswer
    db.session.commit()
    return redirect(url_for('admin'))

#Function that is initiated by an AJAX call that comes from deleting a question set
@app.route('/deleteset', methods=['POST'])
def delete_set():
    setDict = request.get_json(force=True)

    questionsetID = setDict['setID']
    #Deletes all  questions related to the set ID in CurrentQuestion table
    CurrentQuestion.query.filter_by(questionset_id = questionsetID).delete()

    #Deletes the set
    QuestionSet.query.filter_by(id = questionsetID).delete()

    db.session.commit()
    return redirect(url_for('admin'))