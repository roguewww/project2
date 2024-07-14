// 所有跟大模型有关的都在llm.js

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Voice Recognition';
    document.body.appendChild(startButton);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'content';
    contentDiv.contentEditable = true;
    contentDiv.style.border = '1px solid black';
    contentDiv.style.padding = '10px';
    contentDiv.style.width = '300px';
    contentDiv.style.height = '100px';
    contentDiv.style.overflow = 'auto';
    document.body.appendChild(contentDiv);

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send to LLM API';
    document.body.appendChild(sendButton);

    const outputDiv = document.createElement('div');
    outputDiv.id = 'output';
    outputDiv.style.border = '1px solid black';
    outputDiv.style.padding = '10px';
    outputDiv.style.width = '300px';
    outputDiv.style.height = '100px';
    outputDiv.style.overflow = 'auto';
    document.body.appendChild(outputDiv);

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let transcript = '';

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        contentDiv.textContent = (transcript + interimTranscript).slice(0, 400);
    };

    recognition.onerror = (event) => {
        console.error(event.error);
    };

    startButton.addEventListener('click', () => {
        recognition.start();
    });

    sendButton.addEventListener('click', async () => {
        const content = contentDiv.textContent;
        console.log(content);
        try {
            const response = await fetch('http://127.0.0.1:8080/llm_api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: content })
            });
            const data = await response.json();
            outputDiv.textContent = data.llm;
            const utterance = new SpeechSynthesisUtterance(data.llm);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
