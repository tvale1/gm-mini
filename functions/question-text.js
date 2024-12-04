export function questionText(questionObj, questionString){
    
    // add paragraph text
    if (Object.keys(questionObj)[0] == "paragraph-text") {
        // console.log(questionObj);
        questionString += "<p>" + questionObj['paragraph-text'] + "</p>";
    }

    //add inline italics
    if (Object.keys(questionObj)[0] == "italics-inline") {
        questionString = questionString.slice(0,-4);
        questionString += "<i>" + questionObj['italics-inline'] + "</i></p>";
    };

    //add inline text
    if (Object.keys(questionObj)[0] == "text-inline") {
        questionString = questionString.slice(0,-4);
        questionString += questionObj['text-inline'] + "</p>";
    };
    
    //add equation
    if (Object.keys(questionObj)[0] == "equation") {
        questionString += "$$" + questionObj['equation'] + "$$";
        
    };

    //add inline equation
    if (Object.keys(questionObj)[0] == "equation-inline") {
        questionString = questionString.slice(0,-4);
        questionString += "#" + questionObj['equation-inline'] + "#</p>";
    };

    //add inline equation
    if (Object.keys(questionObj)[0] == "image") {
        // questionString = questionString.slice(0,-4);
        questionString += "<div><img width = 80% src = 'images/"+ questionObj['image'] +"'></div>";
    };
     //add inline superscript
     if (Object.keys(questionObj)[0] == "superscript-inline") {
        questionString = questionString.slice(0,-4);
        questionString += "<sup>" + questionObj['superscript-inline'] + "</sup></p>";
    };

    //add table
    if (Object.keys(questionObj)[0] == "table") {
        // questionString = questionString.slice(0,-4);
        console.log( "table"); 
        let tablestr = "";
        for(let row=0; row<questionObj['table'].length; row++){
            console.log("row = " + row);
            tablestr += "<tr>"
            for(let col=0; col<questionObj['table'][row].length; col++){
                tablestr += "<td>"
                for(let n=0; n<questionObj['table'][row][col].length; n++){
                    tablestr = questionText(questionObj['table'][row][col][n], tablestr);
                }
                tablestr += "</td>"
            }
            tablestr += "</tr>"
        }
        console.log(tablestr);
        questionString += "<div><table style='width:100%'>" + tablestr + "</table></div>";
    };
    
    
    return questionString;
}

export function mcOptionsText(optionsArray, questionString){
    const mcLabels = ["A. ", "B. ", "C. ", "D. "];
    questionString +="<div class='options-container'>"
    for (let n=0; n<optionsArray.length; n++){
        questionString += "<p class='mc-options'><strong style='font-family: Arial;'>"+ mcLabels[n] +"</strong></p>"

        for(let p=0; p<optionsArray[n].length; p++){
            if (Object.keys(optionsArray[n][p]) == "text-inline"){
                questionString = questionString.slice(0,-4);
                questionString += optionsArray[n][p]['text-inline'] + "</p>";
            }
        }
    }

    questionString +="</div>"
    return questionString;
}

export function optionsClick(e){
    
    const endgame = document.querySelector(".end-game");
    let correctAnswer = e.currentTarget.correctAnswer;
    let score = e.currentTarget.playerData['score']
    let streak = e.currentTarget.playerData['streak']
    let lastFinishedDate = e.currentTarget.playerData['last-game-finished-date'];
    let total = e.currentTarget.playerData['total'];
    let time = timeUntilEndOfDay();
    let daysBetween = daysBetweenTwoDates(lastFinishedDate, todaysDate());

    if (daysBetween >=2){
        streak = 0;
    }

    e.currentTarget.playerData['last-game-finished-date'] = todaysDate();
    
    //update total
    total++
    e.currentTarget.playerData['total'] = total;
    
    
    
    //If correct answer is selected
    if (e.target.textContent.slice(0,1) == correctAnswer) {
        //Update Score
        score++;
        e.currentTarget.playerData['score'] = score; 

        //Update Streak
        streak++;
        e.currentTarget.playerData['streak'] = streak;
        
        //Update Local Storage
        let strPlayerData = JSON.stringify(e.currentTarget.playerData);
        localStorage.setItem("playerData", strPlayerData);

        //Display win screen
        e.target.style.backgroundColor = "lightskyblue";
        displayEndGame(endgame, score, time, "rgba(0, 92, 54, 0.9)", "Correct", correctAnswer, streak, total);
        
    }
   
    //If wrong answer is selected
    else {
        //Update Score - no need, it remains unchanged
    
        //Update Streak - reset to 0
        streak = 0;
        e.currentTarget.playerData['streak'] = streak;
        
        //Update Local Storage
        let strPlayerData = JSON.stringify(e.currentTarget.playerData);
        localStorage.setItem("playerData", strPlayerData);
        
        e.target.style.backgroundColor = "rgb(241, 92, 92)";
        displayEndGame(endgame, score, time, "rgba(255, 76, 76, 0.9)", "Incorrect", correctAnswer, streak, total);
        
    }
    
}

export function displayEndGame(endgame, score, time, colour, correct, correctAnswer, streak, total){
    endgame.style.display = "flex";
    endgame.style.visibility = "visible";
    endgame.style.opacity = "1";

    endgame.style.backgroundColor = colour;
    endgame.innerHTML = `
<p style="font-size: 2em">${correct}</p>
        <p style="font-size: 1.5em">${(correct == "Correct")? "Keep it up tomorrow" : (correct == "Incorrect") ? "Try again tomorrow": ""}</p>
        ${correct == "Correct" ? `<p style='font-size: 1.5em'>Your streak is ${streak}</p>` : (correct == "Incorrect") ? `<p style='font-size: 1.5em'>The correct answer is ${correctAnswer}</p>` : (streak>0) ? `<p style='font-size: 1.5em'>Your streak is ${streak}</p>` :""}
        <p style="font-size: 1.5em">Your percentage is ${Math.round(score/total*100)}%</p>
        <p style="font-size: 1.5em">Time until next puzzle: ${time[0]} hours; ${time[1]} minutes; ${time[2]<10 ? '0'+time[2] : time[2]} seconds</p>
    `;
    //Count down timer.
    setInterval( ()=>{
        if (time[2]==0 && time[1]>0){
            time[1]--;
            time[2] = 60;
        }

        if(time[2]==0 && time[1]==0 && time[0]>0){
            time[0]--;
            time[1] = 59;
            time[2] = 60;
        }

        if (time[0]==0){
            endgame.style.display = "none";
        }
        else {
            time[2]--;
            endgame.innerHTML = `
                <p style="font-size: 2em">${correct}</p>
                <p style="font-size: 1.5em">${(correct == "Correct")? "Keep it up tomorrow" : (correct == "Incorrect") ? "Try again tomorrow": ""}</p>
                ${correct == "Correct" ? `<p style='font-size: 1.5em'>Your streak is ${streak}</p>` : (correct == "Incorrect") ? `<p style='font-size: 1.5em'>The correct answer is ${correctAnswer}</p>` : (streak>0) ? `<p style='font-size: 1.5em'>Your streak is ${streak}</p>` :""}
                <p style="font-size: 1.5em">Your percentage is ${Math.round(score/total*100)}%</p>
                <p style="font-size: 1.5em">Time until next puzzle: ${time[0]} hours; ${time[1]} minutes; ${time[2]<10 ? '0'+time[2] : time[2]} seconds</p>
            `;
        }
        
    },1000);
}


export function timeUntilEndOfDay(){
    const d = new Date();
    // console.log(d);
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds(); 
    const time = [23-h, 59-m, 59-s];
    return time;
}

export function todaysDate(){
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    return `${y}-${m}-${d}`;
}

export function daysBetweenTwoDates (day1, day2){
    const date1 = new Date(day1);
    const date2 = new Date(day2);

    const time1 = date1.getTime();
    const time2 = date2.getTime();

    const days = ((time2 - time1) / (1000 * 60 * 60 * 24));
    return days;
}

