const hsStorage = "codingQuizHighScoresList"; // name used for localstorage
const lastPage = 6; // last page that can be displayed

var timerVal = 75; // starting time
var highScores = []; // high score list initialization
var interval; // timer

getHighScores(); // retrieve high score list from local storage
setAnswerButtons(); // add event listeners to all answer buttons

// Add event listeners to the rest of the buttons
document.getElementById("highScoresBtn").addEventListener("click", displayHighScores);
document.getElementById("goBackBtn").addEventListener("click", goBack);
document.getElementById("clearScores").addEventListener("click", clearHighscores);
document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("initialsBtn").addEventListener("click", saveInitials);

// Onclick event for "View Highscores" button on navigation bar
function displayHighScores() {
    var highscoresSection = document.getElementById("highscores");
    var highscoresList = document.getElementById("highscoreList");

    clearInterval(interval); // Just in case timer is running

    // Delete current list items
    clearHighscoresList();

    // Create list items for each high scorer
    for (var i=0; i < highScores.length; i++) {
        var newListItem = document.createElement("li");
        newListItem.textContent = highScores[i];
        highscoresList.appendChild(newListItem);
    }

    // Hide all sections, including navigation bar, then unhide highscores section
    hideAll();
    document.querySelector("nav").hidden = true;
    highscoresSection.hidden = false;
}

// Onclick event for "Go Back" button on Highscores section
function goBack() {
    // Reset timer
    timerVal = 75;
    document.getElementById("timerValue").textContent = timerVal.toString();

    // Hide all sections, then unhide navigation bar and welcome section
    hideAll();
    document.querySelector("nav").hidden = false;
    document.getElementById("welcome").hidden = false;
}

// Onclick event for "Clear Highscores" button on Highscores section
function clearHighscores() {
    // Delete each list item form Highscores section
    clearHighscoresList();
    
    // Clear highscores list and write to localstorage
    highScores = [];
    setHighScores();
}

// Onclick event for "Start Quiz" button on welcome section
function startQuiz() {
    // Hide all sections, then unhide the first page
    hideAll();
    document.getElementById("page1").hidden = false;

    // Start timer:
    timerVal = 76; // start with 76 seconds - will be decremented before display
    clearInterval(interval); // make sure no timer is already running
    //Call updateTimer once every second
    interval = setInterval(updateTimer, 1000);
}

// Onclick event for all answer buttons
function answerButtons(event) {
    var currentPage = event.target.parentElement.getAttribute("name"); // index of current page
    var nextPage = parseInt(currentPage) + 1; // index of next page
    var correctAnswer = event.target.parentElement.getAttribute("value"); // index of correct answer
    var userAnswer = event.target.value; // index of user's answer

    // If time is up, go to last page; can be less than 0 because 10 subtracted for wrong answers
    if (timerVal <= 0) {
        nextPage = lastPage;
    }

    // Advance to next page
    goToPage(nextPage);

    // If user entered correct answer, then display "Correct"
    if (userAnswer === correctAnswer) {
        document.getElementById("correct").hidden = false;
    }
    // If user entered incorrect answer, then display "Incorrect", and take away 10 seconds from timer
    else {
        document.getElementById("incorrect").hidden = false;
        timerVal = timerVal - 10;
    }
}

// Onclick event for "Submit" button on Complete section
function saveInitials() {
    var initialsInput = document.getElementById("initials"); // get Input element
    highScores.splice(0, 0, initialsInput.value + " - " + timerVal.toString()); // add high score to beginning
    initialsInput.value = ""; // clear Input element
    setHighScores(); // save new highscores list to localstorage
    displayHighScores(); // display the highscores
}

// Adds onclick event to all 20 answer buttons
function setAnswerButtons() {
    var answerBtns = document.getElementsByClassName("answerBtn")
    for (var i = 0; i < answerBtns.length; i++) {
        answerBtns[i].addEventListener("click", answerButtons);
    }
}

// Hides all sections; used before displaying current section
function hideAll() {
    var sections = document.getElementsByTagName("section");

    for (var i=0; i < sections.length; i++) {
        sections[i].hidden = true;
    }
}

// Retrieves highscore list from localstorage, if it's there
function getHighScores() {
    var hsList = JSON.parse(localStorage.getItem(hsStorage));

    if (hsList) {
        highScores = hsList;
    }
}

// Stores highscore list to localstorage
function setHighScores() {
    localStorage.setItem(hsStorage, JSON.stringify(highScores));
}

// Removes list items from Highscores section
function clearHighscoresList() {
    var highscoresList = document.getElementById("highscoreList");

    // Delete each list item until none remain
    while (highscoresList.childNodes.length > 0) {
        highscoresList.removeChild(highscoresList.childNodes[0]);
    }
}

function updateTimer() {
    // Check for <0 just in case - can happen because 10 seconds subtracted for wrong answers!
    if (timerVal <= 0) {
        goToPage(lastPage);
        alert("Time's up!");
    }
    else {
        timerVal--; // decrement timer
        document.getElementById("timerValue").textContent = timerVal.toString(); // display current timer value
    }
}

function goToPage(nextPg) {
    // If quiz is done, stop timer, update score on Complete section
    if (nextPg === lastPage) {
        clearInterval(interval);
        document.getElementById("finalScore").textContent = timerVal.toString();
    }

    // Hide everything, then determine which sections to unhide
    hideAll();

    // Advance to next page
    document.getElementsByName(nextPg.toString())[0].hidden = false;
}