// Ensure admin is logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
  alert("Access denied!");
  window.location.href = "admin-login.html";
}

function getUniqueResults(results) {
  const seen = new Set();
  return results.filter(entry => {
    const key = `${entry.username}_${entry.score}_${entry.percentage}_${entry.date}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  }

// Load quiz results
const results = JSON.parse(localStorage.getItem("quizResults")) || [];
const resultsTableBody = document.querySelector("#results-table tbody");


function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

results.forEach((result, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${result.username}</td>
    <td>${result.score}</td>
    <td>${formatDate(result.date)}</td>
  `;
  resultsTableBody.appendChild(row);
});

// Display leaderboard
const leaderboard = document.getElementById("leaderboard");
const topScores = [...results]
  .sort((a, b) => b.score - a.score)
  .slice(0, 150);

topScores.forEach(entry => {
  const listItem = document.createElement("li");
  listItem.textContent = `${entry.username} — ${entry.score}pts — ${((entry.score / 40) * 100).toFixed(1)}%`;
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

//Refresh button
function refresh() {
      window.location.reload();
}

// Logout admin
function logoutAdmin() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}
