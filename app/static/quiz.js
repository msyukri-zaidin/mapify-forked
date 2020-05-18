/*
    This JS file builds the quiz page
    Author: Ahbar Sakib
    
*/

// Constants to to specify the map settings and number of attempts
const zoomOptions = [1.6, 3.2, 4, 5];
const radiusOptions = [3005000, 3005000/2, 3005000/4, 3005000/8];
const MAX_ATTEMPTS = 5;

// This is a container of questions replicating a JSON object
/*
const questions = [
    {
        question: "What is the capital of Australia?",
        answer: "Canberra"
    },
    {
        question: "What is the capital of Bangladesh?",
        answer: "Dhaka"
    },
    {
        question: "What is the capital of Afghanistan?",
        answer: "Kabul"
    },

    {
        question: "Which city is the Eiffel Tower located?",
        answer: "Paris"
    },

    {
        question: "What is the capital of India?",
        answer: "New Delhi"
    },

    {
        question: "Which city is the Statue of Liberty located in?",
        answer: "New York"
    },
    {
        question: "What is the capital of Scotland?",
        answer: "Glasgow"
    }

];*/



// This function is responsible for rendering the basic template of the HTML quiz page



function createQuiz() {
    /* 
        'MainBody' an array which will contain all the main HTML divs' code for each question
        It includes the Question Number, the question, map, input answers and submit buttons    
    */
    let mainBody = [];

    /*
        'SideBody' is an array that will contain the sidebar with all the questions 
        and its corresposing question
    */
    let sideBody = [];
    
    // For each question, make the necessary divs and side buttons
    $.get('/loadquiz?questionsetID=' + questionsetID, function(questions, status) {
        console.log(questions);
    questions.forEach(
        (currentQuestion, questionNum) => {
            //Since questionNum is initialised as 0 we need to increment it, so we dont have a Question 0
            questionNum++;
            mainBody.push(
                // HTML code for each question
                `
                <div id="Q${questionNum}" class="main">
                    <h1>Question ${questionNum}</h1>
                    <p>
                        ${currentQuestion.question}
                    </p>

                    <div id="mapCon${questionNum}" class="map_container">
                        <div id="map${questionNum}" class="googleMap"></div>
                    </div>

                    <div id="ans${questionNum}" class="input_container">

                        <input class="inputAns" type="text">
                        <!-- button used to validate answer and generate the map of the location if incorrect -->
                        <button class="submitQ" type="button" onclick="validateAns('${questionNum}');">Enter</button>
        
                    </div>

                    <!-- This is hidden right now but will contain information of how many times a button is clicked -->
                    <h2>0</h2>

                    <h2 id="msg${questionNum}"></h2>


                </div>
                `
            );

            // HTML code to create the side buttons for each corresponding question
            sideBody.push(
                ` 
                <button class="myBtn unclicked" id="Q${questionNum}Button">Q${questionNum}</button><br><br>
                `
            );
        }
    );


    // side contains some HTML code which contains classes to style and format the container
    // which houses the side buttons
    let side = `<div class="side">
                    <div class="buttons">
                        ${sideBody.join('')}
                    </div>
                </div>`;

    // get the container with the 'quiz' ID inside the body
    let quizContainer = document.getElementById('quiz');

    // Change the innerHTML of the container to quiz page body
    quizContainer.innerHTML = side + mainBody.join('');
})
}

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

    // Disable the enter button
    // document.getElementById('ans'+qNum).querySelector('button').disabled = true;
}

function wrongAns(qNum) {
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
    message.innerHTML = `<b>Correct Answer : </b> ${questions[qNum-1].answer}`;
    message.style.color = '#f56161';
    message.style.display = 'block';
    

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
    return ++document.getElementById('Q'+qNum).querySelector('h2').innerHTML;
}

function disableButton(qNum) {
    document.getElementById('ans'+qNum).querySelector('button').disabled = true;
}


/**
 * Function to validate the user input and check the answer
 * @param {String} qNum - Question Number 
 */
function validateAns(qNum) {
    $.get('/loadquiz?questionsetID=' + questionsetID, function(questions, status) {
    // Gets the user input for the question
    let currentAns = document.getElementById('ans'+qNum).querySelector('input').value;

    // Check if the 
    if (currentAns == '') {
        alert("Please enter your answer!");
        return;
    }
    else {
        if (currentAns == correct) {
            correctAns(qNum);
            disableButton(qNum);
            // go to next slide
            // show map with a marker
        }
        else {
            numAttempts = incrementAttempts(qNum);
            console.log(numAttempts);
            if (numAttempts == MAX_ATTEMPTS) {
                wrongAns(qNum);
                //disable button
                disableButton(qNum);
                return;
                // show the map with a marker
                // go to next slide
            }
            else {
                
                let setZoom = zoomOptions[numAttempts-1];
                let setRadius = radiusOptions[numAttempts-1];
                getLatLong(qNum, setZoom, setRadius);
                // initMap(lat, lng, zoom[numAttempts], radius[numAttempts], qNum);
                document.getElementById("mapCon"+qNum).style.display = "block";

                wrongAttempt(qNum, numAttempts);

            }
            
        }
        
    }
})

}


/**
 * Function to get the latitude and longitude of a location
 * **/
function getLatLong(qNum, setZoom, setRadius) {
    $.get('/loadquiz?questionsetID=' + questionsetID, function(questions, status) {

    let location = questions[qNum-1].answer;

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': location}, function(results, status) {
        
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            initMap(latitude, longitude, qNum, setZoom, setRadius);
        }

    });
})
}

// Creates the map with the a specified latitude (lat) and longitude (lang)
function initMap(lat, lng, qNum, setZoom, setRadius) {
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

createQuiz();