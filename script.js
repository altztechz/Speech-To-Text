const btn = document.getElementById("btn");
const copyBtn = document.querySelector(".button-three:nth-of-type(2)");
const results = document.getElementById("result");
const speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const recognition = new speechRecognition();

let isListening = false;

recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = 'en-US';

recognition.onstart = function () {
    console.log("You can speak now.");
    isListening = true;
    btn.innerText = "Stop Listening";
    btn.style.fontWeight = 'normal';
}

recognition.onresult = function (event) {
    let finalText = '';
    let interimText = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
            finalText += result[0].transcript;
        } else {
            interimText += result[0].transcript;
        }
    }
    
    finalText = cleanText(finalText);
    interimText = cleanText(interimText);

    finalText = finalText.charAt(0).toUpperCase() + finalText.slice(1) + (finalText.endsWith('.') ? '' : '.');
    interimText = interimText.charAt(0).toUpperCase() + interimText.slice(1);

    document.getElementById("result").innerHTML = `${interimText}<br><strong>${finalText}</strong>`;
}

recognition.onerror = function (event) {
    console.error("Error occurred in recognition: " + event.error);
    stopRecognition();
}

function cleanText(text) {
    const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually'];
    const regex = new RegExp(`\\b(${fillerWords.join('|')})\\b`, 'gi');
    return text.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
}

function toggleRecognition() {
    if (isListening) {
        stopRecognition();
    } else {
        startRecognition();
    }
}

function startRecognition() {
    recognition.start();
}

function stopRecognition() {
    if (recognition && recognition.active) {
        recognition.stop();
    }
    console.log("Stopped listening.");
    isListening = false;
    btn.innerText = "Speech To Text";
    btn.style.fontWeight = 'bold';
    document.getElementById("result").innerHTML = "Text Is Shown Here!";
}

function copyDivToClipboard() {
    const range = document.createRange();
    range.selectNode(document.getElementById("result"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    const originalText = copyBtn.innerText;
    copyBtn.innerText = "Copied";
    setTimeout(() => {
        copyBtn.innerText = originalText;
    }, 2000);
}
