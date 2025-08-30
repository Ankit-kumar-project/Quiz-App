const urlParams = new URLSearchParams(window.location.search);
const quizType = urlParams.get("quiz");

const selectedQuiz = quizzes.find(q => q.title.toLowerCase() === quizType.toLowerCase());

if (!selectedQuiz) {
  document.querySelector(".question").innerHTML = "<h2>Quiz not found!</h2>";
} else {
  let currentQuestionIndex = 0;
  let score = 0;
  let attemptedCount = 0;
  let totalQuestions = selectedQuiz.questions.length;

  // Mark all questions initially as not attempted
  selectedQuiz.questions = selectedQuiz.questions.map(q => ({ ...q, attempted: false }));

  const questionText = document.getElementById("question-text");
  const optionsList = document.getElementById("options-list");
  const questionPointers = document.getElementById("question-pointers");

  // Render side "Q1 Q2 Q3..." pointers
  questionPointers.innerHTML = selectedQuiz.questions
    .map((_, idx) => `<li id="q-${idx}">Q${idx + 1}</li>`)
    .join("");

  // Initialize counts
  document.getElementById("attempted-count").innerText = attemptedCount;
  document.getElementById("not-attempted-count").innerText = totalQuestions;

  function loadQuestion() {
    const q = selectedQuiz.questions[currentQuestionIndex];

    // Highlight current pointer
    document.querySelectorAll("#question-pointers li").forEach((li, idx) => {
      li.classList.toggle("active", idx === currentQuestionIndex);
    });

    // Load question text
    questionText.innerText = q.question;

    // Load options
    optionsList.innerHTML = q.options
      .map(opt => `<li><button class="option-btn">${opt}</button></li>`)
      .join("");

    // Handle answer click
    document.querySelectorAll(".option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        // 🔹 Attempt tracking
        if (!q.attempted) {
          attemptedCount++;
          q.attempted = true;

          // Mark the sidebar pointer as attempted
          document.getElementById(`q-${currentQuestionIndex}`).classList.add("attempted");
        }

        document.getElementById("attempted-count").innerText = attemptedCount;
        document.getElementById("not-attempted-count").innerText = totalQuestions - attemptedCount;

        // Scoring
        if (btn.innerText === q.answer) score++;

        // Next Question
        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
          loadQuestion();
        } else {
          showResult();
        }
      });
    });
  }

  function showResult() {
  clearInterval(timerInterval);

  // Calculate percentage
  let percentage = Math.round((score / selectedQuiz.questions.length) * 100);

  document.querySelector(".question").innerHTML = `
    <h2>🎉 Quiz Completed!</h2>
    <div style="display:flex; flex-direction:column; align-items:center; gap:10px; margin-top:20px;">
      <canvas id="resultChart" width="150" height="150"></canvas>
      <p><strong>Your Score:</strong> ${score} / ${selectedQuiz.questions.length}</p>
      <p><strong>Percentage:</strong> ${percentage}%</p>
    </div>
  `;

  // Draw Pie Chart
  const ctx = document.getElementById("resultChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Correct", "Wrong"],
      datasets: [{
        data: [score, selectedQuiz.questions.length - score],
        backgroundColor: ["#065f09ff", "#F44336"], // green, red
        borderWidth: 2
      }]
    },
    options: {
      responsive: false,   // keep fixed size
      cutout: "60%",       // makes the ring thinner (circle looks smaller)
      plugins: {
        legend: { position: "bottom" },
        tooltip: { enabled: true }
      }
    }
  });
}


  //Timer Logic
  let timeLeft = 600; // 10 minutes = 600 seconds
  const timerElement = document.getElementById("timer");

  function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    // show formatted time
    timerElement.innerText = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (timeLeft <= 60) {
      timerElement.classList.add("danger");
    }

    if (timeLeft > 0) {
      timeLeft--;
    } else {
      clearInterval(timerInterval);
      showResult(); // Auto submit quiz when time ends
    }
  }

  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer(); // Start immediately

  // Load first question
  loadQuestion();
}
