
let setID; //The set ID that is currently selected
let randomSetId = null;
function saveSet(id) {
    if (setID == undefined) {
        document.getElementById(id).style.color = 'black';
    }
    else {
        if (randomSetId != null) {
            document.getElementById("random" + randomSetId).style.color = '';
            randomSetId = null;
        }
        else {
            document.getElementById(setID).style.color = '';
        }
        document.getElementById(id).style.color = 'black';
    }
    if (String(id).slice(0, 6) == "random") {
        randomSetId = String(id).slice(-1);
        setID = randomSetId
    }
    else {
        setID = id;
    }
    console.log(setID)
}
$(document).ready(function () {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // For popping up logins and signups form
    $('#start-button').click(function () {
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
            $.ajax({
                type: "POST",
                url: '/register-anon',
                data: myJSON,
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                },
                success: function (data, textStatus) {
                    //Page redirect on success
                    let link = 'quiz?questionsetID=' + setID;
                    window.location.href = link;
                }
            });
        }
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // For name suggestions that users can choose from
    $.fn.createListOfNames = function () {
        // Currently this API can provide random name
        // We would want to have a list of names that are less associative to people/human
        var randName = "";

        for (let i = 0; i < 4; i++) {
            $.ajax({
                url: "https://randomuser.me/api/",
                dataType: "json",
                success: function (data) {
                    randName = data.results[0].login.username; $('#username-list').append($('<div id="suggestion" class="hoverable">' + randName + '</div>'));
                }
            });
        }
    };
    $(document).on('click', '#suggestion', function () {
        var username = $('#username-input');
        username.val($(this).text());
    })
    $.fn.createListOfNames();
});
