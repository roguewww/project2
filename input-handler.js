import gsap from "gsap";

document.addEventListener("DOMContentLoaded", function() {
    const inputElement = document.getElementById("user-input");
    const outputElement = document.getElementById("output");
    const outputTextElement = document.getElementById("output-text");
    const loadingElement = document.getElementById("loading");
    const submitButton = document.getElementById("submit-button");

    // 初始化语音识别对象
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // 设置语言
    recognition.interimResults = false; // 不需要临时结果

    function submitInput(inputValue) {
        if (inputValue.trim() !== "") { // Check if the input is not empty
            // 先隐藏输出内容
            gsap.to(outputElement, { duration: 0.5, opacity: 0, display: "none", onComplete: () => {
                // 显示加载动画
                gsap.to(loadingElement, { duration: 0.5, opacity: 1, display: "block" });

                // 模拟加载过程（例如从服务器获取数据）
                setTimeout(() => {
                    // 隐藏加载动画
                    gsap.to(loadingElement, { duration: 0.5, opacity: 0, display: "none" });

                    // 显示输出内容
                    outputTextElement.textContent = inputValue;
                    gsap.to(outputElement, { duration: 1, opacity: 1, display: "block" });

                    // 清空输入框
                    inputElement.value = "";
                }, 2000); // 2秒的加载时间，仅作示例
            }});
        }
    }

    inputElement.addEventListener("keydown", function(event) { // 'keydown' event triggers when a key is pressed
        if (event.key === "Enter") { // Check if the key pressed is 'Enter'
            submitInput(inputElement.value);
        }
    });

    submitButton.addEventListener("click", function() {
        // 启动语音识别
        recognition.start();
    });

    recognition.addEventListener("result", function(event) {
        const transcript = event.results[0][0].transcript;
        submitInput(transcript);
    });

    recognition.addEventListener("end", function() {
        console.log("Speech recognition service disconnected");
    });

    recognition.addEventListener("error", function(event) {
        console.error("Speech recognition error detected: " + event.error);
        alert("Speech recognition error: " + event.error);
    });
});