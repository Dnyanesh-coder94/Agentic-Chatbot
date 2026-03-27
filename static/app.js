document.addEventListener('DOMContentLoaded', () => {
    const usecaseSelect = document.getElementById('usecase-select');
    const tavilyGroup = document.getElementById('tavily-group');
    const timeframeGroup = document.getElementById('timeframe-group');
    const chatHistory = document.getElementById('chat-history');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // Make textarea auto-expand (optional nice UI touch)
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = 'auto';
    });

    // UI Toggles based on Usecase
    usecaseSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'Chatbot With Web' || val === 'AI News') {
            tavilyGroup.classList.remove('hidden');
        } else {
            tavilyGroup.classList.add('hidden');
        }

        if (val === 'AI News') {
            timeframeGroup.classList.remove('hidden');
            chatInput.placeholder = "Click send to fetch news for the selected timeframe...";
            chatInput.disabled = true;
        } else {
            timeframeGroup.classList.add('hidden');
            chatInput.placeholder = "Enter your message...";
            chatInput.disabled = false;
        }
    });

    const addMessage = (type, content) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}-message fade-in-up`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        if (type === 'user') {
            avatar.innerHTML = '<i class="fa-solid fa-user"></i>';
        } else if (type === 'tool') {
            avatar.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i>';
        } else {
            avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';
        }
        msgDiv.appendChild(avatar);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (type === 'assistant' || type === 'system') {
            contentDiv.innerHTML = marked.parse(content);
        } else {
            contentDiv.textContent = content; // raw text for user and tools
        }

        msgDiv.appendChild(contentDiv);
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    const addTypingIndicator = () => {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ai-message fade-in-up`;
        msgDiv.id = id;
        
        msgDiv.innerHTML = `
            <div class="avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="message-content">
                <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
        `;
        
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return id;
    };

    const removeTypingIndicator = (id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
    };

    const sendMessage = async () => {
        const usecase = usecaseSelect.value;
        let messageText = chatInput.value.trim();
        const timeframe = document.getElementById('timeframe-select').value;
        
        if (usecase === 'AI News') {
            messageText = timeframe;
        } else if (!messageText) {
            return;
        }

        const config = {
            selected_llm: document.getElementById('llm-select').value,
            selected_groq_model: document.getElementById('model-select').value,
            GROQ_API_KEY: document.getElementById('groq-api-key').value,
            selected_usecase: usecase,
            TAVILY_API_KEY: document.getElementById('tavily-api-key')?.value || '',
            timeframe: timeframe
        };

        if (!config.GROQ_API_KEY) {
            addMessage('system', '⚠️ Error: Please enter your GROQ API Key in the config panel.');
            return;
        }
        if ((usecase === 'Chatbot With Web' || usecase === 'AI News') && !config.TAVILY_API_KEY) {
            addMessage('system', '⚠️ Error: Please enter your TAVILY API Key for web features.');
            return;
        }

        if (usecase !== 'AI News') {
            addMessage('user', messageText);
            chatInput.value = '';
            chatInput.style.height = 'auto'; // reset textarea
        } else {
            addMessage('user', `Fetch ${timeframe} AI News`);
        }

        const indicatorId = addTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config, message: messageText })
            });

            const data = await response.json();
            removeTypingIndicator(indicatorId);

            if (data.error) {
                addMessage('system', `❌ Error: ${data.error}`);
                return;
            }

            if (data.messages && data.messages.length > 0) {
                data.messages.forEach(msg => {
                    addMessage(msg.type, msg.content);
                });
            } else {
                addMessage('system', 'No response received.');
            }

        } catch (error) {
            removeTypingIndicator(indicatorId);
            addMessage('system', `📡 Connection Error: ${error.message}`);
        }
    };

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
