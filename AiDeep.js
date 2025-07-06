// script.js
document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotIcon = document.getElementById("chatbot-icon");

  chatbotIcon.addEventListener("click", function () {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none";
  });

  closeBtn.addEventListener("click", function () {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex";
  });

  sendBtn.addEventListener("click", sendMessage);
  chatbotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // ✅ Save bot response and redirect
    if (sender === "bot") {
      localStorage.setItem("aiMessage", message);
      window.location.href = "AiTTS.html"; // 🔄 Replace with your TTS Studio page filename
    }
  }

  function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (!userMessage) return;

    appendMessage("user", userMessage);
    chatbotInput.value = "";
    getBotResponse(userMessage);
  }

  async function getBotResponse(userMessage) {
    const apiKey = "AIzaSyAQQ3FLoaCppM2HP7boua9KZBdIFtNt3ww"; // 🔑 Replace with your real API key
    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      apiKey;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
        }),
      });

      const data = await response.json();
      const botMessage =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, no response.";
      appendMessage("bot", botMessage);
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      appendMessage("bot", "Sorry, something went wrong. Please try again.");
    }
  }
});
