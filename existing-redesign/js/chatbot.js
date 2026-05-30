function initAICopilotPanel() {
  const toggleBtn = document.getElementById('copilot-toggle-btn');
  const panel = document.getElementById('copilot-sidebar-panel');
  const closeBtn = document.getElementById('copilot-close-btn');
  const input = document.getElementById('copilot-chat-input');
  const sendBtn = document.getElementById('copilot-send-btn');
  const chatMessages = document.getElementById('copilot-chat-messages');
  const suggestionPills = document.querySelectorAll('.suggestion-pill');
  
  if (!toggleBtn || !panel || !closeBtn || !chatMessages) return;
  
  const chatData = window.appData.copilotKnowledge || {};
  
  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('active');
  });
  
  closeBtn.addEventListener('click', () => {
    panel.classList.remove('active');
  });
  
  function appendMessage(text, isUser = false) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${isUser ? 'user' : 'bot'}`;
    bubble.innerHTML = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function botReply(userText) {
    // Show typing bubble
    const typing = document.createElement('div');
    typing.className = 'bubble bot typing-indicator-bubble';
    typing.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    setTimeout(() => {
      typing.remove();
      const txt = userText.toLowerCase();
      let ans = chatData.default ? chatData.default[0] : "I am here to help!";
      
      if (txt.includes('lifter') || txt.includes('sandbox') || txt.includes('sas')) {
        ans = chatData.lifter ? chatData.lifter[0] : ans;
      } else if (txt.includes('medicare') || txt.includes('healthcare') || txt.includes('delay')) {
        ans = chatData.medicare ? chatData.medicare[0] : ans;
      } else if (txt.includes('gaming') || txt.includes('ixie') || txt.includes('play')) {
        ans = chatData.gaming ? chatData.gaming[0] : ans;
      } else if (txt.includes('hello') || txt.includes('hi') || txt.includes('hey')) {
        const greetings = chatData.greetings || ["Hello!"];
        ans = greetings[Math.floor(Math.random() * greetings.length)];
      }
      
      appendMessage(ans, false);
    }, 1000);
  }
  
  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, true);
    input.value = '';
    botReply(text);
  }
  
  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
  
  suggestionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const askText = pill.dataset.ask;
      appendMessage(askText, true);
      botReply(askText);
    });
  });
}
