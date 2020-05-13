$(document).ready(function () {
    // Failed attempt at having exclusive header file, might need to use php
    $("#header").load("header.html");

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
    $('#enter-game-button').click(function () {
        $.fn.validateGame();
    });


    $('#header-login-button').click(function () {
        $('.login-modal').css("display", "flex");
    });
    $('#exitLogInModal').click(function () {
        $('.login-modal').css("display", "none");
    });

    /* var cw = $('.mini-card').width();
    $('.mini-card').css({ 'height': cw + 'px' }); */
});