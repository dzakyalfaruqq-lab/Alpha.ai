const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const fileInput = document.getElementById("file-input");

const GEMINI_API_KEY = ("AIzaSyCwh1kxU0jKfvSMvitaJCxiiCXDeA3adxM");
let fileContent = "";

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.textContent = `${sender}: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value;
  appendMessage("Kamu", message);
  userInput.value = "";

  const finalPrompt = fileContent
    ? `Dokumen yang saya upload berisi:\n${fileContent}\n\nPertanyaan: ${message}`
    : message;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
                  "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }]
      })
    }
  );

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "sorry, 404 Error";
  appendMessage("Alpha", reply);
});

// Handle file upload (hanya .txt sementara)
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    fileContent = e.target.result;
    appendMessage("📎", `Dokumen "${file.name}" berhasil dibaca. Sekarang kamu bisa bertanya tentang isinya.`);
  };
  reader.readAsText(file);
});
