const pool_items = document.querySelectorAll('.questionPool-item');
const container = document.querySelectorAll('.questionPool');
const questions = document.querySelectorAll('.question-item');
const questionBox = document.querySelectorAll('.question-list');

let draggedItem = null;
let replacedItem = null;
let draggingItem = null;
let dragIndex = 0;
let replaceIndex = 0;


function bigOne () { 
    for( let i = 0; i < container[0].children.length; i++) {
        let item = container[0].children[i];
        //console.log(item.hasAttribute("draggable"));
        item.setAttribute("draggable", true);

        item.addEventListener('dragstart', function() {
            draggedItem = item;
            console.log(draggedItem);
            for( let k = 0; k < container[0].children.length; k++) {
                if( container[0].children[k] == draggedItem) {
                    dragIndex = k;
                }
            }
        });

        item.addEventListener('dragend', function() {
            console.log('dragend');
            setTimeout(function(){
                draggedItem.style.display = 'block';
                draggedItem = null;
            }, 0)
        })

        //dd
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
        })

        item.addEventListener('dragenter', function(e) {
            e.preventDefault();
        })

        item.addEventListener('drop', function(e) {
            replacedItem = item;
            for( let k = 0; k < container[0].children.length; k++) {
                if( container[0].children[k] == replacedItem) {
                    replaceIndex = k;
                }
            }
            if( dragIndex < replaceIndex) {
                container[0].insertBefore(container[0].children[dragIndex], container[0].children[replaceIndex]);
                container[0].insertBefore(container[0].children[replaceIndex], container[0].children[dragIndex]);
            }
            else {
                container[0].insertBefore(container[0].children[replaceIndex], container[0].children[dragIndex]);
                container[0].insertBefore(container[0].children[dragIndex], container[0].children[replaceIndex]);
            }
        })

        //dd
        

        const questionPool = container[0];
        //console.log(questionPool.childNodes);

        questionPool.addEventListener('dragover', function(e) {
            e.preventDefault();
        })

        questionPool.addEventListener('dragenter', function(e) {
            e.preventDefault();
        })

        questionPool.addEventListener('drop', function(e) {
            if(draggedItem.parentNode.id == "QI") {
                this.append(draggedItem);
            }
            console.log(draggedItem.parentNode.id);
        })


        ;
        //for(let j = 0; j < container.length; j++) {
            //const list = container[j];

        for(let j = 0; j < questions.length; j++) {
            const questionContainer = questions[j];
            questionContainer.addEventListener('dragover', function(e) {
                e.preventDefault();
            })
            questionContainer.addEventListener('dragenter', function(e) {
                e.preventDefault();
            })
            questionContainer.addEventListener('drop', function(e) {
                if( this.childNodes.length == 2) {
                    const parent = draggedItem.parentNode;
                    parent.replaceChild(this.childNodes[1], draggedItem);
                    this.append(draggedItem);
                }
                else {
                    this.append(draggedItem);
                }
                //console.log(this.childNodes.length);
                //console.log(this.childNodes);
                //console.log(this.contains(draggedItem));

            })
        
        }
    }
}

$(document).ready(function(){
    bigOne();
    $("#btn1").click(function(){
        var question, answer, difficulty;
        question = document.getElementById("question").value;
        answer = document.getElementById("answer").value;
        if(document.getElementById("easy").checked == true) {
            difficulty = "Easy";

        }
        if(document.getElementById("medium").checked == true) {
            difficulty = "Medium";

        }
        if(document.getElementById("hard").checked == true) {
            difficulty = "Hard";

        }
        //difficulty = document.getElementById("difficulty").value;
        var txt1 = $("<div></div>").html(difficulty + "<br><br>QUESTION: <br>" + question + "<br><br>ANSWER: <br>" + answer);
        txt1.addClass("questionPool-item");
        console.log(txt1);
        $(".container .questionPool").append(txt1);
        //Temp implementation

        bigOne();
    })
});