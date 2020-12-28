/*
    This JS file builds the quiz page
    Author: Ahbar Sakib
    
*/

// Constants to to specify the map settings and number of attempts
const zoomOptions = [1.6, 3.2, 4, 5, 6.5];
const radiusOptions = [3005000, 3005000/2, 3005000/4, 3005000/8];
const MAX_ATTEMPTS = 5;

/**
 * Function to change the styling of the quiz page if the user answers the question correctly
 * @param {int} qNum - Question Number 
**/
function correctAns(qNum) {
    // If the user gets the question right without using multiple attempts
    
    // Change the colour of the side buttons to be green
    // On the question div show that it is correct
    $('#Q'+qNum+'Button').removeClass('clicked');

    // Change the side button styling
    let sideButton = document.getElementById('Q'+qNum+'Button');
    sideButton.style.backgroundColor = '#1abc9c';
    sideButton.style.color = 'whitesmoke';

    // Tell the user they got the question correct
    let message = document.getElementById('msg'+qNum);
    message.innerHTML = "Correct!";
    message.style.color = '#1abc9c';
    message.style.display = 'block';

    //Update the points with respect to how many tries they used
    updatePoints(qNum, true);

}

// $({ countNum: $('#points').html() }).animate({ countNum: 999 }, {
//     duration: 8000,
//     easing: 'linear',
//     step: function () {
//     $('#points').html(Math.floor(this.countNum) + "+");
// },
// complete: function () {
//     $('#points').html(this.countNum + "+");
//     //alert('finished');
// }
// });

function updatePoints(qNum, isQuestionCorrect) {
    
    let points = document.getElementById('points').querySelector('b');
    let attemptNum = document.getElementById('attempts'+qNum).innerHTML;
    // if the question is multiple choice make a fixed increment
    if (attemptNum==0 && isQuestionCorrect) {
        points.innerHTML = parseInt(points.innerHTML) + 25;
        return;
    }
    //this statement below will only occur if the question is short answer
    let pointsAddition;
    if (attemptNum==1 && isQuestionCorrect) {
        pointsAddition = 50;
    }
    else {
        pointsAddition = (MAX_ATTEMPTS-attemptNum)*10;
    }
    points.innerHTML = parseInt(points.innerHTML)+pointsAddition;
}

function wrongAns(qNum, answer) {
    // If the user gets the question right without using multiple attempts
    
    // Change the colour of the side buttons to be green
    // On the question div show that it is correct

    $('#Q'+qNum+'Button').removeClass('clicked');

    // Chnage the side button styling
    let sideButton = document.getElementById('Q'+qNum+'Button');
    sideButton.style.backgroundColor = '#f56161';
    sideButton.style.color = 'whitesmoke';

    // Tell the user they got the question incorrect and what the correct answer is
    let message = document.getElementById('msg'+qNum);
    message.innerHTML = `<b>Correct Answer : </b> ${answer}`;
    message.style.color = '#f56161';
    message.style.display = 'block';
    
    //Update the points with respect to how many tries they used
    updatePoints(qNum, false);

}

function wrongAttempt(qNum, attemptNum) {
        // Tell the user they got the question incorrect and what the correct answer is
        let message = document.getElementById('msg'+qNum);
        message.innerHTML = `Incorrect...Please try again!<br>
                            Attempts Remaining : <b>${MAX_ATTEMPTS-attemptNum}</b>`;
        message.style.color = '#f56161';
        message.style.display = 'block';

}

function incrementAttempts(qNum) {
    return ++document.getElementById('attempts'+qNum).innerHTML;
}

function disableButton(qNum) {
    //let button = document.getElementById('ans'+qNum).querySelector('button');
    let button = document.getElementsByClassName('submitQ')[qNum-1]
    button.style.display = 'none';

}


function disableMCQButton(qNum) {
    //document.getElementById('mcq'+qNum).querySelector('button').style.display = 'none';
    document.getElementsByClassName('inputAns')[qNum-1].style.display = 'none';
}

function validateMCQ(qNum) {

    let selector =  `input[name=Q${qNum}]:checked`
    let userAnswer = (document.querySelector(selector) || {}).value

    let correctAnswer = document.getElementById('answer'+qNum).innerHTML;

    if (userAnswer == correctAnswer) {
        correctAns(qNum);
    } else {
        wrongAns(qNum, correctAnswer);
    }
    disableMCQButton(qNum);
}

/**
 * Function to validate the user input and check the answer
 * @param {String} qNum - Question Number 
 */
function validateAns(qNum, enter_button) {
    // $.get('/loadquiz?questionsetID=' + questionsetID, function(questions, status) {
    // Gets the user input for the question
    
    let currentAns = document.getElementsByClassName('inputAns')[qNum-1].value.toLowerCase();
    //let currentAns = document.getElementById('ans'+qNum).querySelector('input').value.toLowerCase();
    let answer = document.getElementById('answer'+qNum).innerHTML;
    let location = document.getElementById('reference'+qNum).innerHTML;
    if (location == 'None') {
        location = answer;
    }

    // Check if the answer field is empty and alter the user
    if (currentAns == '') {
        alert("Please enter your answer!");
        return;
    }
    else {
        numAttempts = incrementAttempts(qNum);
        let setZoom = zoomOptions[numAttempts-1];
        let setRadius = radiusOptions[numAttempts-1];
        if (currentAns == answer.toLowerCase()) {
            getMapWithMarker(qNum, location, setZoom, setRadius);
            correctAns(qNum);
            //enter_button.style.display = 'none'
            //removeClassName(qNum);
            disableButton(qNum);
        }
        else {
            if (numAttempts == MAX_ATTEMPTS) {
                getMapWithMarker(qNum, location, setZoom, setRadius);
                wrongAns(qNum, answer);
                
                enter_button.style.display = 'none'
                //disableButton(qNum);
            }
            else {       
                getMapWithRadius(qNum, location, setZoom, setRadius);
                wrongAttempt(qNum, numAttempts);
                if (numAttempts == 1) {
                    //removeClassName(qNum);
                }
            }  
        }   
    }
}

function removeClassName(qNum) {
    let element = document.getElementById(`Q${qNum}`).querySelector(".endOfDiv").classList;
    element.remove('endOfDiv');
}


function showNextQ(qNum) {
    $(`#Q${parseInt(qNum)+1}Button`).click();
}

function showPreviousQ(qNum) {
    $(`#Q${parseInt(qNum)-1}Button`).click();
}
/*
$(document).ready(function () {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // For popping up logins and signups form
    $('#submit-field').click(function () {
        let timeLeft = convertStringToTime('timer_label');
        let totalTime = parseInt(document.getElementById('totalTime').innerHTML);
        let multiplier = (1+(timeLeft/totalTime)).toFixed(2);

        let points = document.getElementById('points').querySelector('b');
        points.innerHTML = parseInt(parseInt(points.innerHTML) * parseFloat(multiplier));
    
        timeTaken = totalTime - timeLeft;

        document.getElementById('quiz-form-userID').value = userID
        document.getElementById('quiz-form-setID').value = questionsetID
        document.getElementById('quiz-form-score').value = points.innerHTML
        document.getElementById('quiz-form-time-taken').value = formatTime(timeTaken)
    });
});
*/
function submitQuiz() {
    let timeLeft = convertStringToTime('timer_label');
    let totalTime = parseInt(document.getElementById('totalTime').innerHTML);
    let multiplier = (1+(timeLeft/totalTime)).toFixed(2);

    let points = document.getElementById('points').querySelector('b');
    points.innerHTML = parseInt(parseInt(points.innerHTML) * parseFloat(multiplier));

    timeTaken = totalTime - timeLeft;

    document.getElementById('quiz-form-userID').value = userID
    document.getElementById('quiz-form-setID').value = questionsetID
    document.getElementById('quiz-form-score').value = points.innerHTML
    document.getElementById('quiz-form-time-taken').value = formatTime(timeTaken)
    document.getElementById('finish-form').submit()
}

/*
function submitQuiz() {

    let timeLeft = convertStringToTime('timer_label');
    let totalTime = parseInt(document.getElementById('totalTime').innerHTML);
    let multiplier = (1+(timeLeft/totalTime)).toFixed(2);

    console.log(parseFloat(multiplier));

    let points = document.getElementById('points').querySelector('b');
    points.innerHTML = parseInt(parseInt(points.innerHTML) * parseFloat(multiplier));

    timeTaken = totalTime - timeLeft;
    
    let myJSON = {
        userID: userID,
        questionsetID: questionsetID,
        score: points.innerHTML,
        timeTaken: formatTime(timeTaken)
    }
    myJSON = JSON.stringify(myJSON);
    $.ajax({
        type: "POST",
        url: '/submit-results',
        data: myJSON,
        error: function (jqXHR, textStatus, errorThrown) {
             console.log(textStatus); 
            },
        success: function(data, textStatus) {
            //Page redirect on success
            let link = 'result';
            window.location.href = link;
        }
    })
}
*/
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    
    return `${minutes}:${seconds}`;
}

function convertStringToTime(timeID) {
    let timer = document.getElementById(timeID).innerHTML;
    let timeArray = timer.split(":");
    return parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
}

function getMapWithMarker(qNum, location, setZoom, setRadius) {
    getLatLong(qNum, location, setZoom, setRadius, true);
    document.getElementById("mapCon"+qNum).style.display = "block";

}

function getMapWithRadius(qNum, location, setZoom, setRadius) {
    getLatLong(qNum, location, setZoom, setRadius);
    document.getElementById("mapCon"+qNum).style.display = "block";
}

/****************************************************************** */
// Implementation for admin form page
function createFormMap() {
    let location  = document.getElementById('form-reference-value').value;
    console.log(location);
    getLatLong(0, location, 8, 0, true);
    document.getElementById("map0").style.display = 'block';
}

function hideMap() {
    document.getElementById("map0").style.display = 'none';
}

/****************************************************************** */


/**
 * Function to get the latitude and longitude of a location
 * **/
function getLatLong(qNum, location, setZoom, setRadius, isMarker) {
    // $.get('/loadquiz?questionsetID=' + questionsetID, function(questions, status) {

    // let location = questions[qNum-1].answer;

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': location}, function(results, status) {
        
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            initMap(latitude, longitude, qNum, setZoom, setRadius, isMarker);
        }

    });
// });
}

// Creates the map with the a specified latitude (lat) and longitude (lang)
function initMap(lat, lng, qNum, setZoom, setRadius, isMarker) {
    var location = {lat, lng};
    var map = new google.maps.Map(document.getElementById('map'+qNum), {
    center: location,
    zoom: setZoom,                // This needs to be changed to zoom in and out of the map
    disableDefaultUI: true, // Disables all the satellite, zoom features and other 
                            // which is unecessary for our webpage
    gestureHandling: 'cooperative' // This allows the map to be interactive
    });


    // This allows the map to have no international datelines and equator
    var emptyStyles = [
        {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [ { visibility: "off" } ]
        }
    ];

    // Comment this to show international datelines and equator
    // map.setOptions({styles: emptyStyles});


    // if case is 0, apply the radius bubble
    // if case is 1, apply the d 

    if (isMarker) {

        // This gets the answer from the quiz page
        if (qNum == 0) {
            let location = document.getElementById('form-reference-value').value;
            var contentString = `<p1 class="infoMarker">${location}</p1>`
        } else {
            var answer = document.getElementById("answer"+qNum).innerHTML;
            var contentString = `<p1 class="infoMarker">${answer}</p1>`
        }
        

        var infowindow = new google.maps.InfoWindow ({
            content: contentString
        });

        var marker = new google.maps.Marker({
            position: location,
            // label: 'A',
            map: map
        });

        infowindow.open(map, marker);
        
    } else {
        radius = setRadius;

        let newCoordinates = generatePoint(lat, lng, radius);
        
        // Redefine the latitude and longitude to offset the radius bubble
        lat = newCoordinates.newLat;
        lng = newCoordinates.newLng;
    
    
        // Draw the radius circle on the map
        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: {lat, lng},
            radius: radius
        });
    }
}


function generatePoint(lat, lng, radius) {
    var r, radius, theta;
    // Gets a random angle inside a full circle
    theta = Math.random() * 2 * Math.PI;
    // this gets a smaller portion of the radius
    r = radius * Math.sqrt(Math.random());

    // This is the cartesian coordinates which offsets the
    // original latitude and longitude
    newLat = lat + ((r * Math.cos(theta))/1100)*0.01;
    newLng = lng + ((r * Math.sin(theta))/1100)*0.01;

    return {newLat, newLng};
}

