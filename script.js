// الكلمة الحالية
const word = "bonjour";

// العناصر
const result = document.getElementById("result");

// تشغيل الصوت (Text-to-Speech)
function playSound() {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "fr-FR";
  speechSynthesis.speak(utterance);
}

// التعرف على الصوت (Speech Recognition)
let recognition;

function startRecording() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("المتصفح لا يدعم التسجيل 😢");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.start();

  result.innerText = "🎤 جاري التسجيل...";

  recognition.onresult = function (event) {
    const userSpeech = event.results[0][0].transcript.toLowerCase();
    checkPronunciation(userSpeech);
  };

  recognition.onerror = function () {
    result.innerText = "❌ حدث خطأ، حاول مرة أخرى";
  };
}

// مقارنة النطق
function checkPronunciation(userSpeech) {
  if (userSpeech.includes(word)) {
    result.innerText = "✅ ممتاز";
    result.style.color = "#22c55e";
  } else {
    result.innerText = "❌ حاول مرة أخرى";
    result.style.color = "#ef4444";
  }
}
