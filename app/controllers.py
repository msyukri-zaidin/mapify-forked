from app.forms import QuestionForm, QuestionsetForm, LoginForm, RegistrationForm
from app.models import load_user
from flask import render_template, flash, redirect, url_for, request, jsonify
from app.models import Question, CurrentQuestion, QuestionSet, Option, User
from flask_login import current_user, login_user, logout_user, login_required
from app import db, login
import random

class UserController():
    def login():
        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(username = form.username.data).first()
            if user is None or not user.check_password(form.password.data):
                flash('invalid username or data')
                return redirect(url_for('login'))
            else:
                #Login successful
                login_user(user)
                next_page = request.args.get('next')
                if not next_page or url_parse(next_page).netloc !='':
                    next_page = 'home'
                return redirect(url_for(next_page))
        else:
            flash('invalid')

        return render_template('login.html', title="Log In", form=form)

    def logout():
        logout_user()
        return redirect(url_for('home'))

    def register():
        form = RegistrationForm()
        if form.validate_on_submit():
            #Form succeeds
            user = User.query.filter_by(username=form.username.data).first()
            if user is not None:
                #Username already taken
                return redirect(url_for('home'))
            if current_user.is_authenticated:
                if not user.check_password(form.password.data):
                    #Incorrect password
                    return redirect(url_for('home'))
            
            user = User(
                user_type = 'regular',
                username = form.username.data,
            )
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            login_user(user, remember=False)
            return redirect(url_for('home'))
        else:
            print("invalid")
        return render_template('register.html', title='Register', form=form)

    def user_list():
        userList = User.query.all()
        return userList

    def delete_user():
        userDict = request.get_json(force=True)
        userID = int(userDict['userID'])
        print("Deleting user ID: ", userID)
        User.query.filter_by(id=userID).delete()
        db.session.commit()
        return redirect(url_for('user_list'))

    def promote_user():
        userDict = request.get_json(force=True)
        userID = int(userDict['userID'])
        User.query.filter_by(id=userID).first().user_type = 'admin'
        db.session.commit()
        return redirect(url_for('user_list'))   

    def demote_user():
        userDict = request.get_json(force=True)
        userID = int(userDict['userID'])
        User.query.filter_by(id=userID).first().user_type = 'regular'
        db.session.commit()
        return redirect(url_for('user_list'))   

class QuestionController():
    def create_question(form):
        #Validates to true if the question form was submitted
        if form.validate_on_submit():
            option_value_list = [
                form.option_value_1.data,
                form.option_value_2.data,
                form.option_value_3.data,
                form.option_value_4.data,
            ]
            questionsetID = 1 #Default question set ID to return to at redirect

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
                questionsetID = idDict['setID']

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
            return redirect(url_for('admin', questionsetID = questionsetID))

    def edit_question():
        #Function that is initiated by an AJAX call that comes from editing a question
        questionDict = request.get_json(force=True)
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

    def question_arrangement():
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

class QuestionSetController():
    def create_questionset(questionset_form):
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

    def delete_questionset():
        #Function that is initiated by an AJAX call that comes from deleting a question set
        setDict = request.get_json(force=True)

        questionsetID = setDict['setID']
        #Deletes all  questions related to the set ID in CurrentQuestion table
        CurrentQuestion.query.filter_by(questionset_id = questionsetID).delete()

        #Deletes the set
        QuestionSet.query.filter_by(id = questionsetID).delete()

        db.session.commit()
        return redirect(url_for('admin'))

class QuizController():
    def generate_quiz():
        questionsetID = request.args.get('questionsetID')
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