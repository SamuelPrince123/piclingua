// Sample 10 advanced-level MCQ questions
const questions = [
  {
    question: "Who was the first king of Israel?",
    choices: ["Saul", "David", "Solomon", "Samuel"],
    answer: "Saul",
  },
  {
    question: "In which book is the story of the Tower of Babel?",
    choices: ["Genesis", "Exodus", "Leviticus", "Numbers"],
    answer: "Genesis",
  },
  {
    question: "How many days did Jesus fast in the wilderness?",
    choices: ["30", "40", "50", "60"],
    answer: "40",
  },
  {
    question: "Which apostle doubted Jesus’ resurrection?",
    choices: ["Peter", "James", "Thomas", "John"],
    answer: "Thomas",
  },
  {
    question: "Who wrote most of the New Testament epistles?",
    choices: ["John", "Paul", "Peter", "James"],
    answer: "Paul",
  },
  {
    question: "What did God create on the fourth day?",
    choices: ["Stars and moon", "Man", "Birds", "Land"],
    answer: "Stars and moon",
  },
  {
    question: "Where was Jesus born?",
    choices: ["Nazareth", "Jerusalem", "Bethlehem", "Galilee"],
    answer: "Bethlehem",
  },
  {
    question: "How many plagues were sent on Egypt?",
    choices: ["7", "10", "12", "14"],
    answer: "10",
  },
  {
    question: "Who interpreted dreams for Pharaoh?",
    choices: ["Joseph", "Moses", "Daniel", "Aaron"],
    answer: "Joseph",
  },
  {
    question: "What is the last book of the Bible?",
    choices: ["Revelation", "Malachi", "Jude", "Acts"],
    answer: "Revelation",
  },
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;

const questionText = document.getElementById("questionText");
const choicesContainer = document.getElementById("choicesContainer");
const startBtn = document.getElementById("startBtn");
const timerDisplay = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");
const correctAudio = document.getElementById("correctAudio");
const wrongAudio = document.getElementById("wrongAudio");
const noAnswerAudio = document.getElementById("noAnswerAudio");

function showQuestion() {
  const q = questions[currentQuestion];
  questionText.textContent = `${currentQuestion + 1}. ${q.question}`;
  choicesContainer.innerHTML = "";
  q.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn btn ripple";
    btn.textContent = choice;
    btn.addEventListener("click", () => handleAnswer(btn, choice));
    choicesContainer.appendChild(btn);
  });
  nextBtn.style.display = "none";
  timerDisplay.textContent = "10";
  timeLeft = 10;
}

function handleAnswer(btn, selected) {
  clearInterval(timer);
  const correct = questions[currentQuestion].answer;
  const allBtns = document.querySelectorAll(".choice-btn");
  allBtns.forEach((b) => b.classList.add("disabled"));

  if (!selected) {
    noAnswerAudio.play();
  } else if (selected === correct) {
    btn.classList.add("correct");
    correctAudio.play();
    score++;
  } else {
    btn.classList.add("wrong");
    wrongAudio.play();
    const correctBtn = Array.from(allBtns).find(
      (b) => b.textContent === correct
    );
    if (correctBtn) correctBtn.classList.add("correct");
  }

  nextBtn.style.display = "inline-block";
}

function startTimer() {
  startBtn.disabled = true;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleAnswer(null, null); // No answer selected
    }
  }, 1000);
}

startBtn.addEventListener("click", () => {
  startTimer();
});

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
    startBtn.disabled = false;
  } else {
    localStorage.setItem(
      "advancedScore",
      JSON.stringify({ correct: score, wrong: questions.length - score })
    );
    window.location.href = "result.html";
  }
});

// Start first question
document.addEventListener("DOMContentLoaded", showQuestion);
