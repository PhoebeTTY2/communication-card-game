document.addEventListener("DOMContentLoaded", () => {

/* =====================
   CONFIG
===================== */
const PREVIEW_TIME = 20000;
const GAME_TIME = 600;
const TOTAL_PLAYERS = 4;

/* =====================
   SOUND
===================== */
const bgm = new Audio("bgm.mp3");
bgm.loop = true;
bgm.volume = 0.3;

const soundCorrect = new Audio("correct.mp3");
const soundWrong = new Audio("wrong.mp3");

let soundStarted = false;
function startSoundOnce() {
  if (!soundStarted) {
    bgm.play().catch(()=>{});
    soundStarted = true;
  }
}

/* =====================
   ELEMENTS
===================== */
const board = document.getElementById("board");
const modal = document.getElementById("questionModal");
const qText = document.getElementById("qText");
const choices = document.getElementById("choices");
const instruction = document.getElementById("instruction");
const playersEl = document.querySelectorAll(".player");
const replayBtn = document.getElementById("replayBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

/* =====================
   GAME STATE
===================== */
let scores = [0,0,0,0];
let currentPlayer = 0;
let firstCard = null;
let secondCard = null;
let canPickSecond = false;
let gameStarted = false;
let gameOver = false;
let inputLocked = false;

/* =====================
   TIMER
===================== */
let timeLeft = GAME_TIME;
let timer = null;

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    instruction.textContent =
      `⏱ Time Left: ${Math.floor(timeLeft/60)}:${String(timeLeft%60).padStart(2,"0")}`;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

/* =====================
   CARDS
===================== */
const emojis = ["🍎","🍌","🍓","🍇","🍉","🍒","🥝","🍍","🥑","🌽","🥕","🍄","🧁","🍩","🍪"];
const cardsData = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

/* =====================
   QUESTIONS
===================== */
const questionsBase = [
  {q:"What is communication?",o:["Silence","Transfer of information","Memory","Storage"],a:1},
  {q:"Which is non-verbal?",o:["Email","Speech","Gesture","Letter"],a:2},
  {q:"Which is mass communication?",o:["TV news","Chat","Diary","Thinking"],a:0}
];

let questionQueue = [];
let currentQuestion = null;

function shuffleQuestions() {
  questionQueue = [...questionsBase].sort(() => Math.random() - 0.5);
}
shuffleQuestions();

/* =====================
   CREATE BOARD
===================== */
board.innerHTML = "";
cardsData.forEach(symbol => {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = symbol;
  card.onclick = () => handleCard(card);
  board.appendChild(card);
});

/* =====================
   PREVIEW
===================== */
instruction.textContent = "👀 Memorize the cards! (20 seconds)";
setTimeout(() => {
  document.querySelectorAll(".card").forEach(c => c.classList.add("closed"));
  gameStarted = true;
  instruction.textContent = "🎮 Game Started!";
  startTimer();
}, PREVIEW_TIME);

/* =====================
   CARD CLICK
===================== */
function handleCard(card) {
  startSoundOnce();
  if (!gameStarted || gameOver || inputLocked) return;
  if (!card.classList.contains("closed")) return;

  if (!firstCard) {
    firstCard = card;
    askQuestion();
  } else if (canPickSecond && card !== firstCard) {
    secondCard = card;
    resolveMatch();
  }
}

/* =====================
   QUESTION
===================== */
function askQuestion() {
  if (questionQueue.length === 0) shuffleQuestions();
  currentQuestion = questionQueue.pop();

  inputLocked = true;
  modal.classList.remove("hidden");
  qText.textContent = currentQuestion.q;
  choices.innerHTML = "";

  currentQuestion.o.forEach((opt,i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(btn,i);
    choices.appendChild(btn);
  });
}

/* =====================
   ANSWER CHECK
===================== */
function checkAnswer(button,index) {
  const btns = document.querySelectorAll("#choices button");
  btns.forEach(b => b.disabled = true);

  if (index === currentQuestion.a) {
    soundCorrect.play().catch(()=>{});
    button.classList.add("correct");
    firstCard.classList.remove("closed");
    canPickSecond = true;

    setTimeout(() => {
      modal.classList.add("hidden");
      inputLocked = false; // ✅ allow second click
    }, 300);

  } else {
    soundWrong.play().catch(()=>{});
    button.classList.add("wrong");

    btns.forEach((b,i) => {
      if (i === currentQuestion.a) b.classList.add("correct");
    });

    setTimeout(() => {
      modal.classList.add("hidden");
      inputLocked = false;
      resetTurn();
      nextPlayer();
    }, 1000);
  }
}

/* =====================
   MATCH LOGIC
===================== */
function resolveMatch() {
  secondCard.classList.remove("closed");

  if (firstCard.textContent === secondCard.textContent) {
    firstCard.classList.add(`p${currentPlayer}`);
    secondCard.classList.add(`p${currentPlayer}`);
    scores[currentPlayer]++;
    playersEl[currentPlayer].querySelector("span").textContent = scores[currentPlayer];
  } else {
    setTimeout(() => {
      firstCard.classList.add("closed");
      secondCard.classList.add("closed");
    }, 700);
  }

  setTimeout(() => {
    resetTurn();
    nextPlayer();
    checkEnd();
  }, 800);
}

/* =====================
   TURN
===================== */
function resetTurn() {
  firstCard = null;
  secondCard = null;
  canPickSecond = false;
}

/* =====================
   PLAYER
===================== */
function nextPlayer() {
  playersEl[currentPlayer].classList.remove("active");
  currentPlayer = (currentPlayer + 1) % TOTAL_PLAYERS;
  playersEl[currentPlayer].classList.add("active");
}

/* =====================
   END GAME
===================== */
function checkEnd() {
  if (document.querySelectorAll(".card.closed").length === 0) endGame();
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  clearInterval(timer);
  bgm.pause();
  alert("🏆 GAME OVER!");
}

/* =====================
   BUTTONS
===================== */
replayBtn.onclick = () => location.reload();
fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(()=>{});
  } else document.exitFullscreen();
};

});



