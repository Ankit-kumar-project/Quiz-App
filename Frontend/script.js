document.querySelectorAll(".start-quiz-button").forEach(button => {
  button.addEventListener("click", function(event) {
    let quizType = this.getAttribute("data-quiz");
    console.log(quizType);
    window.location.href = `description/description.html?quiz=${quizType}`;
  });
});

