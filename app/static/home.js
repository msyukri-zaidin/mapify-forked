
$('#points').hide();

$(document).ready(function () {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // url for getting photos on pixabay = https://pixabay.com/api/?key={ KEY }&q=yellow+flowers&image_type=photo
    // For choosing the game set and loading more game set into the screen
    $(document).on('click', '#load-more', function () {
        $('#game-sets').slideToggle("slow");
    });
    let setID; //The set ID that is currently selected
    $.fn.saveSet = function (id) {
        if (setID == undefined) {
            $('#getElementById').css("color", "black");
            setID = id;
        }
        else {
            $('#setID').css("color", "");
            $('#id').css("color", "black");
            setID = id;
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // For popping up logins and signups form
    $('#start-button').click(function () {
        if (document.getElementById('username-input').value == '' && authenticated == 'False') {
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
        if (authenticated == 'True') {
            let link = 'quiz?questionsetID=' + setID;
            window.location.href = link;
        }
        else {
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
            })
        }
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // For name suggestions that users can choose from
    $.fn.createListOfNames = function () {
        // Currently this API can provide random name
        // We would want to have a list of names that are less associative to poeple/human
        var randName = "";
        for (let i = 0; i < 4; i++) {
            $.ajax({
                url: "https://randomuser.me/api/",
                dataType: "json",
                success: function (data) {
                    randName = data.results[0].login.username; $('#username-list').append($('<div id="suggestion" class="hoverable">' + randName + '</div>'));
                },
                error: function (xhr, status, error) {
                    alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
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
