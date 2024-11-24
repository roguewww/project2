const messages = [
    "You just need to press the \"B\" key to view",
    "Here's the next message!",
    "Keep pressing the \"B\" key!",
    "Almost there...",
    "You're doing great!"
  ];
  let currentMessageIndex = 0;
  
  document.addEventListener('keydown', (event) => {
    if (event.key === 'b' || event.key === 'B') {
      currentMessageIndex = (currentMessageIndex + 1) % messages.length;
      document.getElementById("message").textContent = messages[currentMessageIndex];
    }
  });
  
  function goToNextPage() {
    window.location.href = "items.html";
  }