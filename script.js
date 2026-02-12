let time = 60;
let score = 0;
let combo = 0;
let difficulty = 1;
let gameInterval;

const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("startBtn");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// Optional: tile click sound
// const clickSound = new Audio('sounds/click.mp3'); 
// clickSound.volume = 0.3;

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

// Randomly pick challenge
function nextChallenge() {
    gameArea.innerHTML = "";
    const mode = Math.floor(Math.random() * 3);
    if (mode === 0) memoryChallenge();
    else if (mode === 1) logicChallenge();
    else reflexChallenge();
}

// 🟩 Memory Challenge
function memoryChallenge() {
    const sequenceLength = 3 + Math.min(difficulty, 4);
    const colors = ["🟥","🟩","🟦","🟨","🟪"];
    let sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }

    gameArea.innerHTML = `<h2>Memorize!</h2>`;
    sequence.forEach(tile => {
        const div = document.createElement("div");
        div.className = "tile";
        div.textContent = tile;
        gameArea.appendChild(div);
    });

    setTimeout(() => {
        gameArea.innerHTML = `<h2>Tap Sequence</h2>`;
        let index = 0;
        sequence.forEach((tileSymbol) => {
            const div = document.createElement("div");
            div.className = "tile";
            div.textContent = tileSymbol;
            div.onclick = () => {
                // clickSound.play(); // optional click sound
                if (tileSymbol === sequence[index]) {
                    div.classList.add("correct");
                    index++;
                    if (index === sequence.length) playCorrect();
                } else {
                    div.classList.add("wrong");
                    playWrong();
                }
            };
            gameArea.appendChild(div);
        });
    }, 1500 + difficulty*200);
}

// 🧩 Logic Challenge (Multiple Choice)
function logicChallenge() {
    const questions = [
        {q:"Which number is even?", options:["3","4","7"], answer: "4"},
        {q:"Which symbol comes next: ▲, ▼, ▲, ?", options:["▲","▼","■"], answer:"▼"},
        {q:"Which is largest?", options:["12","8","9"], answer:"12"},
        {q:"Which one doesn’t belong?", options:["Circle","Square","Triangle"], answer:"Circle"}
    ];
    const pick = questions[Math.floor(Math.random() * questions.length)];
    gameArea.innerHTML = `<h2>${pick.q}</h2>`;
    pick.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = () => {
            // clickSound.play(); // optional
            if (opt === pick.answer) playCorrect();
            else playWrong();
        };
        gameArea.appendChild(btn);
    });
}

// ⚡ Reflex Challenge
function reflexChallenge() {
    const tiles = ["🟦","🟩","🟥","🟨"];
    const target = tiles[Math.floor(Math.random() * tiles.length)];
    gameArea.innerHTML = `<h2>Tap the ${target}</h2>`;
    tiles.forEach(tile => {
        const div = document.createElement("div");
        div.className = "tile";
        div.textContent = tile;
        div.onclick = () => {
            // clickSound.play(); // optional
            if (tile === target) playCorrect();
            else playWrong();
        };
        gameArea.appendChild(div);
    });
}

// Sound helper functions
function playCorrect() {
    score += 10 * difficulty;
    combo++;
    correctSound.currentTime = 0;
    correctSound.play();
    updateStats();
    nextChallenge();
}

function playWrong() {
    combo = 0;
    time -= 2;
    wrongSound.currentTime = 0;
    wrongSound.play();
    updateStats();
    nextChallenge();
}

// End game
function endGame() {
    clearInterval(gameInterval);
    gameArea.innerHTML = `
        <h2>Game Over</h2>
        <p>Your Score: ${score}</p>
        <p>Rank: ${getRank(score)}</p>
        <button onclick="location.reload()">Play Again</button>
    `;
}

function getRank(score){
    if(score<50) return "🧠 Beginner";
    if(score<120) return "⚡ Fast Thinker";
    if(score<200) return "🔥 Brain Monster";
    return "👑 Logic King";
}
