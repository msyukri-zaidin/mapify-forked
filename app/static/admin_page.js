const container = document.querySelectorAll('.container');
const question_slot = document.querySelectorAll('.question-slot');

let draggedItem = null;
let dragIndex = 0;
let replaceIndex = 0;

const pool = container[0].children[0];
const slots = container[0].children[1];

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
            if(item.parentNode.className == "questionPool") {
                //If the draggedItem came from a question slot
                if( draggedItem.parentNode.className == "question-slot") { 
                    draggedItem.parentNode.replaceChild(item, draggedItem);
                    pool.insertBefore(draggedItem, pool.children[replaceIndex])
                }
                //If the draggedItem came from the pool of questions
                else if (draggedItem.parentNode.className == "questionPool") {
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
                if(draggedItem.parentNode.className == "questionPool") { 
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
    $("#saveButton").click(function() {
        //This function looks at each of the question items and checks if there is any question in it
        for(var i = 1; i < 6; i++) { 
            var questionNumber = "Q" + i;
            var question;
            if(question = document.getElementById(questionNumber).firstElementChild) {
                questionElements = question.innerHTML.split("<br>");
                //Sends question details to the flask application
                $.post("/postmethod", {     
                    questionNumber:i,
                    questionID:questionElements[0],
                    questionContent:questionElements[1],
                    questionAnswer:questionElements[2]
            
                });
            }
                //Empty questions get sent too as well
            else {
                $.post("/postmethod", {
                    questionNumber:i,
                    questionID:'',
                    questionContent:'',
                    questionAnswer:''
            
                });
            }

        }
    })
});


