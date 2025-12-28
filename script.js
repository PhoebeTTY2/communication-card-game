document.addEventListener("DOMContentLoaded", () => {

 document.addEventListener("DOMContentLoaded", () => {

  /* SOUND */
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

  /* 🔓 MOBILE AUDIO UNLOCK (DO NOT MOVE BELOW THIS) */
  function unlockAudio() {
    bgm.play().then(() => {
      bgm.pause();
      bgm.currentTime = 0;
    }).catch(()=>{});

    document.removeEventListener("touchstart", unlockAudio);
    document.removeEventListener("click", unlockAudio);
  }

  document.addEventListener("touchstart", unlockAudio, { once: true });
  document.addEventListener("click", unlockAudio, { once: true });


  /* =====================
     CONFIG
  ===================== */


/* CONFIG */
const PREVIEW_TIME = 20000;
const GAME_TIME = 600;
const TOTAL_PLAYERS = 4;

/* SOUND */
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

/* ELEMENTS */
const board = document.getElementById("board");
const modal = document.getElementById("questionModal");
const qText = document.getElementById("qText");
const choices = document.getElementById("choices");
const instruction = document.getElementById("instruction");
const playersEl = document.querySelectorAll(".player");
const replayBtn = document.getElementById("replayBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const game = document.getElementById("game");

/* STATE */
let scores = [0,0,0,0];
let currentPlayer = 0;
let firstCard = null;
let secondCard = null;
let canPickSecond = false;
let gameStarted = false;
let gameOver = false;
let inputLocked = false;

/* TIMER */
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

/* CARDS */
const emojis = ["🍎","🍌","🍓","🍇","🍉","🍒","🥝","🍍","🥑","🌽","🥕","🍄","🧁","🍩","🍪"];
const cardsData = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

/* QUESTIONS */
  const questionsBase = [

/* ===== BASIC COMMUNICATION (1–60) ===== */

{q:"What is the simplest definition of communication?",o:["The process of forgetting information","The ability to memorize facts","The process of transferring information","The act of storing information"],a:2},
{q:"Which of the following is NOT part of the communication process?",o:["Message","Receiver","Silence without meaning","Sender"],a:2},
{q:"Which modern tool has greatly influenced today’s communication?",o:["Carrier pigeons","Stone tablets","Smoke signals","Social media"],a:3},
{q:"Which is the most intimate form of communication today?",o:["Email","Talking face-to-face","Facebook status","Twitter post"],a:1},
{q:"Which type of communication uses words as its primary medium?",o:["Silent communication","Non-verbal communication","Symbolic communication","Verbal communication"],a:3},
{q:"Which type of communication relies on gestures and body language?",o:["Non-verbal communication","Digital communication","Verbal communication","Written communication"],a:0},
{q:"Which is an example of mass communication?",o:["News broadcast on TV","Writing a diary","Two friends chatting","Teacher speaking to a class"],a:0},
{q:"Which is NOT a form of verbal communication?",o:["Small group communication","Interpersonal communication","Intrapersonal communication","Facial expressions"],a:3},
{q:"Which of the following is a barrier to communication?",o:["Respect","Sensitivity","Humility","Noise"],a:3},
{q:"Why is communication important in healthcare?",o:["Ensures patients feel respected and understood","Eliminates diagnosis","Replaces medical knowledge","Helps memorize facts"],a:0},
{q:"Which type of communication occurs within oneself?",o:["Interpersonal","Intrapersonal","Mass","Public"],a:1},
{q:"Which type of communication involves two or more people?",o:["Intrapersonal","Interpersonal","Mass","Non-verbal"],a:1},
{q:"Which type of communication addresses a large audience?",o:["Public communication","Small group","Intrapersonal","Non-verbal"],a:0},
{q:"Which communication involves group decision-making?",o:["Small group communication","Mass communication","Public communication","Non-verbal"],a:0},
{q:"Which communication involves newspapers, TV and radio?",o:["Mass communication","Interpersonal","Intrapersonal","Public"],a:0},
{q:"Which non-verbal category studies body movement?",o:["Kinesics","Proxemics","Oculesics","Vocalics"],a:0},
{q:"Which non-verbal category studies space and distance?",o:["Proxemics","Kinesics","Vocalics","Artifactuals"],a:0},
{q:"Which non-verbal category studies eye contact?",o:["Oculesics","Proxemics","Vocalics","Haptics"],a:0},
{q:"Which non-verbal category involves touch?",o:["Haptics","Vocalics","Kinesics","Artifactuals"],a:0},
{q:"Which non-verbal category involves voice qualities?",o:["Vocalics","Proxemics","Oculesics","Artifactuals"],a:0},
{q:"Which non-verbal category involves clothing and accessories?",o:["Artifactuals","Vocalics","Proxemics","Haptics"],a:0},

/* ===== COMMUNICATION BARRIERS (61–110) ===== */

{q:"Which barrier involves noise and distance?",o:["Physical","Psychological","Cultural","Emotional"],a:0},
{q:"Which barrier involves eyesight or hearing difficulties?",o:["Physiological","Cultural","Emotional","Attitudinal"],a:0},
{q:"Which barrier involves anger and stress?",o:["Psychological","Physical","Cultural","Systematic"],a:0},
{q:"Which barrier involves stereotypes and cultural background?",o:["Cultural","Emotional","Attitudinal","Language"],a:0},
{q:"Which barrier involves fear and anxiety?",o:["Emotional","Physical","Cultural","Systematic"],a:0},
{q:"Which barrier involves personality conflicts?",o:["Attitudinal","Emotional","Cultural","Language"],a:0},
{q:"Which barrier involves false assumptions?",o:["Expectations and prejudices","Systematic","Language","Emotional"],a:0},
{q:"Which barrier involves lack of role clarity in organizations?",o:["Systematic","Attitudinal","Cultural","Language"],a:0},
{q:"Which barrier involves slang and jargon?",o:["Language","Emotional","Attitudinal","Cultural"],a:0},
{q:"Which barrier involves too much information?",o:["Information overload","Language","Physical","Psychological"],a:0},
{q:"Which barrier involves resistance to change?",o:["Attitudinal","Emotional","Cultural","Language"],a:0},
{q:"Which barrier involves taboo topics?",o:["Cultural","Emotional","Attitudinal","Language"],a:0},
{q:"Which barrier involves poor management?",o:["Attitudinal","Emotional","Cultural","Language"],a:0},
{q:"Which barrier involves miscommunication in organizations?",o:["Systematic","Emotional","Attitudinal","Language"],a:0},
{q:"Which barrier involves similar-sounding words?",o:["Language","Emotional","Attitudinal","Cultural"],a:0},
{q:"Which barrier involves abbreviations?",o:["Language","Emotional","Attitudinal","Cultural"],a:0},
{q:"Which barrier involves stress?",o:["Psychological","Emotional","Attitudinal","Cultural"],a:0},
{q:"Which barrier involves low self-esteem?",o:["Psychological","Emotional","Attitudinal","Cultural"],a:0},
{q:"Which barrier involves pain?",o:["Physiological","Emotional","Attitudinal","Cultural"],a:0},
{q:"Which barrier involves hearing difficulties?",o:["Physiological","Emotional","Attitudinal","Cultural"],a:0},

/* ===== HEALTHCARE & AGE GROUP COMMUNICATION (111–160) ===== */

{q:"Why must healthcare providers avoid assumptions?",o:["Each patient is unique","Patients are identical","Patients always understand","Communication is unnecessary"],a:0},
{q:"Why is observation important in patient communication?",o:["Helps assess patient condition","Replaces diagnosis","Avoids treatment","Eliminates respect"],a:0},
{q:"Why must older adults receive simple instructions?",o:["Slower responses","Refuse treatment","Dislike communication","Prefer silence"],a:0},
{q:"Why should instructions be given one at a time to older adults?",o:["Avoid overwhelming them","Speed treatment","Reduce respect","Increase confusion"],a:0},
{q:"Why is attentive listening important with children?",o:["Promotes security","Replaces speech","Avoids diagnosis","Discourages cooperation"],a:0},
{q:"Why should toddlers be communicated with at eye level?",o:["Show calmness","Intimidate them","Confuse them","Discourage them"],a:0},
{q:"Why should negative sentences be avoided with children?",o:["Increase fear","Promote honesty","Encourage cooperation","Reduce respect"],a:0},
{q:"Why should demonstrations be used with children?",o:["More effective than verbal instruction","Confuse children","Discourage cooperation","Replace respect"],a:0},
{q:"Why should praise be used with children?",o:["Encourages cooperation","Discourages effort","Replaces respect","Confuses them"],a:0},
{q:"Why should teenagers be given privacy?",o:["Respect modesty","Dislike respect","Avoid communication","Prefer silence"],a:0},
{q:"Why is an interpreter important in foreign language communication?",o:["Ensure understanding","Avoid respect","Confuse patients","Replace diagnosis"],a:0},
{q:"Why should providers look directly at patients when using interpreters?",o:["Show respect","Intimidate","Confuse","Avoid communication"],a:0},
{q:"Why should providers speak clearly to hearing-impaired patients?",o:["Ensure understanding","Confuse them","Discourage them","Replace respect"],a:0},
{q:"Why should providers avoid shouting at hearing-impaired patients?",o:["Shouting distorts speech","Shows respect","Is effective","Avoids diagnosis"],a:0},
{q:"Why should noisy backgrounds be avoided for hearing-impaired patients?",o:["Interfere with understanding","Promote respect","Encourage communication","Replace diagnosis"],a:0},
{q:"Why is a certified interpreter essential for deaf patients?",o:["Ensure accurate communication","Confuse them","Discourage them","Replace respect"],a:0},
{q:"Why should written communication be used with deaf patients?",o:["Provides clarity","Confuses them","Discourages them","Replaces respect"],a:0},
{q:"Why should clear verbal instructions be given to visually impaired patients?",o:["Confuse them","Discourage them","Replace respect","Ensure understanding"],a:3},
{q:"Why is communication vital in healthcare?",o:["Replaces diagnosis","Discourages respect","Miscommunication can mean life or death","Avoids treatment"],a:2}
];

let questionQueue = [];
function shuffleQuestions() {
  questionQueue = [...questionsBase].sort(() => Math.random() - 0.5);
}
shuffleQuestions();

/* CREATE BOARD */
board.innerHTML = "";
cardsData.forEach(symbol => {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = symbol;
  card.classList.remove("closed");

  card.addEventListener("click", () => handleCard(card));
  card.addEventListener("touchstart", e => {
    e.preventDefault();
    handleCard(card);
  });

  board.appendChild(card);
});

/* PREVIEW */
setTimeout(() => {
  document.querySelectorAll(".card").forEach(c => c.classList.add("closed"));
  gameStarted = true;
  instruction.textContent = "🎮 Game Started!";
  startTimer();
}, PREVIEW_TIME);

/* CARD CLICK */
function handleCard(card) {
  startSoundOnce();
  if (!gameStarted || gameOver || inputLocked) return;
  if (!card.classList.contains("closed")) return;
  if (!modal.classList.contains("hidden")) return;

  if (!firstCard) {
    firstCard = card;
    askQuestion();
  } else if (canPickSecond && card !== firstCard) {
    secondCard = card;
    resolveMatch();
  }
}

function shuffleOptions(q) {
  const correct = q.o[q.a];
  const shuffled = q.o
    .map(opt => ({ opt, sort: Math.random() }))
    .sort((a,b) => a.sort - b.sort)
    .map(o => o.opt);

  q.o = shuffled;
  q.a = shuffled.indexOf(correct);
}


/* QUESTION */
function askQuestion() {
  if (questionQueue.length === 0) shuffleQuestions();
  const q = questionQueue.pop();
shuffleOptions(q);

  inputLocked = true;
  modal.classList.remove("hidden");
  qText.textContent = q.q;
  choices.innerHTML = "";

  q.o.forEach((opt,i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(btn,i,q);
    choices.appendChild(btn);
  });
}

/* ANSWER */
function checkAnswer(button,index,q) {
  document.querySelectorAll("#choices button").forEach(b => b.disabled = true);

  if (index === q.a) {
    soundCorrect.play().catch(()=>{});
    button.classList.add("correct");
    firstCard.classList.remove("closed");
    canPickSecond = true;

    setTimeout(() => {
      modal.classList.add("hidden");
      inputLocked = false;
    }, 300);
  } else {
    soundWrong.play().catch(()=>{});
    button.classList.add("wrong");
    document.querySelectorAll("#choices button")[q.a].classList.add("correct");

    setTimeout(() => {
      modal.classList.add("hidden");
      inputLocked = false;
      resetTurn();
      nextPlayer();
    }, 1000);
  }
}

/* MATCH */
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

function resetTurn() {
  firstCard = null;
  secondCard = null;
  canPickSecond = false;
}

function nextPlayer() {
  playersEl[currentPlayer].classList.remove("active");
  currentPlayer = (currentPlayer + 1) % TOTAL_PLAYERS;
  playersEl[currentPlayer].classList.add("active");
}

/* END */
function checkEnd() {
  if (document.querySelectorAll(".card.closed").length === 0) endGame();
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  clearInterval(timer);
  bgm.pause();
  
const max = Math.max(...scores);
  const winners = scores
    .map((s,i)=> s === max ? `Player ${i+1}` : null)
    .filter(Boolean);

  alert(`🏆 GAME OVER!\nWinner: ${winners.join(", ")}\nScore: ${max}`);
}


/* BUTTONS */
replayBtn.onclick = () => location.reload();

fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    game.requestFullscreen({ navigationUI: "hide" }).catch(()=>{});
  } else {
    document.exitFullscreen();
  }
};

});



