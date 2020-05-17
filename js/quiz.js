/*
    This JS file builds the quiz page
    
*/


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

];


function createQuiz() {

    const mainBody = [];

    const sideBody = [];

    questions.forEach(
        (currentQuestion, questionNum) => {
            questionNum++;
            mainBody.push(
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
                        <button class="submitQ" type="button" onclick="getLatLong('${questionNum}');">Submit</button>
        
                    </div>

                    <h2 id="info${questionNum}"></h2>

                </div>
                `
            );

            sideBody.push(
                ` 
                <button class="myBtn unclicked" id="Q${questionNum}Button">Q${questionNum}</button><br><br>
                `
            );
        }
    );

    var side = `<div class="side">
                    <div class="buttons">
                        ${sideBody.join('')}
                    </div>
                </div>`;

    var quizContainer = document.getElementById('quiz');
    
    var quizBody = side + mainBody.join('');

    quizContainer.innerHTML = quizBody;

}

function correctAns(qNum) {
    // If the user gets the question right without using multiple attempts
    
    // Change the colour of the side buttons to be green
    // On the question div show that it is correct
    $('#Q'+qNum+'Button').removeClass('clicked');
    let sideButton = document.getElementById('Q'+qNum+'Button');
    sideButton.style.backgroundColor = 'lightgreen';
    sideButton.style.color = 'whitesmoke';

}


function getLatLong(qNum) {
    // Gets the user input for the question
    let currentAns = document.getElementById('ans'+qNum).querySelector('input').value;


    if (currentAns == '') {
        alert("Please enter your answer!");
        return;
    }
    else {
        if (currentAns == questions[qNum-1].answer) {
            console.log("Yes correct!");
            correctAns(qNum);
            return;
        }
        else {
            document.getElementById("mapCon"+qNum).style.display = "block";
        }
        
    }


    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': currentAns}, function(results, status) {
        
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            // document.getElementById("ShowLat").innerHTML = "Latitude: " + latitude;
            // document.getElementById("ShowLong").innerHTML = "Longitude: " + longitude;
            initMap(latitude, longitude, qNum);
        }

    });
}

// Creates the map with the a specified latitude (lat) and longitude (lang)
function initMap(lat, lng, qNum) {
    var location = {lat, lng};
    var map = new google.maps.Map(document.getElementById('map'+qNum), {
    center: location,
    zoom: 4,                // This needs to be changed to zoom in and out of the map
    disableDefaultUI: true, // Disables all the satellite, zoom features and other 
                            // which is unecessary for our webpage
    gestureHandling: 'cooperative' // This allows the map to be interactive
    });


    var emptyStyles = [
        {
            featureType: "all",
            elementType: "labels",
            stylers: [ { visibility: "off" } ]
        }
    ];

    //map.setOptions({styles: emptyStyles});



    let radius = 1000000/2; // Dynamically change the radius from this
                            // Everytime a button is clicked

    let newCoordinates = generatePoint(lat, lng, radius);
    //lat = parseFloat(newCoordinates.newLat.toFixed(6));
    //lng = parseFloat(newCoordinates.newLng.toFixed(6));
    
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

/*
                    <div id="mapCon${questionNum}" class="map_container">
                        <div id="map${questionNum}" class="googleMap"></div>
                    </div>

                    <div id="ans${questionNum}" class="input_container">

                        <input class="inputAns" type="text">
                        <button class="submitQ" type="button" onclick="getLatLong("ans${questionNum}");">Submit</button>
        
                    </div>
*/

createQuiz();