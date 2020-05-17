const container = document.querySelectorAll('.container');
const question_slot = document.querySelectorAll('.question-slot');

let draggedItem = null;
let dragIndex = 0;
let replaceIndex = 0;

const pool = container[0].children[0];
const slots = container[0].children[1];

function reset() {
    var setID = document.getElementById("questionset-name").getAttribute('value')
    var link = '/admin?questionsetID=' + setID;
    window.location = link;
}

function showQuestionsetForm() {
    document.getElementById("new-questionset-form").style.display = 'block';
}

function hideQuestionsetForm() {
    document.getElementById("new-questionset-form").style.display = 'none';
}

function showAnswerField() {
    var questionType = document.getElementsByClassName('questionType');

    //questionType[0] is multiple-choice
    if(questionType[0].checked == true) {
        document.getElementById('form-short-answer').style.display = 'none';
        document.getElementById('form-multiple-choice-answer').style.display = 'block';
    }
    //questionType[1] is short-answer
    else if(questionType[1].checked == true) {
        document.getElementById('form-multiple-choice-answer').style.display = 'none';
        document.getElementById('form-short-answer').style.display = 'block';
    }
}

//Deduction for multiple choice field
function deductNum() {
    var num = document.getElementById('multiple-choice-num');
    if(num.innerHTML > 2 ) {
        num.innerHTML--;
        var optionList = document.getElementById('multiple-choice-option-list');
        optionList.removeChild(optionList.lastChild);
    }
}

//Addition for multiple choice field
function addNum() {
    var num = document.getElementById('multiple-choice-num');
    if(num.innerHTML < 5) {
        num.innerHTML++;
        var optionList = document.getElementById('multiple-choice-option-list');
        var option = document.getElementsByClassName('multiple-choice-option')[0].cloneNode(true);
        option.innerHTML = "<br>Possible Option " + "<input type='text' class='option-input'>";
        optionList.appendChild(option);
    }
}

//Function for triggering the question set dropdown menu
function dropdown() {
    var elem = document.getElementById("dropdown");
    var questionSetName = document.getElementById("questionset-name");
    //If menu already triggered
    if(elem.style.display == 'block') {
        //Hide the dropdown menu
        elem.style.display = 'none';
        //Reset styles
        questionSetName.style.color = ''
        questionSetName.style.backgroundColor = ''
    }
    //Else -> menu not triggered
    else {
        //Show the dropdown menu
        elem.style.display = 'block';
        //Reverse styling
        questionSetName.style.color = '#444'
        questionSetName.style.backgroundColor = 'whitesmoke'
    }
}

//For loop iterates through all question items on the page
for( let i = 0; i < container[0].children.length; i++) {
    for( let j = 0; j < container[0].children[i].children.length; j++) {

        //Initialisation and declaration of question item
        let item = container[0].children[i].children[j];
        //Question slots need to be reassigned to their child which is a question item
        if(item.className == "question-slot") {
            item = item.children[0];
        }

        //Empty question slots are undefined so we continue the loop to prevent adding events to it
        if(typeof item == 'undefined') {
            continue;
        }

        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', function(e) {
            draggedItem = item;
            //For loop for identifying the position of the dragged question item
            for( let m = 0; m < item.parentNode.children.length; m++) {
                if(item.parentNode.children[m] == item) {
                    dragIndex = m;
                }
            }
            //console.log("Drag source: " + dragIndex);
        })


        //In this function, item signifies the question item you are dropping the 'draggedItem' on to
        item.addEventListener('drop', function(e) {
            e.preventDefault();
            //For loop for identifying the position of the replacing question item
            for( let m = 0; m < item.parentNode.children.length; m++) {
                if(item.parentNode.children[m] == item) {
                    replaceIndex = m;
                    //console.log("Replacing to: " + replaceIndex);
                }
            }

            //If the question item you are dropping the 'draggedItem' is on the pool of questions
            if(item.parentNode.className == "question-pool") {
                //If the draggedItem came from a question slot
                if( draggedItem.parentNode.className == "question-slot") { 
                    draggedItem.parentNode.replaceChild(item, draggedItem);
                    pool.insertBefore(draggedItem, pool.children[replaceIndex])
                }
                //If the draggedItem came from the pool of questions
                else if (draggedItem.parentNode.className == "question-pool") {
                    //These if-else statements are for swapping question items that are both located on the pool of questions
                    if( dragIndex < replaceIndex) {
                        item.parentNode.insertBefore(item.parentNode.children[dragIndex], item.parentNode.children[replaceIndex]);
                        item.parentNode.insertBefore(item.parentNode.children[replaceIndex], item.parentNode.children[dragIndex]);
                    }
                    else if (dragIndex > replaceIndex) {
                        item.parentNode.insertBefore(item.parentNode.children[replaceIndex], item.parentNode.children[dragIndex]);
                        item.parentNode.insertBefore(item.parentNode.children[dragIndex], item.parentNode.children[replaceIndex]);
                    }
                    //Does nothing if dragIndex == replaceIndex
                }
            }
            //If you are dropping the 'draggedItem' on a question slot and it is a FILLED question slot
            else if(item.parentNode.className == "question-slot" && item.parentNode.children.length >= 1) { 
                //If the draggedItem is from the pool of questions
                if(draggedItem.parentNode.className == "question-pool") { 
                    item.parentNode.replaceChild(draggedItem, item);
                    pool.insertBefore(item, pool.children[dragIndex]);
                }
                //If the draggedItem is from another question slot
                else if(draggedItem.parentNode.className =="question-slot") {
                    var temp = draggedItem.cloneNode(true);
                    draggedItem.parentNode.append(temp);
                    item.parentNode.replaceChild(draggedItem, item);
                    temp.parentNode.replaceChild(item, temp);
                }
            }

        
        })

        pool.addEventListener('dragover', function(e) {
            e.preventDefault();
        })
        pool.addEventListener('dragenter', function(e) {
            e.preventDefault();
        })
        //Listener for question pool
        pool.addEventListener('drop',function(e){
            //Adds to question pool list if dragged item came from question slot
            if(draggedItem.parentNode.className == "question-slot") {
                this.append(draggedItem);
            }
        });

        item.addEventListener('dragover', function(e) {
            e.preventDefault();
        })
    
        item.addEventListener('dragenter', function(e) {
            e.preventDefault();
        })

        //Listener for empty question slot
        for(let k = 0; k < question_slot.length; k++) {
            question_slot[k].addEventListener('dragover', function(e) {
                e.preventDefault();
            })
            question_slot[k].addEventListener('dragenter', function(e) {
                e.preventDefault();
            })
            question_slot[k].addEventListener('drop', function(e) {
                if (question_slot[k].children.length >= 1) { 
                    //Prevents 2 question items from being in the same question slot                   
                }
                //Adds question item to EMPTY question slot
                else if (draggedItem != null){
                    this.append(draggedItem);
                }
                
            })
        
        }

    }
}


$(document).ready(function(){
    for(var i = 0; i < questionSetTotal; i++) {
        const count = i;
        $("#questionset-dropdown-option-" + count).click(function() {
            var dropdownID = "questionset-dropdown-option-" + count;
            var setID = document.getElementById(dropdownID).getAttribute('value');
            var myJSON = {
                questionsetID:setID
            }
            var myJSON = JSON.stringify(myJSON);
            $.ajax({
                type: "POST",
                url: '/loadquestionset',
                data: myJSON,
                error: function (jqXHR, textStatus, errorThrown) {
                     console.log(textStatus); 
                    },
                success: function(data, textStatus) {
                    var link = "/admin?questionsetID=" + setID
                    window.location = link;
                }
            })
            /*
            if(q) {
                console.log("Afirm")
                $.post("/loadquestionset", {
                    questionsetID:q.innerHTML[0]
                });
            }
            */
        })
    }
})

$(document).ready(function(){
    $("#save-button").click(function() {
        //This function looks at each of the question slots and checks if there is any question in it
        var myObj = {
            0:
            {
                questionNumber:0,
                questionID:0,
                questionSetID:0
            }
        }
        for(var i = 1; i <= questionSetNumberOfQuestions; i++) { 
            var questionNumber = "Q" + i;
            var question = document.getElementById(questionNumber).firstElementChild;
            //Sends question details to the flask application
            if(question) {
                questionElements = question.innerHTML.split("<br>");
                myObj[i] = {questionNumber: i, questionID:questionElements[0], questionSetID:document.getElementById("questionset-name").getAttribute('value')}
            }
                //Empty questions get sent too as well
            else {
                myObj[i] = {questionNumber:i, questionID:'', questionSetID:document.getElementById("questionset-name").getAttribute('value')}
            }
            

        }
        var myJSON = JSON.stringify(myObj);
        //console.log(myJSON);
        $.ajax({
            type: "POST",
            url: '/postquestion',
            data: myJSON,

            error: function (jqXHR, textStatus, errorThrown) {
                 console.log(textStatus); 
                },
            success: function(data, textStatus) {
                var setID = document.getElementById("questionset-name").getAttribute('value')
                var link = '/admin?questionsetID=' + setID;
                window.location = link;
            }
        })
        
        
 
    })
});



