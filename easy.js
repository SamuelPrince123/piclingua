const questions = [
  { text: "God created the world in six days.", answer: true },
  { text: "Noah's ark had three decks.", answer: true },
  { text: "David was a shepherd before becoming king.", answer: true },
  { text: "The Exodus lasted 50 years.", answer: false },
  { text: "Jesus was born in Bethlehem.", answer: true },
  { text: "Moses wrote the Book of Psalms.", answer: false },
  { text: "The Bible has 66 books.", answer: true },
  { text: "The New Testament is older than the Old Testament.", answer: false },
  { text: "Paul wrote more epistles than John.", answer: true },
  { text: "The book of Revelation is in the Old Testament.", answer: false },
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
