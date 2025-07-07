const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voice");
const pitchInput = document.getElementById("pitch");
const rateInput = document.getElementById("rate");
const speakButton = document.getElementById("speak");
let voices = [];

function populateVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";
  let preferredIndex = 0;

  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent =
      `${voice.name} (${voice.lang})` + (voice.default ? " — DEFAULT" : "");
    voiceSelect.appendChild(option);

    if (
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("samantha") ||
      voice.name.toLowerCase().includes("google us english female")
    ) {
      preferredIndex = i;
    }
  });

  voiceSelect.value = preferredIndex;
}

speechSynthesis.onvoiceschanged = populateVoices;

speakButton.addEventListener("click", () => {
  const utterance = new SpeechSynthesisUtterance(textInput.value);
  utterance.voice = voices[voiceSelect.value];
  utterance.pitch = parseFloat(pitchInput.value);
  utterance.rate = parseFloat(rateInput.value);
  speechSynthesis.speak(utterance);
});

window.onload = () => setTimeout(populateVoices, 100);

document.getElementById("settings-btn").addEventListener("click", () => {
  document.getElementById("settings-modal").style.display = "flex";
});
document.getElementById("close-settings").addEventListener("click", () => {
  document.getElementById("settings-modal").style.display = "none";
});

// === SPEECH RECOGNITION ===
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
  alert("Speech Recognition not supported");
  console.error("SpeechRecognition not supported");
} else {
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = "en-US";

  const startBtn = document.getElementById("start-btn");
  const transcriptDiv = document.getElementById("transcript");

  let finalTranscript = "";
  let recognitionStarted = false;

  recognition.addEventListener("start", () => {
    recognitionStarted = true;
    startBtn.disabled = true;
    console.log("[recognition] started");
  });

  recognition.addEventListener("result", (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) {
        finalTranscript += t + " ";
      } else {
        interim += t;
      }
    }
    transcriptDiv.textContent = finalTranscript + interim;
  });

  recognition.addEventListener("error", (e) => {
    console.error("[recognition] error:", e.error);
    alert("Speech recognition error: " + e.error);
    startBtn.disabled = false;
    recognitionStarted = false;
  });

  recognition.addEventListener("end", () => {
    recognitionStarted = false;
    startBtn.disabled = false;
    const msg = transcriptDiv.textContent.trim();
    localStorage.setItem("speechTranscript", msg);
    document.getElementById("deepFrame").src = "AiDeep.html";
  });

  // Prompt-based mode (generate question)
  startBtn.addEventListener("click", () => {
    const promptText =
      "Just directly ask one question using the word aeroplane and the question should be from grade 1. Remember please make a question which is very random for you and not a same question all the time like it should generate different questions when i paste this same prompt. okay after that you know the user will give answers so i want you to analyse the answers and in reply directly give the score from 10 based on the reply okay just be queit after asking the question.";

    textInput.value = promptText;
    localStorage.setItem("speechTranscript", promptText);
    document.getElementById("deepFrame").src = "AiDeep.html";
  });

  // === Free Speech Mode ===
  const userSpeakBtn = document.getElementById("user-speak-btn");

  userSpeakBtn.addEventListener("click", () => {
    const userRecognition = new SpeechRecognition();
    userRecognition.interimResults = true;
    userRecognition.lang = "en-US";

    let userTranscript = "";
    let interim = "";

    console.log("[user-speak] Starting recognition...");

    userRecognition.addEventListener("result", (e) => {
      interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const txt = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          userTranscript += txt + " ";
          console.log("[user-speak] Finalized:", txt);
        } else {
          interim += txt;
          console.log("[user-speak] Interim:", interim);
        }
      }
      transcriptDiv.textContent = userTranscript + interim;
    });

    userRecognition.addEventListener("end", () => {
      let finalText = userTranscript.trim();
      if (finalText.length === 0 && interim.trim().length > 0) {
        finalText = interim.trim(); // fallback to interim
        console.warn("[user-speak] Used interim text as final:", finalText);
      }

      if (finalText.length === 0) {
        alert("No speech detected.");
        return;
      }

      localStorage.setItem("speechTranscript", finalText);
      document.getElementById("deepFrame").src = "AiDeep.html";
      console.log("[user-speak] Speech sent to AiDeep.html chatbot.");
    });

    userRecognition.addEventListener("error", (e) => {
      console.error("[user-speak] Error occurred:", e.error);
      alert("Error: " + e.error);
    });

    userRecognition.start();
  });
}
