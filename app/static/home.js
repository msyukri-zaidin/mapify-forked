$(document).ready(function () {

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // Failed attempt at having exclusive header file, might need to use php
    $("#header").load("header.html");

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // For popping up logins and signups form
    $('#header-login-button').click(function () {
        $('.login-modal').css("display", "flex");
    });
    $('#exitLogInModal').click(function () {
        $('.login-modal').css("display", "none");
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // Function for when info is validifide and ready to move  into game
    $.fn.enterGame = function () {
        // Need to store all the information and guide to the next page
    }
    // Button pressing when starting the game
    $.fn.validateGame = function () {
        var username = $('#username-input').val();
        if (username == "") {
            alert("Please insert a username")
            // Might want to point out where the text area is
            return false;
        }
        // Here to put if statement for if difficulty is not set
        else {
            $.fn.enterGame();
        }
    }
    $('#start-button').click(function () {
        $.fn.validateGame();
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
                    randName = /* data.results[0].name.first +  */data.results[0].login.username;
                    console.log(randName);
                    $('#username-list').append($('<div id="suggestion" class="hoverable">' + randName + '</div>'));
                },
                error: function (xhr, status, error) {
                    alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                }
            });
        }
    };
    $(document).on('click', '#suggestion', function () {
        var username = $('#username-input');
        var name1 = username.val()
        var name2 = username.val($(this).text());
        console.log(name1 + " will be change to " + name2);
    })
    $.fn.createListOfNames();

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // For choosing the game set and loading more game set into the screen
    var gameSetChosen = "";
    $(document).on('click', '.mini-card', function () {
        gameSetChosen = $(this).text();
        // Note: I havent include the part where you can only select one game set
        $(this).css({
            'border-width' : '2px',
            'border-style' : 'solid',
            'border-color' : '#blue'
        });
        alert("game set: " + gameSetChosen);
    });
    $(document).on('click', '#load-more', function () {
        alert("load more button pressed");
    })
});
