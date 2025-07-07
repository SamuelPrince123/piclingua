// Smooth page transitions & navigation
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const target = btn.getAttribute("data-target");
    // add a quick fade-out
    document.querySelector(".container").style.opacity = "0";
    setTimeout(() => {
      window.location.href = target;
    }, 300);
  });
});

console.log("Bible Quiz Loaded");
