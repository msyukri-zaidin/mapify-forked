<<<<<<< Updated upstream
$(document).ready(function () {
=======
$(document).ready(function () { 
>>>>>>> Stashed changes
    $.fn.showResult = function () {
        showUserPoints();
        showUserStats();
        showScoreboard();
        showQuestionReviews();
<<<<<<< Updated upstream
    }
=======
    } 
>>>>>>> Stashed changes

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