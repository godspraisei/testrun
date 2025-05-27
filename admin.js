// Ensure admin is logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
  alert("Access denied!");
  window.location.href = "admin-login.html";
}

// Load quiz results
const results = JSON.parse(localStorage.getItem("quizResults")) || [];
const resultsTableBody = document.querySelector("#results-table tbody");
const leaderboard = document.getElementById("leaderboard");

results.forEach((result, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${result.username}</td>
    <td>${result.score}</td>
    <td>${result.date}</td>
  `;
  resultsTableBody.appendChild(row);
});

// Display leaderboard
const topScores = [...results].sort((a, b) => b.score - a.score).slice(0, 30);
topScores.forEach(entry => {
  const listItem = document.createElement("li");
  listItem.textContent = `${entry.username} — ${entry.score} pts`;
  leaderboard.appendChild(listItem);
});

// Reset all data
function resetAllData() {
  if (confirm("Are you sure you want to reset all quiz data?")) {
    localStorage.removeItem("quizResults");
    alert("All quiz data has been reset.");
    window.location.reload();
  }
}

// Export results as CSV
function exportResults() {
  let csvContent = "data:text/csv;charset=utf-8,Username,Score,Date\n";
  results.forEach(result => {
    csvContent += `${result.username},${result.score},${result.date}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "quiz_results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Logout admin
function logoutAdmin() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}