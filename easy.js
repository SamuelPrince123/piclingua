const questions = [
  { text: "1)Torah means the Prophets.", answer: false },
  { text: "2)Jesus is the second Adam.", answer: true },
  { text: "3)Eden in Hebrew means delight or paradise", answer: true },
  {
    text: "4)Adam represents the church and Eve represents Christ.",
    answer: false,
  },
  { text: "5)Noah's ark rested in mount Moriah.", answer: false },
  { text: "6)The name David means beloved.", answer: true },
  { text: "7)The name Judah means praise.", answer: true },
  {
    text: "8)David fought with lion and tiger.",
    answer: false,
  },
  { text: "9)Rebekah represents the Holy Spirit.", answer: false },
  {
    text: "10)King Ahasuerus(Xerxes) rules over 120 provinces.",
    answer: false,
  },
];

let idx = 0,
  timer,
  timeLeft = 10,
  userAnswer = null;
if (!localStorage.getItem("easyScore")) {
  localStorage.setItem("easyScore", JSON.stringify({ correct: 0, wrong: 0 }));
}

const qBox = document.getElementById("questionBox");
const start = document.getElementById("startBtn");
const timerE = document.getElementById("timer");
const tBtn = document.getElementById("trueBtn");
const fBtn = document.getElementById("falseBtn");
const next = document.getElementById("nextBtn");
const corrAudio = document.getElementById("correctAudio");
const wrongAudio = document.getElementById("wrongAudio");

function loadQuestion() {
  const q = questions[idx];
  qBox.textContent = q.text;
  qBox.className = "";
  timeLeft = 10;
  timerE.textContent = timeLeft;
  userAnswer = null;
  start.disabled = false;
  tBtn.disabled = fBtn.disabled = true;
  next.style.display = "none";
}

function evaluate() {
  clearInterval(timer);
  const correct = questions[idx].answer;
  const score = JSON.parse(localStorage.getItem("easyScore"));
  if (userAnswer === correct) {
    qBox.classList.add("correct");
    corrAudio.play();
    score.correct++;
  } else {
    qBox.classList.add("wrong");
    wrongAudio.play();
    score.wrong++;
  }
  localStorage.setItem("easyScore", JSON.stringify(score));
  next.style.display = "block";
}

start.addEventListener("click", () => {
  start.disabled = true;
  tBtn.disabled = fBtn.disabled = false;
  timer = setInterval(() => {
    timeLeft--;
    timerE.textContent = timeLeft;
    if (timeLeft <= 0) {
      tBtn.disabled = fBtn.disabled = true;
      evaluate();
    }
  }, 1000);
});

tBtn.onclick = () => {
  if (timeLeft > 0) {
    userAnswer = true;
    tBtn.disabled = fBtn.disabled = true;
    evaluate();
  }
};

fBtn.onclick = () => {
  if (timeLeft > 0) {
    userAnswer = false;
    tBtn.disabled = fBtn.disabled = true;
    evaluate();
  }
};

next.addEventListener("click", () => {
  idx++;
  if (idx < questions.length) {
    loadQuestion();
  } else {
    window.location.href = "result.html";
  }
});

loadQuestion();
