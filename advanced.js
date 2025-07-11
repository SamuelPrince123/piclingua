// Sample 10 advanced-level MCQ questions
const questions = [
  {
    question: "Christophany means the appeareance of:",
    choices: ["Father", "Son", "The Holy Spirit", "Church"],
    answer: "Son",
  },
  {
    question: "El Roi means:",
    choices: [
      "God who provides",
      "God who heals",
      "God who sees",
      "God who fights",
    ],
    answer: "God who sees",
  },
  {
    question: "God says 'I AM WHO I AM 'to",
    choices: [" Moses", "Abhram", "Noah", "Joseph"],
    answer: "Moses",
  },
  {
    question: "Hebrew word 'Malak' means",
    choices: ["God", "Human", "Prophet", "Messanger"],
    answer: "Messanger",
  },
  {
    question: "Gethsemane means",
    choices: ["Delight", "Oil-press", "House of prayer", "Garden of peace"],
    answer: "Oil-press",
  },
  {
    question: "Ruth was a ",
    choices: ["Cannanite", "Hebrew", "Midianite", "Moabites"],
    answer: "Moabites",
  },
  {
    question: "Nimrod was a",
    choices: ["mighty hunter", "prophet of God", "giant", "king of Isreal"],
    answer: "mighty hunter",
  },
  {
    question: "The tower of babel was made up of",
    choices: [
      "stone and mortor",
      "wood and stone",
      "bricks and bitumen",
      "metal and cement",
    ],
    answer: "bricks and bitumen",
  },
  {
    question: "Which of the following is incorrect?",
    choices: [
      "David is a shephert.",
      "Abrahm's servent represents the Holy Spirit.",
      "Melchizedek was neither Jew nor Gentile.",
      "Rahab was a Jew.",
    ],
    answer: "Rahab was a Jew",
  },
  {
    question: "Haman was   ",
    choices: ["a Jew", "An agagite", "a Hitite", "an egyptian"],
    answer: "an agagite",
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
