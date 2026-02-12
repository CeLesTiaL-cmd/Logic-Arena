let time = 60;
let score = 0;
let combo = 0;
let gameInterval;
let difficulty = 1;

const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("startBtn");

startBtn.onclick = startGame;

function startGame() {
    startBtn.style.display = "none";
    score = 0;
    combo = 0;
    time = 60;
    difficulty = 1;

    updateStats();

    gameInterval = setInterval(() => {
        time--;
        if (time % 15 === 0) difficulty++;
        if (time <= 0) endGame();
        updateStats();
    }, 1000);

    nextChallenge();
}

function updateStats() {
    timeEl.textContent = time;
    scoreEl.textContent = score;
    comboEl.textContent = combo;
}

function nextChallenge() {
    gameArea.innerHTML = "";
    const mode = Math.floor(Math.random() * 2);

    if (mode === 0) mathChallenge();
    else reflexChallenge();
}

function mathChallenge() {
    let a = Math.floor(Math.random() * (10 * difficulty));
    let b = Math.floor(Math.random() * (10 * difficulty));
    let answer = a + b;

    gameArea.innerHTML = `
        <h2>${a} + ${b} = ?</h2>
        <input type="number" id="answerInput">
    `;

    document.getElementById("answerInput").focus();

    document.getElementById("answerInput").onkeydown = function(e) {
        if (e.key === "Enter") {
            if (parseInt(this.value) === answer) correct();
            else wrong();
        }
    };
}

function reflexChallenge() {
    const correctBtn = Math.floor(Math.random() * 3);
    for (let i = 0; i < 3; i++) {
        let btn = document.createElement("button");
        btn.textContent = "Click";
        btn.onclick = () => {
            if (i === correctBtn) correct();
            else wrong();
        };
        gameArea.appendChild(btn);
    }
}

function correct() {
    score += 10 * difficulty;
    combo++;
    updateStats();
    nextChallenge();
}

function wrong() {
    combo = 0;
    time -= 3;
    updateStats();
    nextChallenge();
}

function endGame() {
    clearInterval(gameInterval);
    gameArea.innerHTML = `
        <h2>Game Over</h2>
        <p>Your Score: ${score}</p>
        <button onclick="location.reload()">Play Again</button>
    `;
}
