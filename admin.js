// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPuobtXyncPZr2C_jxRUvQocV_jhJEp3g",
  authDomain: "jhow-biblequiz.firebaseapp.com",
  projectId: "jhow-biblequiz",
  storageBucket: "jhow-biblequiz.appspot.com",
  messagingSenderId: "430988364520",
  appId: "1:430988364520:web:1389616fb00f7c20a7575d",
  measurementId: "G-SX84ZLH8EW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Ensure admin is logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
  alert("Access denied!");
  window.location.href = "admin-login.html";
}

// UI elements
const resultsTableBody = document.querySelector("#results-table tbody");
const leaderboard = document.getElementById("leaderboard");

let quizResults = [];

// Fetch data from Firestore
function fetchResults() {
  db.collection("quizResults").get()
    .then((querySnapshot) => {
      quizResults = [];
      resultsTableBody.innerHTML = "";
      leaderboard.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const result = doc.data();
        quizResults.push(result);
      });

      displayResults();
      displayLeaderboard();
    })
    .catch((error) => {
      console.error("Error getting quiz results:", error);
      alert("Could not load quiz data from server.");
    });
}

function displayResults() {
  quizResults.forEach((result, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${result.username}</td>
      <td>${result.score}</td>
      <td>${result.date}</td>
    `;
    resultsTableBody.appendChild(row);
  });
}

function displayLeaderboard() {
  const topScores = [...quizResults].sort((a, b) => b.score - a.score).slice(0, 150);
  topScores.forEach(entry => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.username} — ${entry.score}pts — ${(entry.score / 40 * 100).toFixed(1)}%`;
    leaderboard.appendChild(listItem);
  });
}

// Export results as CSV
function exportResults() {
  let csvContent = "data:text/csv;charset=utf-8,\uFEFFUsername,Score,Date\n";
  quizResults.forEach(result => {
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

// Logout
function logoutAdmin() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "admin-login.html";
  }
}

// Reset button - not applicable for Firestore unless you manually delete documents
function resetAllData() {
  if (confirm("Are you sure you want to delete ALL quiz results?")) {
    db.collection("quizResults").get().then((querySnapshot) => {
      const batch = db.batch();
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    }).then(() => {
      alert("All quiz results have been deleted.");
      fetchResults();
    }).catch((error) => {
      console.error("Error deleting quiz results:", error);
      alert("Failed to reset quiz data.");
    });
  }
}

// Load data on page load
window.addEventListener("DOMContentLoaded", fetchResults);
