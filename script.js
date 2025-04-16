const dino = document.getElementById("dino");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const recordsList = document.getElementById("recordsList");
const recordsDiv = document.getElementById("records");

let score = 0;
let highScore = 0;
let gameInterval;
let gameOver = false;

document.addEventListener("keydown", () => {
  if (!dino.classList.contains("jump")) {
    dino.classList.add("jump");
    setTimeout(() => dino.classList.remove("jump"), 500);
  }
});

function startGame() {
  obstacle.style.left = "800px";
  score = 0;
  gameOver = false;

  gameInterval = setInterval(() => {
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));

    if (obstacleLeft > 50 && obstacleLeft < 90 && dinoTop < 50) {
      endGame();
    } else {
      score++;
      scoreDisplay.textContent = score;
    }

    obstacle.style.left = `${obstacleLeft - 5}px`;
    if (obstacleLeft <= 0) {
      obstacle.style.left = "800px";
    }
  }, 50);
}

function endGame() {
  clearInterval(gameInterval);
  gameOver = true;
  alert("Game Over! Your score: " + score);
  sendScore(score);
}

function restartGame() {
  location.reload();
}

async function sendScore(currentScore) {
  const response = await fetch("/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ score: currentScore })
  });

  const data = await response.json();
  highScore = data.highScore;
  highScoreDisplay.textContent = highScore;
}

async function fetchHighScore() {
  const response = await fetch("/highscore");
  const data = await response.json();
  highScore = data.highScore;
  highScoreDisplay.textContent = highScore;
}

async function viewPastRecords() {
  const res = await fetch("/records");
  const data = await res.json();

  recordsList.innerHTML = "";
  data.records.forEach(record => {
    const li = document.createElement("li");
    li.textContent = `Score: ${record.score} | ${new Date(record.date).toLocaleString()}`;
    recordsList.appendChild(li);
  });

  recordsDiv.style.display = "block";
}

fetchHighScore();
startGame();
