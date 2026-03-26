document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Append message
    function appendMessage(text, isBot = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isBot ? 'bot-message' : 'user-message');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        if (isBot) {
            try {
                contentDiv.innerHTML = marked.parse(text);
            } catch {
                contentDiv.textContent = text;
            }
        } else {
            contentDiv.textContent = text;
        }

        messageDiv.appendChild(contentDiv);
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    // Typing indicator
    function showTyping() {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        chatContainer.appendChild(indicator);
        scrollToBottom();
    }

    function removeTyping() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function handleSend() {
        const messageText = userInput.value.trim();
        if (!messageText) return;

        userInput.value = '';
        appendMessage(messageText, false);
        showTyping();

        try {
            // 🔥 FIXED FETCH (production safe)
            const response = await fetch(`${window.location.origin}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageText })
            });

            let data;

            // Safe JSON parse
            try {
                data = await response.json();
            } catch (e) {
                removeTyping();
                appendMessage("⚠️ Server returned invalid response", true);
                console.error("Invalid JSON:", e);
                return;
            }

            removeTyping();

            if (data.reply) {
                appendMessage(data.reply, true);
            } else if (data.error) {
                appendMessage("⚠️ " + data.error, true);
            } else {
                appendMessage("⚠️ Unexpected response from server", true);
            }

        } catch (error) {
            removeTyping();
            appendMessage("⚠️ Network error: " + error.message, true);
            console.error("Fetch Error:", error);
        }
    }

    // Events
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    userInput.focus();
});