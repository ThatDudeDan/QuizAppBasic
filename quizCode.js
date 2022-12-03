let allQuizes, quizResults;

window.onload = function () {
    let url = "Quizes.json";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            if (xhr.status === 200)
            {
                DisplayHome(xhr.responseText);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
};

function DisplayHome (text) {
    //puts quiz data into a global variable
    allQuizes = JSON.parse(text);
    console.log(allQuizes);

    // makes event handlers for all the buttons
    document.querySelector("#section1").addEventListener("click", SelectQuizSection);
    document.querySelector("#section2").addEventListener("click", SelectResults);
    document.querySelector("#homeButton").addEventListener("click", ReturnHome);
    document.querySelector("#homeButton2").addEventListener("click", ReturnHome);
    document.querySelector("#getQuizButton").addEventListener("click", BuildQuiz);
    document.querySelector("#quizResultsButton").addEventListener("click",GetResults);
    document.querySelector("#submit").addEventListener("click", DisplayAnswers);

    CallCollection();
}

function CreateCollection() {
    //method to create a new collection
    let url = "https://assignment0.com/jsonstore/webservice/dgoss/collections";
    let method = "POST";
    let payload = JSON.stringify({ collectionId: "DanielReal" });
            
    let xhr = new XMLHttpRequest();
            
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.responseText);
        }
    };
            
    xhr.open(method, url, true);
    xhr.send(payload);
}

function CallCollection () {
    // method to call the collection
    let url = "https://assignment0.com/jsonstore/webservice/dgoss/collections/DanielReal/records";
    let method = "GET";
        
    let xhr = new XMLHttpRequest();
        
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.responseText);
            //creates the collection if it doesnt exist
            if(xhr.status === 404)
                CreateCollection();
            //places records into global object if collection is created
            if (xhr.status === 200)
                quizResults = JSON.parse(xhr.responseText);
        }
    };
        
    xhr.open(method, url, true);
    xhr.send();
}

function SelectQuizSection () {
    //hides section tabs and shows the quiz selection screen
    document.querySelector("#quizSectionTabs").classList.add("hidden");
    document.querySelector("#quizHolder").classList.remove("hidden");
    document.querySelector("#Title").innerHTML = "";
    document.querySelector("#nameInput").value = "";
    document.querySelector("#results").classList.add("hidden");
    document.querySelector("#quizTitle").classList.remove("hidden");
    document.querySelector("#submit").classList.remove("hidden");
    document.querySelector("#tabs").classList.remove("hidden");

    //calls method to add quiz titles to selector
    AddQuizes();
}

function SelectResults () {
    //hides al non Results important sections of the page and resets
    document.querySelector("#quizSectionTabs").classList.add("hidden");
    document.querySelector("#userQuizContainer").classList.remove("hidden");
    document.querySelector("#userQuizDisplay").classList.add("hidden");
    document.querySelector("#quizTitle").classList.add("hidden");
    document.querySelector("#output").classList.add("hidden");
    document.querySelector("#results").classList.remove("hidden");
    document.querySelector("#Title").innerHTML = "";
    document.querySelector("#nameInput2").value = "";
    document.querySelector("#resultNumber").innerHTML = "";
}

function ReturnHome () {
    //places page sectons into variables
    let quizSection = document.querySelector("#quizHolder");
    let resultSection = document.querySelector("#userQuizContainer");
    let quiz = document.querySelector("#QuizContainer");
    let sectionTabs = document.querySelector("#quizSectionTabs");

    //hides the results section if it is being dispayed
    if (resultSection.classList.contains("hidden") !== true)
        resultSection.classList.add("hidden");
    //hides the quiz Section if it is being displayed
    if (quizSection.classList.contains("hidden") !== true)
        quizSection.classList.add("hidden");
    //hides the Quiz display if it is displaying
    if (quiz.classList.contains("hidden") !== true)
        quiz.classList.add("hidden");

        //shows the home screen tabs and displays the home title
    sectionTabs.classList.remove("hidden");
    document.querySelector("#Title").innerHTML = "Quiz App Enhanced";
}

function FindQuiz () {
    //places selected quiz title into variable
    let selection = document.querySelector("#quizSelector").value;
    let quiz;

    for (let i = 0; i < allQuizes.Quizes.length; i++) {
        //if the quiz title selected matches a existing quiz, it places that quiz into a variable
        if (selection === allQuizes.Quizes[i].title)
        {
            //places selected quiz in variable and leaves loop
            quiz = allQuizes.Quizes[i];
            break;
        }
    }

    //returns the selected quiz
    return quiz;
}

function BuildQuiz() {
    //places name input into a variable
    let nameinput = document.querySelector("#nameInput");

    //asks user to enter a name if left empty
    if (nameinput.value === "")
        alert("Please enter a name");
    else
    {
        //finds the quiz that is selected
        let quizChosen = FindQuiz();
        //makes variable for the quiz title
        let title = quizChosen.title;
        //makes variable for the quiz data
        let output = "";
        //loops through each question and diplays its information
        for (let i = 0; i < quizChosen.questions.length; i++) {
            output += "<div class=\"question\">";
            output += "<div>Question " + (i + 1) + "</div>"
            output += "<div>" + quizChosen.questions[i].questionText + "<br>";
            output += MakeQuestions(i, quizChosen); 
            output += "</div></div>";
        }
    
        //displays the title and quiz info on the page
        document.querySelector("#quizTitle").innerHTML = title;
        document.querySelector("#output").innerHTML = output;
    
        //displays the quiz output
        document.querySelector("#QuizContainer").classList.remove("hidden");
        document.querySelector("#output").classList.remove("hidden");
    
        //builds the tabs for the quiz and sets the events
        BuildTabs(quizChosen);
        UseTabs();        
    }
}

function UseTabs() {
    //places all tabs into a node array
    let tabs = document.querySelectorAll(".tab");

    for (let i = 0; i < tabs.length ; i++) {
        //adds a click event to all the tabs
        tabs[i].addEventListener("click", checkTabs);
    }

    //selects the first tab
    document.querySelector("#tab1").click();
}

function MakeQuestions (number, quizChosen) {
    //declares variable for question answers  
    let newOutput = "";
    // loops through each questions answerrs and places them into a variable
    for (let i = 0; i < quizChosen.questions[number].choices.length; i++) {
        newOutput += "<input type=\"radio\" name=\"question" + number + "\">";
        newOutput += "<label>" + quizChosen.questions[number].choices[i] + "</label><br>";
    }
    //returns string with all the answers for the questions
    return newOutput;
}

function BuildTabs (quiz) {
    //makes variables to hold tabs
    document.querySelector("#tabs").innerHTML = "";
    let output = "";
    // create a tab for every question number in the quiz
    for (let i = 0; i < quiz.questions.length; i++) {
        output += "<div id=\"tab" + (i + 1) + "\" class=\"tab\"" + (i + 1) + ">Question " + (i + 1) + "</div>";
    }

    //displays tabs on the screen
    document.querySelector("#tabs").innerHTML = output;
}

function deselectAllTabs() {
    let tabs = document.querySelectorAll(".tab, #tabs");
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("highlight");
    }
  }

  function hideAllSections() {
    let sections = document.querySelectorAll(
      "#output .question"
    );
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.add("hidden");
    }
  }

  function checkTabs(evt) {
    let tab = evt.target;
    deselectAllTabs();
    tab.classList.add("highlight");
  
    let excersize = tab.getAttribute("id");
    excersize = excersize.replace("tab","");
    hideAllSections();
    document.querySelector(".question:nth-child(" + excersize + ")").classList.remove("hidden");
  }

  function DisplayAnswers() {
        //calls method to find the quiz
        let quiz = FindQuiz();
        //calls method to collect the guesses
        let guesses = GetGuesses(quiz);
        //places name value into a variable
        let name = document.querySelector("#nameInput").value;
        //gets current date and reformats the date look
        let firstDate = new Date();
        attemptDate = firstDate.getFullYear() + "-" + firstDate.getDay() + "-" + firstDate.getMonth() + 
            " "  + firstDate.getHours() + ":" + firstDate.getMinutes() + ":" + firstDate.getSeconds() + " AST" ;

        //displays message to answer all questions if they have not been all answereed
        if (guesses.length < quiz.questions.length)
        {
            alert("All the questions must be answered");
        }
        else //displays the quiz esults if all questions answered
        {
            //sets variables for the correct answers and total score
            let answers = [], score = 0;
            //loops though each question and gets the correct answer for ech one
            for (let i = 0; i < quiz.questions.length; i++) {
                answers.push(quiz.questions[i].answer);
            }
            //makes a variable that holds all the incorrect and correct answers for questions
            let correctAnswers = CheckAnswers(guesses, answers, quiz);
            
            //loops through the correct answers and make the total score for the quiz
            for( let i = 0; i < quiz.questions.length; i++) {
                score += correctAnswers[i];
            }
            console.log(score);
            console.log(answers);

            //calls methodd to display the quiz results
            DisplayResults(correctAnswers, answers, guesses, score, quiz);
            //calls method to highlight wrong answers
            WrongAnswers(correctAnswers, quiz);

            console.log(attemptDate);
            //calls method to add quiz attempt to collection
            AddCollection(quiz, guesses, name, attemptDate, score);
        }
  }

  function AddCollection(quiz, answers, name, attemptDate, score) {
      //method to adds new record into the collection
    let url = "https://assignment0.com/jsonstore/webservice/dgoss/collections/DanielReal/records";
    let method = "POST";
    let dataToStore = { QuizAttempts: {Quiz: quiz, Name: name, Answers: answers, AttemptDate: attemptDate, Score: score} };
    let jsonToStore = JSON.stringify(dataToStore);
    let payload = JSON.stringify({ jsonString: jsonToStore });
            
    let xhr = new XMLHttpRequest();
            
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.responseText);
            alert("Quiz Results Stored");
            CallCollection();
        }
    };
            
    xhr.open(method, url, true);
    xhr.send(payload);
  }

  function GetGuesses(quiz) {
      //create variable for the answers guessed
        let answers = [];

        //loops through each questions and checks the answers
        for (let i = 0; i < quiz.questions.length; i++) {
            //makes variable to stroe all possible answers for a question
            let question = document.querySelectorAll(".question:nth-child(" + (i + 1) + ") input");
            for (let j = 0; j < question.length; j++) { //loops through each answer and grabs answer that is chosen
                //adds answer to array and skips the rest of the loop if the it finds the chosen answer
                if (question[j].checked === true)
                {
                    answers.push(j);
                    break;
                }
            }
        }
        //returns an array of guessed answers
        return answers
  }

  function CheckAnswers (guesses, answers, quiz) {
      //makes variable for collecting correct answers
      let correctAnswers = [];

      //loops through each question and checks if the answer is correct 
      for (let i = 0; i < quiz.questions.length; i++) {
            //adds a 1 to the array if it is correct
            if (guesses[i] === answers[i])
                correctAnswers.push(1);
            //adds a 0 to the array if its incorrect
            else
                correctAnswers.push(0);
      }

      //returns array of correct and incorrect answers
      return correctAnswers;
  }

  function DisplayResults(correctAnswers, answers, guesses, score, quiz) {
      // makes varaiable for the displayed data
      let output = "<div>Quiz Score: " + score + " / " + quiz.questions.length + "</div>";
      output += "<h2>Details</h2>";
      output += "<table><tr><th>Question #</th><th>Question Text</th><th>Correct Answer</th><th>Your Answer</th><th>Score</th></tr>";

      //loops through each question and displays its answer data for each one
      for (let i = 0; i < quiz.questions.length; i++) {
            let answerSearch = document.querySelectorAll(".question:nth-child(" + (i + 1) + ") label");

            output += "<tr><td>Question " + (i + 1) + "</td>";
            output += "<td>" + quiz.questions[i].questionText + "</td>";
            output += "<td>" + answerSearch[answers[i]].innerHTML + "</td>";
            output += "<td>" + answerSearch[guesses[i]].innerHTML + "</td>";
            output += "<td>" + correctAnswers[i] + "</td>";
      }

      //finishes off the output
      output += "</tr></table>";
      //displays the results on the page
      document.querySelector("#results").innerHTML = output;
      document.querySelector("#results").classList.remove("hidden");
  }

  function WrongAnswers(correctAnswers, quiz) {
    //selects all the questions results from the table
    let rows = document.querySelectorAll("#results table tr:not(:first-child)");
        for (let i = 0; i < quiz.questions.length; i++) {
            //highlights red if the answer is incorrect
            if (correctAnswers[i] === 0)
                rows[i].classList.add("wrong");
            //remove the highlight if the answer is correct
            else
                rows[i].classList.remove("wrong");
        }
  }

  function AddQuizes () {
      //sets output to be empty
      document.querySelector("#quizSelector").innerHTML = "";
      //creates new output variable
      let output = "";

      for (let i = 0; i < allQuizes.Quizes.length; i++)
      {
          //places all quizes into the output as selectable options
          output += "<option value=\"" + allQuizes.Quizes[i].title + "\">" + allQuizes.Quizes[i].title + "</option>";
      }
      //displays the selection options into the quiz selector
      document.querySelector("#quizSelector").innerHTML += output;
  }

  function GetResults() {
      //places name inputed into a variable
        let name = document.querySelector("#nameInput2").value;

        //asks user to enter a name if left empty
        if (name === "")
            alert("Please enter an account name")
        else
        {
            //calls method to get the quizes under that name
            let matchingTests = GetUserQuizes(name);
            //builds results for the matching quizes
            BuildResults(matchingTests);
        }
  }

  function GetUserQuizes(name) {
      //sets an empty array
        let userResults = [];

        //loops through each quiz
        for (let i = 0; i < quizResults.data.length; i++){
            //places each individule quiz result in a variable
            let quiz = JSON.parse(quizResults.data[i].jsonString);
            if (name === quiz.QuizAttempts.Name)
                //adds the slected quiz if it matches the user name
                userResults.push(quiz);
        }

        //returns array of results
        return userResults;
  }

function BuildResults(matches) {
    //sets the results display to be empty
    document.querySelector("#userQuizDisplay").innerHTML = "";

    //displays results if there are more than 1
    if (matches.length >= 1)
    {
        //starts the output table in variable
        let output = "<table><tr><th>Quiz</th><th>Date Taken</th><th>Score</th></tr>";
        console.log(matches);
        //sets variables
        let quiz, date, score;

        for (let i = 0; i < matches.length; i++) {
            //sets the quiz title, date the quiz was taken, and total score into variables
            quiz = matches[i].QuizAttempts.Quiz;
            date = matches[i].QuizAttempts.AttemptDate;
            score = matches[i].QuizAttempts.Score;

            //outputs the Results data into the output variable
            output += "<tr id=\"Quiz" + i + "\"><td>" + quiz.title + "</td>";
            output += "<td>" + date + "</td>";
            output += "<td>" + score + " out of " + quiz.questions.length + "</td></tr>";
        }

        //adds a button at the end of the output
        output += "</table><button id=\"showResultButton\">Show test Results</button>";

        //displays the table of reults and the total amount of results found
        document.querySelector("#userQuizDisplay").innerHTML = output;
        document.querySelector("#resultNumber").innerHTML = matches.length + " results found";
        //adds an event for the new button
        document.querySelector("#showResultButton").addEventListener("click", ShowSelectedQuiz);

        //calls method to make the Results selectable
        MakeResultSelection();
        //shows the display for the quiz results
        document.querySelector("#userQuizDisplay").classList.remove("hidden");
        document.querySelector("#QuizContainer").classList.add("hidden");
    }
    else
    {
        //displays that no wuiz results were found
        document.querySelector("#resultNumber").innerHTML = "0 Matches Found";
        document.querySelector("#QuizContainer").classList.add("hidden");
    }
}

function MakeResultSelection() {
    //selects all the rows of the Quiz results table
    let quizes = document.querySelectorAll("#userQuizDisplay tr:not(first-child)");

    for (let i = 0; i < quizes.length; i++){
        //adds a click even to all table rows
        quizes[i].addEventListener("click", SelectQuiz);
    }
}

function SelectQuiz(evt) {
    //gets the selected table row
    let quiz = evt.target.parentElement;
    //calls method to remove selected class from all rows
    deselectAllQuizes();
    //adds the selected class to the clicked row
    quiz.classList.add("selected");
}

function deselectAllQuizes() {
    //selects all the quiz display rows
    let quizes = document.querySelectorAll("#userQuizDisplay tr");
    for (let i = 0; i < quizes.length; i++) {
        //removes the selected class from ll the rows
      quizes[i].classList.remove("selected");
    }
  }

function ShowSelectedQuiz () {
    //hides the tabs from the quiz results
    document.getElementById("tabs").classList.add("hidden");
    //places selected quiz, name inputed,and matching quizes into variables
    let quizes = document.querySelectorAll("#userQuizDisplay tr:not(first-child)");
    let name = document.querySelector("#nameInput2").value;
    let matches = GetUserQuizes(name);

    for (let i = 0; i < quizes.length; i++) {
        //only displays the quiz if its the one selected
        if (quizes[i].classList.contains("selected")) {
            //gets the quiz selected
            let quiz = matches[i - 1].QuizAttempts.Quiz;
            //gets the users answers
            let guesses = matches[i - 1].QuizAttempts.Answers;
            //loops through quiz right answers and getsthe right answers
            let answers = [];
            for (let j = 0; j < quiz.questions.length; j++) {
                answers.push(quiz.questions[j].answer);
            }
            //gets the quiz score
            let score = matches[i - 1].QuizAttempts.Score;
            //gets the correct answers of the quiz
            let correct = CheckAnswers(guesses, answers, quiz);

            //calls method to display the selected quiz results
            DisplayUserResults(correct, answers, guesses, score, quiz);
        }
    }
}

function DisplayUserResults(correctAnswers, answers, guesses, score, quiz) {
    // makes varaiable for the displayed data
    let output = "<div>Quiz Score: " + score + " / " + quiz.questions.length + "</div>";
    output += "<h2>Details</h2>";
    output += "<table><tr><th>Question #</th><th>Question Text</th><th>Correct Answer</th><th>Your Answer</th><th>Score</th></tr>";

    //loops through each question and displays its answer data for each one
    for (let i = 0; i < quiz.questions.length; i++) {
          output += "<tr><td>Question " + (i + 1) + "</td>";
          output += "<td>" + quiz.questions[i].questionText + "</td>";
          output += "<td>" + quiz.questions[i].choices[answers[i]] + "</td>";
          output += "<td>" + quiz.questions[i].choices[guesses[i]] + "</td>";
          output += "<td>" + correctAnswers[i] + "</td>";
    }

    //finishes off the output
    output += "</tr></table>";
    //displays the results on the page
    document.querySelector("#results").innerHTML = output;
    //class method to show the wrong answers
    WrongAnswers(correctAnswers, quiz);
    //hides the submit button and shows
    document.querySelector("#submit").classList.add("hidden");
    document.querySelector("#QuizContainer").classList.remove("hidden");
}