const params = new URLSearchParams(window.location.search);
const quizType = params.get("quiz");

const startBtn = document.querySelector("button");

startBtn.addEventListener("click", () => {
  window.location.href = `../Quiz_page/quiz.html?quiz=${quizType}`;
});
