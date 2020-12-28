let setID; //The set ID that is currently selected
let randomSetId = null;
function saveSet(id) {
    let setID_form = document.getElementById('setID-form');
    if (setID == undefined) {
        document.getElementById(id).style.color = 'black';
        document.getElementById(id).style.border = 'solid white'
    }
    else {
        if (randomSetId != null) {
            document.getElementById("random" + randomSetId).style.color = '';
            document.getElementById("random" + randomSetId).style.border = ''
            randomSetId = null;
        }
        else {
            document.getElementById(setID).style.color = '';
            document.getElementById(setID).style.border = ''
        }
        document.getElementById(id).style.color = 'black';
        document.getElementById(id).style.border = 'solid white';
    }
    if (String(id).slice(0, 6) == "random") {
        randomSetId = String(id).slice(-1);
        setID = randomSetId
        setID_form.value = setID
    }
    else {
        setID = id;
        setID_form.value = setID
    }
}
$(document).ready(function () {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // For popping up logins and signups form
    $('#submit-field').click(function () {
        if (authenticated == 'True') {
            if (setID == undefined) {
                alert("Select a question set");
                return '';
            }
            else {
                let link = 'quiz?questionsetID=' + setID;
                window.location.href = link;
            }
        }
        else {
            if (document.getElementById('username-input').value == '') {
                alert("Please insert a username");
                return '';
            }
            else if (setID == undefined) {
                alert("Select a question set");
                return '';
            }
            let myJSON = {
                username: document.getElementById('username-input').value
            }
            myJSON = JSON.stringify(myJSON);

            /*
            $.ajax({
                type: "POST",
                url: '/mapify/register-anon/',
                data: myJSON,
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                },
                success: function (data, textStatus) {
                    //Page redirect on success
                    let link = 'quiz?questionsetID=' + setID;
                    window.location.href = link;
                }
            });*/
        }
    });
    
    $('#generate-random').click(function() {
        $.ajax({
            url: "https://randomuser.me/api/",
            headers: {
                "Accept" : "application/json",
            },
            dataType: "json",
            success: function (data) {
                //randName = data.results[0].login.username; $('#username-list').append($('<div class="suggestion" class="hoverable">' + randName + '</div>'));
                console.log(data.results[0].login.username)
                document.getElementById('username-input').value = data.results[0].login.username;
                document.getElementById('random-username-field').innerHTML = data.results[0].login.username;
            }
        });
    })
});
