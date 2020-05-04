
$(document).ready(function () { 
    $.fn.showResult = function () {
        showUserPoints();
        showUserStats();
        showScoreboard();
        showQuestionReviews();
    } 

    $.fn.showUserPoints = function () {
        let scoreArea = $('#user-score').val();
    }

    $.fn.showUserStats = function () {
        let scoreArea = $('#user-score').val();
    }

    $.fn.showScoreboard = function () {
        let scoreArea = $('#user-score').val();
    }

    $.fn.showQuestionReviews = function () {
        let qReview = $('#question-review').val();
    }
})