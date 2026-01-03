document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatBody = document.getElementById("chatBody");

    const loginModal = document.getElementById("loginModal");
    const openLogin = document.getElementById("openLogin");
    const closeLogin = document.getElementById("closeLogin");

    const micBtn = document.createElement("button");
    micBtn.className = "icon-btn";
    micBtn.innerHTML = "🎤";
    input.parentElement.insertBefore(micBtn, input);

    const fileBtn = document.getElementById("fileBtn");
    const urlBtn = document.getElementById("urlBtn");
    const docBtn = document.getElementById("docBtn");
    const imgBtn = document.getElementById("imgBtn");

    let loggedOut = false;
    let userName = "";

    // LOGIN MODAL
    openLogin.onclick = () => { if (!loggedOut) loginModal.style.display = "flex"; }
    closeLogin.onclick = () => { loginModal.style.display = "none";
        loggedOut = true; }
    input.onfocus = () => { if (!loggedOut) loginModal.style.display = "flex"; }

    // SEND MESSAGE
    sendBtn.onclick = () => sendMessage();
    input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

    // MICROPHONE
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;

        micBtn.onclick = () => {
            micBtn.innerHTML = "🎙️ Listening...";
            recognition.start();
        };

        recognition.onresult = e => {
            const spokenText = e.results[0][0].transcript;
            micBtn.innerHTML = "🎤";
            sendMessage(spokenText);
        };

        recognition.onspeechend = () => { recognition.stop();
            micBtn.innerHTML = "🎤"; };
        recognition.onerror = e => { micBtn.innerHTML = "🎤";
            alert("Microphone error: " + e.error); };

    } else { micBtn.disabled = true;
        micBtn.title = "Your browser does not support microphone input."; }

    // ICONS CLICK EVENTS
    fileBtn.onclick = () => openFilePicker("📎", "*/*");
    imgBtn.onclick = () => openFilePicker("🖼️", "image/*");
    docBtn.onclick = () => openFilePicker("📘", ".pdf,.doc,.docx,.txt");
    urlBtn.onclick = () => {
        const url = prompt("Enter URL to open:");
        if (url) window.open(url, "_blank");
    };

    function openFilePicker(icon, accept) {
        const inputFile = document.createElement("input");
        inputFile.type = "file";
        inputFile.accept = accept;
        inputFile.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                chatBody.innerHTML += `<div class="bot-msg"><span>${icon} You selected: ${file.name}</span></div>`;
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        };
        inputFile.click();
    }

    // SEND MESSAGE FUNCTION
    function sendMessage(textInput = null) {
        const text = textInput ? textInput : input.value.trim();
        if (!text) return;
        if (!textInput) input.value = "";

        chatBody.innerHTML += `<div class="user-msg"><span>${text}</span></div>`;
        chatBody.scrollTop = chatBody.scrollHeight;

        chatBody.innerHTML += `<div class="bot-msg"><span>⏳ Thinking...</span></div>`;
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(() => {
            const reply = botReply(text);
            chatBody.lastElementChild.innerHTML = `<span>🤖 ${reply}</span>`;
            chatBody.scrollTop = chatBody.scrollHeight;

            const synth = window.speechSynthesis;
            synth.speak(new SpeechSynthesisUtterance(reply));
        }, 400);
    }

    // BOT REPLIES
    function botReply(userText) {
        const text = userText.toLowerCase();

        // NAME
        if (text.includes("my name is") || text.startsWith("i am ") || text.includes("call me")) {
            const words = userText.split(" ");
            userName = words[words.length - 1];
            return `Ohhh, nice name ${userName} 😊`;
        }

        if (text.includes("am pushpa natekar"))
            return `Nice to meet you, ${userName}! How can I help you today?`;

        // GREETINGS
        if (text.includes("hello")) return "Hello! 👋";
        if (text.includes("how are you")) return "I'm doing great 😄";
        if (text.includes("good morning")) return "Good morning ☀️ Have a nice day!";
        if (text.includes("thank you")) return "You're welcome 😊";
        if (text.includes("bye")) return "Goodbye! 👋";

        // TECH & CODING
        if (text.includes("what is ai")) return "AI allows machines to learn, think, and solve problems.";
        if (text.includes("cloud computing")) return "Cloud computing provides servers, storage, databases, and software over the internet.";
        if (text.includes("what is html")) return "HTML structures the content of web pages.";
        if (text.includes("what is css")) return "CSS styles and designs websites.";
        if (text.includes("what is javascript")) return "JavaScript adds logic and interaction to websites.";
        if (text.includes("what is frontend")) return "Frontend is the part of a website users can see and interact with.";
        if (text.includes("what is backend")) return "Backend handles server, database, and logic behind the scenes.";
        if (text.includes("full stack")) return "Full stack developers work on both frontend and backend.";

        // EDUCATION
        if (text.includes("am student")) return "That's great 😊 What course are you studying?";
        if (text.includes("bca")) return "BCA is an excellent choice 💻🔥";

        // GENERAL KNOWLEDGE
        if (text.includes("capital of india")) return "The capital of India is New Delhi 🇮🇳";
        if (text.includes("capital of usa")) return "The capital of the USA is Washington, D.C. 🇺🇸";

        // CALCULATOR
        const mathPattern = /^\s*(-?\d+)\s*([\+\-\*x])\s*(-?\d+)\s*$/;
        const match = userText.match(mathPattern);
        if (match) {
            const num1 = parseFloat(match[1]);
            const operator = match[2];
            const num2 = parseFloat(match[3]);
            let result;
            if (operator === "+") result = num1 + num2;
            else if (operator === "-") result = num1 - num2;
            else if (operator === "*" || operator === "x") result = num1 * num2;
            return `✅ Answer: ${result}`;
        }

        return "I received: " + userText;
    }

});