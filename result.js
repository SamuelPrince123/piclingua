function loadResult(idPrefix, storageKey) {
  const data = JSON.parse(localStorage.getItem(storageKey)) || {
    correct: 0,
    wrong: 0,
  };
  const total = data.correct + data.wrong;
  const percent = total ? Math.round((data.correct / total) * 100) : 0;

  document.getElementById(`${idPrefix}Correct`).textContent = data.correct;
  document.getElementById(`${idPrefix}Wrong`).textContent = data.wrong;
  document.getElementById(`${idPrefix}Percent`).textContent = `${percent}%`;
}

// Load scores for all levels
loadResult("easy", "easyScore");
loadResult("intermediate", "intermediateScore");
loadResult("advanced", "advancedScore");
