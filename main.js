const list_items = document.querySelectorAll('.list-item');
const lists = document.querySelectorAll('.list');
const questions = document.querySelectorAll('.question-item');
const questionBox = document.querySelectorAll('.question-list');

let draggedItem = null;
let replacedItem = null;
let draggingItem = null;
let dragIndex = 0;
let replaceIndex = 0;


function bigOne () { 
for( let i = 0; i < lists[0].children.length; i++) {
    let item = lists[0].children[i];
    console.log(item.hasAttribute("draggable"));
    item.setAttribute("draggable", true);

    item.addEventListener('dragstart', function() {
        draggedItem = item;
        console.log(draggedItem);
        for( let k = 0; k < lists[0].children.length; k++) {
            if( lists[0].children[k] == draggedItem) {
                dragIndex = k;
            }
        }
        console.log("TRY " + dragIndex);
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
        for( let k = 0; k < lists[0].children.length; k++) {
            if( lists[0].children[k] == replacedItem) {
                replaceIndex = k;
            }
        }
        if( dragIndex < replaceIndex) {
            lists[0].insertBefore(lists[0].children[dragIndex], lists[0].children[replaceIndex]);
            lists[0].insertBefore(lists[0].children[replaceIndex], lists[0].children[dragIndex]);
        }
        else {
            lists[0].insertBefore(lists[0].children[replaceIndex], lists[0].children[dragIndex]);
            lists[0].insertBefore(lists[0].children[dragIndex], lists[0].children[replaceIndex]);
        }
    })

    //dd
    

    const questionPool = lists[0];
    console.log(questionPool.childNodes);

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
        //this.append(draggedItem);
    })


    ;
    //for(let j = 0; j < lists.length; j++) {
        //const list = lists[j];

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