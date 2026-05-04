// Data: List of French words with phonetics
const words = [
    { word: "Bonjour", phonetic: "/bɔ̃.ʒuʁ/", category: "تحيات" },
    { word: "Merci", phonetic: "/mɛʁ.si/", category: "أساسيات" },
    { word: "S'il vous plaît", phonetic: "/sil vu plɛ/", category: "أساسيات" },
    { word: "Enchanté", phonetic: "/ɑ̃.ʃɑ̃.te/", category: "تحيات" },
    { word: "Au revoir", phonetic: "/o ʁə.vwaʁ/", category: "تحيات" },
    { word: "Comment allez-vous ?", phonetic: "/kɔ.mɑ̃.t‿a.le.vu/", category: "محادثة" },
    { word: "Je t'aime", phonetic: "/ʒə tɛm/", category: "مشاعر" },
    { word: "Bienvenue", phonetic: "/bjɛ̃.və.ny/", category: "تحيات" },
    { word: "Pardon", phonetic: "/paʁ.dɔ̃/", category: "أساسيات" },
    { word: "Bonne chance", phonetic: "/bɔn ʃɑ̃s/", category: "تمنيات" }
];

let currentIndex = 0;
let recognition;
let isRecording = false;
let score = 0;
const scoreEl = document.getElementById('userScore');
// DOM Elements
const frenchWordEl = document.getElementById('frenchWord');
const phoneticEl = document.getElementById('phonetic');
const categoryEl = document.querySelector('.category-tag');
const progressBar = document.getElementById('progressBar');
const currentLevelEl = document.getElementById('currentLevel');
const listenBtn = document.getElementById('listenBtn');
const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('statusText');
const feedbackArea = document.getElementById('feedbackArea');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize Speech Recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        statusText.innerText = "متصفحك لا يدعم التعرف على الكلام. يرجى استخدام Chrome.";
        recordBtn.disabled = true;
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isRecording = true;
        recordBtn.classList.add('recording');
        statusText.innerText = "جاري الاستماع... تحدث الآن";
        feedbackArea.innerHTML = '';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const targetWord = words[currentIndex].word.toLowerCase().replace(/[?!.,]/g, "").trim();
        const cleanTranscript = transcript.replace(/[?!.,]/g, "").trim();

        displayFeedback(cleanTranscript, targetWord);
    };

    recognition.onerror = (event) => {
        stopRecording();
        statusText.innerText = "حدث خطأ: " + event.error;
    };

    recognition.onend = () => {
        stopRecording();
    };
}

function stopRecording() {
    isRecording = false;
    recordBtn.classList.remove('recording');
    if (statusText.innerText === "جاري الاستماع... تحدث الآن") {
        statusText.innerText = "اضغط على الميكروفون وابدأ التحدث";
    }
}

// Display Feedback
function displayFeedback(transcript, target) {
    const isCorrect = transcript.includes(target) || target.includes(transcript);
    
    const feedbackMsg = isCorrect ? 
        `<div class="feedback-msg success"><i class="fas fa-check-circle"></i> ممتاز!</div>` : 
        `<div class="feedback-msg error"><i class="fas fa-times-circle"></i> حاول مرة أخرى</div>`;
    
    const transcriptDisplay = `<div class="user-transcript">لقد قلت: "${transcript}"</div>`;
    
    feedbackArea.innerHTML = feedbackMsg + transcriptDisplay;
    // À insérer dans le bloc if (isCorrect)
score += 10;
scoreEl.innerText = score;
// Animation flash pour le score
scoreEl.parentElement.style.transform = 'scale(1.1)';
setTimeout(() => scoreEl.parentElement.style.transform = 'scale(1)', 200);
    if (isCorrect) {
        statusText.innerText = "رائع! يمكنك الانتقال للكلمة التالية";
    } else {
        statusText.innerText = "لم يكن النطق دقيقاً تماماً، جرب مجدداً";
    }
}

// Text to Speech
function speakWord() {
    const utterance = new SpeechSynthesisUtterance(words[currentIndex].word);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

// Update UI Content
function updateContent() {
    const current = words[currentIndex];
    
    // Animation effect
    const card = document.getElementById('mainCard');
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        frenchWordEl.innerText = current.word;
        phoneticEl.innerText = current.phonetic;
        categoryEl.innerText = current.category;
        
        // Progress
        const progress = ((currentIndex + 1) / words.length) * 100;
        progressBar.style.width = `${progress}%`;
        currentLevelEl.innerText = `الكلمة ${currentIndex + 1} من ${words.length}`;
        
        // Buttons state
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === words.length - 1;
        
        // Reset feedback
        feedbackArea.innerHTML = '';
        statusText.innerText = "اضغط على الميكروفون وابدأ التحدث";
        
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 300);
}

// Event Listeners
listenBtn.addEventListener('click', speakWord);

recordBtn.addEventListener('click', () => {
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.start();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateContent();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < words.length - 1) {
        currentIndex++;
        updateContent();
    }
});

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    // Show loading state briefly for "real product" feel
    loadingOverlay.classList.remove('hidden');
    
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        initSpeechRecognition();
        updateContent();
    }, 1500);
});
