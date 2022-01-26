let correctAnswer
let correctNumber = (localStorage.getItem("quiz_game_correct") ? localStorage.getItem("quiz_game_correct"): 0)
let incorrectNmber = ( localStorage.getItem( 'quiz_game_incorrect' ) ? localStorage.getItem("quiz_game_incorrect"):0)

document.addEventListener("DOMContentLoaded", function () {
  loadQuestion()
  eventListeners()
})

const eventListeners = () => {
  document
    .querySelector("#check-answer")
    .addEventListener( "click", validateAnswer )
  document
    .querySelector( "#clear-storage" ).addEventListener("click", clearResults)
}

// loads a new question from an API
const loadQuestion = () => {
  const url = "https://opentdb.com/api.php?amount=1"
  fetch(url)
    .then(data => data.json())
    .then(result => {
      displayQuestion(result.results)
    })
    .catch(error => console.log(error))
}

const displayQuestion = questions => {
  // Create the HTML QUESTION

  const questionHTML = document.createElement("div")
  questionHTML.classList.add("col-12")

  questions.forEach(question => {
    // read the correct answer
    correctAnswer = question.correct_answer
    // inject the correct answer in the possible answers
    let possibleAnswers = question.incorrect_answers

    // generate the HTML for possible answer
    possibleAnswers.splice(Math.floor(Math.random() * 3), 0, correctAnswer)

    // Added the HMTL for the current question
    questionHTML.innerHTML = `
    <div class="row justify-content-between heading>
    <p class="category">Category: ${question.category}</p>
    <div class="totals">
          <span class="badge badge-success">${correctNumber}</span>
          <span class="badge badge-danger">${incorrectNmber} </span>
    </div>
    </div>
    <h2 class="text-center">${question.question}`
    // generate the HTML for possible answers
    const answerDiv = document.createElement("div")
    answerDiv.classList.add(
      "questions",
      "row",
      "justify-content-around",
      "mt-4"
    )
    possibleAnswers.forEach(answer => {
      const answerHTML = document.createElement("li")
      answerHTML.classList.add("col-12", "col-md-5")
      answerHTML.textContent = answer
      // attach an event click the answer is clicked
      answerHTML.onclick = selectAnswer
      answerDiv.appendChild(answerHTML)
    })
    questionHTML.appendChild(answerDiv)
    document.querySelector("#app").appendChild(questionHTML)
  })
}

// When the answer is selected
const selectAnswer = e => {
  if (document.querySelector(".active")) {
    const activeAnswer = document.querySelector(".active")
    activeAnswer.classList.remove("active")
  }
  e.target.classList.add("active")
}

// Check if the answer is correct and 1 answer is selected
validateAnswer = () => {
  if (document.querySelector(".questions .active")) {
    checkAnswer()
  } else {
    // error, the usee didn't select anything
    const errorDiv = document.createElement("div")
    errorDiv.classList.add("alert", "alert-danger", "col-md-12")
    errorDiv.textContent = "Please select 1 answer"
    // select the questions div to insert the alert
    const questionsDiv = document.querySelector(".questions")
    questionsDiv.appendChild(errorDiv)
    setTimeout(() => {
      document.querySelector(".alert-danger").remove()
    }, 2000)
  }
}

checkAnswer = () => {
  const userAnswer = document.querySelector(".questions .active")
  if (userAnswer.textContent === correctAnswer) {
    correctNumber++
  } else {
    incorrectNmber++
  }

  //save into localStorage 
  saveIntoStorage()

  const app = document.querySelector( "#app" )
  while ( app.firstChild ) {
    app.removeChild(app.firstChild)
  }

  // load a new question
  loadQuestion()
}

saveIntoStorage = () => {
  localStorage.setItem( "quiz_game_correct", correctNumber );
  localStorage.setItem( "quiz_game_incorrect", incorrectNmber );
}
clearResults = () => {
  localStorage.setItem( "quiz_game_correct",0 )
  localStorage.setItem("quiz_game_incorrect",0 )
  setTimeout( () => {
    window.location.reload()
  },500)
}