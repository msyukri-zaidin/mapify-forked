/******************************************************************** */
/**
 * Progress countdown timer for the quiz
 */

const TIME_LIMIT = parseInt(document.getElementById('totalTime').innerHTML);
let timeLeft = TIME_LIMIT;
const WARNING_THRESHOLD = 30;
const ALERT_THRESHOLD = 10;

const COLOR_CODES = {
    info: {
        color: '#1abc9c'
    },
    warning: {
        color: "#ffd630",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: '#f56161',
        threshold: ALERT_THRESHOLD
    }
};

let timePassed = 0;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("timer").innerHTML = 
`<div id="container" class="timerBar_container">
    <div id="timer_total" class="timer_bar"></div>
    <div id="timer_remaining" class="timer_bar"></div>
</div>

<div id="timer_label" class="timer_label">
        ${formatTime(timeLeft)}
</div>
`;

startTimer();


function getElementWidth() {
    console.log(document.getElementById('container').offsetWidth);

}


function onTimesUp() {
    clearInterval(timerInterval);
    document.getElementById('timer_remaining').style.width = '100%';
    document.getElementById('timer_remaining').style.marginLeft = '0%';
    //console.log(document.getElementById("base-timer-path-remaining").setAttribute("d", `M 0 0 L 500 0`));
    // console.log(document.querySelector('line[class="base-timer__path-elapsed"]').style.stroke);
    // document.querySelector('line[class="base-timer__path-elapsed"]').style.stroke = 'red';
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("timer_label").innerHTML = formatTime(
        timeLeft
        );
        setTimeBar();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) {
        onTimesUp();
        }
    }, 1000);
}

//startTimer();

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
    seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        document
        .getElementById('timer_remaining').style.backgroundColor = alert.color;
        // .classList.remove(warning.color);
        // document
        // .getElementById('timer_remaining')
        // .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
        .getElementById('timer_remaining').style.backgroundColor = warning.color;
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setTimeBar() {
    const timeBar = `${(calculateTimeFraction() * 100).toFixed(2)}`;
    document.getElementById("timer_remaining").style.width = `${timeBar}%`;
    document.getElementById('timer_remaining').style.marginLeft = `${100 - timeBar}%`;
}



 /******************************************************************** */