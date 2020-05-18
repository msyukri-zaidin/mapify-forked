const container = document.querySelectorAll('.container');
const question_slot = document.querySelectorAll('.question-slot');

let draggedItem = null;
let dragIndex = 0;
let replaceIndex = 0;



const pool = container[0].children[0];
const slots = container[0].children[1];

//Refreshes the page
function reset() {
    let setID = document.getElementById("questionset-name").getAttribute('value')
    let link = '/admin?questionsetID=' + setID;
    window.location = link;
}

//Function for question form radio buttons
//Selecting a radio button will trigger this function and show the appropriate form fields
function showAnswerField() {
    let questionType = document.getElementsByClassName('questionType');

    //questionType[0] is multiple-choice
    if(questionType[0].checked == true) {
        document.getElementById('form-short-answer').style.display = 'none';
        document.getElementById('form-multiple-choice-answer').style.display = 'block';
        document.getElementById('form-question-submit').style.display = 'block';
    }
    //questionType[1] is short-answer
    else if(questionType[1].checked == true) {
        document.getElementById('form-multiple-choice-answer').style.display = 'none';
        document.getElementById('form-short-answer').style.display = 'block';
        document.getElementById('form-question-submit').style.display = 'block';
    }
}

//Deduction for multiple choice field
function deductNum() {
    let num = document.getElementById('multiple-choice-num');
    if(num.innerHTML > 2 ) {
        num.innerHTML--;
        let option_num = parseInt(num.innerHTML,10);
        document.getElementById('multiple-choice-option-' + option_num).style.display = 'none';
    }
}

//Addition for multiple choice field
function addNum() {
    let num = document.getElementById('multiple-choice-num');
    if(num.innerHTML < 5) {
        num.innerHTML++;
        let option_num = num.innerHTML - 1;
        document.getElementById('multiple-choice-option-' + option_num).style.display = 'block';
    }
}

//Function for triggering the question set dropdown menu
function dropdown() {
    let elem = document.getElementById("dropdown");
    let questionSetName = document.getElementById("questionset-name");
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

//Function for question selection
let itemSelected = false;   //Checks if an item has been selected
let previousItem;           //The previously selected question item
function currentlySelected(questionItemID) {
    questionItem = document.getElementById(questionItemID);
    //If first time selecting on page
    if( itemSelected == false) {
        questionItem.style.borderColor = 'black';
        questionItem.children[3].style.display = 'block'; //Makes the edit and delete buttons appear
        itemSelected = true;
        previousItem = questionItem;
    }
    //If selecting same item as previous
    else if (itemSelected == true && questionItem == previousItem){
        questionItem.style.borderColor = '';
        questionItem.children[3].style.display = 'none';
        itemSelected = false;
    }
    //If an item has been selected but a selection has been made on another question item
    else {
        previousItem.style.borderColor = '';
        previousItem.children[3].style.display = 'none';
        questionItem.style.borderColor = 'black';
        questionItem.children[3].style.display = 'block';
        previousItem = questionItem;
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
                    let temp = draggedItem.cloneNode(true);
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


//jQuery for question set dropdown selection
//Selecting a question set sends the appropriate selection to the flask web app via an AJAX call. Upon success, a page refresh is initiated
$(document).ready(function(){
    for(let i = 0; i < questionSetTotal; i++) {
        //count corresponds to question set ID
        const count = i;
        $("#questionset-dropdown-option-" + count).click(function() {
            let dropdownID = "questionset-dropdown-option-" + count;
            let setID = document.getElementById(dropdownID).getAttribute('value');
            let myJSON = {
                questionsetID:setID
            }
            myJSON = JSON.stringify(myJSON);
            $.ajax({
                type: "POST",
                url: '/loadquestionset',
                data: myJSON,
                error: function (jqXHR, textStatus, errorThrown) {
                     console.log(textStatus); 
                    },
                success: function(data, textStatus) {
                    //Page refresh
                    let link = "/admin?questionsetID=" + setID
                    window.location = link;
                }
            })
        })
    }
})

$(document).ready(function(){
    $(".delete-button").click(function() {
        let modal = document.getElementById("deleteModal");
        modal.style.display = 'block';
    })
    $("#confirm-button").click(function() {
        //In-progress
        //console.log(previousItem.getAttribute('value'));
        /*
        let myJSON = {
            questionID:previousItem.getAttribute('value')
        }
        myJSON = JSON.stringify(myJSON);
        $.ajax({
            type:'POST',
            url:'/deletequestion',
            data: myJSON,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus); 
            },
           success: function(data, textStatus) {
                let setID = document.getElementById("questionset-name").getAttribute('value')
                let link = "/admin?questionsetID=" + setID
                window.location = link;
           }
        })
        */
    })
        
    
    $("#cancel-button").click(function() {
        let modal = document.getElementById("deleteModal");
        modal.style.display = 'none';
    })
    $("#new-questionset").click(function() {
        document.getElementById("questionset-modal").style.display = 'block';
    })
    $("#new-questionset-form-cancel").click(function() {
        document.getElementById("questionset-modal").style.display = 'none';
    })
    $("#save-button").click(function() {
        
        let myObj = {
            0:
            {
                questionNumber:0,
                questionID:0,
                questionSetID:0
            }
        }
        //This for loop looks at each of the question slots and checks if there is any question in it
        for(let i = 1; i <= questionSetNumberOfQuestions; i++) { 
            let questionNumber = "Q" + i;
            let question = document.getElementById(questionNumber).firstElementChild;
            //Initialises question details to an object
            if(question) {
                questionElements = question.innerHTML.split("<br>");
                myObj[i] = {questionNumber: i, questionID:questionElements[0], questionSetID:document.getElementById("questionset-name").getAttribute('value')}
            }
            //Empty question details get initialised too
            else {
                myObj[i] = {questionNumber:i, questionID:'', questionSetID:document.getElementById("questionset-name").getAttribute('value')}
            }
            

        }
        let myJSON = JSON.stringify(myObj);
        //AJAX call sends the JSON object and refreshes the webpage upon success
        $.ajax({
            type: "POST",
            url: '/postquestion',
            data: myJSON,

            error: function (jqXHR, textStatus, errorThrown) {
                 console.log(textStatus); 
                },
            success: function(data, textStatus) {
                let setID = document.getElementById("questionset-name").getAttribute('value')
                let link = '/admin?questionsetID=' + setID;
                window.location = link;
            }
        })
        
        
 
    })
});



