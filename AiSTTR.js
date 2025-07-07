const ttsText = document.getElementById("tts-text");
const ttsVoice = document.getElementById("tts-voice");
const ttsPitch = document.getElementById("tts-pitch");
const ttsRate = document.getElementById("tts-rate");
const playTTS = document.getElementById("play-tts");
let availableVoices = [];

function loadVoices() {
  availableVoices = speechSynthesis.getVoices();
  ttsVoice.innerHTML = "";
  let defaultVoiceIndex = 0;

  availableVoices.forEach((voice, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent =
      `${voice.name} (${voice.lang})` + (voice.default ? " — DEFAULT" : "");
    ttsVoice.appendChild(opt);

    if (
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("samantha") ||
      voice.name.toLowerCase().includes("google us english female")
    ) {
      defaultVoiceIndex = index;
    }
  });

  ttsVoice.value = defaultVoiceIndex;
}

speechSynthesis.onvoiceschanged = loadVoices;

playTTS.addEventListener("click", () => {
  const utterance = new SpeechSynthesisUtterance(ttsText.value);
  utterance.voice = availableVoices[ttsVoice.value];
  utterance.pitch = parseFloat(ttsPitch.value);
  utterance.rate = parseFloat(ttsRate.value);
  speechSynthesis.speak(utterance);
});

window.onload = () => setTimeout(loadVoices, 100);

document.getElementById("open-config").addEventListener("click", () => {
  document.getElementById("voice-settings-modal").style.display = "flex";
});
document.getElementById("close-config").addEventListener("click", () => {
  document.getElementById("voice-settings-modal").style.display = "none";
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

  const listenButton = document.getElementById("listen-button");
  const speechOutput = document.getElementById("speech-output");

  let finalSpeech = "";
  let lastHeard = Date.now();
  let recognitionStartTime = 0;
  let isListening = false;

  recognition.addEventListener("start", () => {
    isListening = true;
    listenButton.disabled = true;
    console.log("[Recognition] Started");
  });

  recognition.addEventListener("result", (e) => {
    let interimText = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const spoken = e.results[i][0].transcript;
      if (e.results[i].isFinal) {
        finalSpeech += spoken + " ";
        lastHeard = Date.now();
      } else {
        interimText += spoken;
      }
    }
    speechOutput.textContent = finalSpeech + interimText;
  });

  recognition.addEventListener("error", (e) => {
    console.error("[Recognition Error]:", e.error);
    alert("Recognition error: " + e.error);
    listenButton.disabled = false;
    isListening = false;
  });

  recognition.addEventListener("end", () => {
    isListening = false;
    listenButton.disabled = false;
    const message = speechOutput.textContent.trim();
    if (!message) {
      alert("No speech detected. Please try again.");
      return;
    }
    localStorage.setItem("spokenMessage", message);
    window.location.href = "AiDeep.html";
  });

  listenButton.addEventListener("click", () => {
    finalSpeech = "";
    speechOutput.textContent = "";
    isListening = false;
    lastHeard = Date.now();
    recognitionStartTime = Date.now();

    try {
      recognition.start();
    } catch (err) {
      console.error("Start Error:", err);
      alert("Error starting recognition: " + err.message);
      listenButton.disabled = false;
      return;
    }

    // Stop after max 30s
    setTimeout(() => {
      if (isListening) recognition.stop();
    }, 30000);

    // Stop after 5s of silence
    const silenceWatcher = setInterval(() => {
      if (!isListening) {
        clearInterval(silenceWatcher);
        return;
      }
      if (Date.now() - lastHeard > 5000) {
        clearInterval(silenceWatcher);
        recognition.stop();
      }
    }, 1000);
  });
}
