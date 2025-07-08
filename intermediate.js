const pairs = [
  ["Moses", "Ten Commandments"],
  ["Noah", "Ark"],
  ["David", "Goliath"],
  ["Jesus", "Crucifixion"],
  ["Paul", "Epistles"],
  ["Peter", "Disciple"],
  ["Jonah", "Whale"],
  ["Abraham", "Faith"],
  ["Joseph", "Dreams"],
  ["Elijah", "Fire from Heaven"],
];

let timeLeft = 200;
let timerInterval;
const timerSpan = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const container = document.getElementById("matchContainer");

let shuffledRight = [...pairs.map((p) => p[1])].sort(() => Math.random() - 0.5);

// Build UI
function buildMatchUI() {
  pairs.forEach(([left, _], i) => {
    const row = document.createElement("div");
    row.className = "match-row";

    const label = document.createElement("label");
    label.textContent = `${i + 1}. ${left}`;

    const select = document.createElement("select");
    select.dataset.index = i;

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "-- Select --";
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    select.appendChild(defaultOpt);

    shuffledRight.forEach((choice) => {
      const opt = document.createElement("option");
      opt.value = choice;
      opt.textContent = choice;
      select.appendChild(opt);
    });

    row.appendChild(label);
    row.appendChild(select);
    container.appendChild(row);
  });
}

buildMatchUI();

// Start button triggers timer
startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitAnswers(); // auto-submit
    }
  }, 1000);
});

// Auto submit function
function submitAnswers() {
  const selects = document.querySelectorAll("select");
  let correct = 0;
  let wrong = 0;

  selects.forEach((select, idx) => {
    const userAns = select.value;
    const correctAns = pairs[idx][1];
    if (userAns === correctAns) {
      correct++;
    } else {
      wrong++;
    }
  });

  localStorage.setItem("intermediateScore", JSON.stringify({ correct, wrong }));
  window.location.href = "result.html";
}

// If user clicks submit manually before timer ends
submitBtn.addEventListener("click", () => {
  clearInterval(timerInterval); // 🛑 stop countdown
  submitAnswers(); // ✅ immediately submit
});
