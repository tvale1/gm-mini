import { questionText, mcOptionsText, optionsClick, displayEndGame, todaysDate, timeUntilEndOfDay, daysBetweenTwoDates } from "./functions/question-text.js";

//get Question Data
getData()
async function getData(){
    fetch('data/data.json')
    .then(response => response.json())
    .then((data) => {
        myApp(data);
    });
}

//application function
function myApp(data){
    
    let index = (daysBetweenTwoDates("2024-11-3", todaysDate())+6)%5;
    // let index = 3;
    
    //get player data from local storage: current score, if they've already played todays game etc.
    let playerData;
    
    if (localStorage.getItem("playerData") === null){
        playerData = {
            "score": 0,
            "total": 0,
            "streak": 0
        };
    }

    else {
        playerData = JSON.parse(localStorage.getItem("playerData"));
    }

    // console.log(playerData);

    //Check if already played today => Comment out this block if you need.
    if (Object.keys(playerData).includes('last-game-finished-date')){
        if (playerData['last-game-finished-date'] == todaysDate()){
            const endgame = document.querySelector(".end-game");
            let time = timeUntilEndOfDay();
            displayEndGame(endgame, playerData['score'], time, "rgba(132, 111, 252, 0.9)", "Play another puzzle tomorrow", "C", playerData["streak"], playerData['total'] );
        }
    }
    
    let app = document.querySelector(".wrapper"); //get the app of the html
    let questionString = "";
    
    // for the question stem text
    for (let n=0; n<data[index]['question']['stem'].length; n++){ //loop through the question structure to add it to the app
        questionString = questionText(data[index]['question']['stem'][n], questionString); //function questionText peices together text from the data so it's displayed as, text, equations, images, italics etc.
    }

    // for the question text
    for (let n=0; n<data[index]['question']['question-text'].length; n++){ //loop through the question structure to add it to the app
        questionString = questionText(data[index]['question']['question-text'][n], questionString); //function questionText peices together text from the data so it's displayed as, text, equations, images, italics etc.
    }

    // MC options text
    questionString = mcOptionsText(data[index]['question']['options'], questionString);
    
    app.innerHTML += questionString; //Add the questionString to the app of the HTML
    MathJax.typesetPromise(); //Type set MathJax equations

    //event listener for click in options-container
    const optionsContainer = document.querySelector(".options-container");
    optionsContainer.correctAnswer = data[index]['question']['correct-answer']["choice"];
    optionsContainer.playerData = playerData;
    optionsContainer.addEventListener("click", optionsClick);

}