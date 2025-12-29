document.addEventListener("DOMContentLoaded", () => {

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

let soundEnabled = false;
let audioContextStarted = false;

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

/* === SOUND FUNCTIONS === */

// Function to initialize audio (required for mobile)
async function initAudio() {
  if (audioContextStarted) return;
  
  try {
    // Create and resume AudioContext (required for iOS)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const audioContext = new AudioContext();
      await audioContext.resume();
    }
    
    // Pre-load audio files
    await Promise.all([
      bgm.load(),
      soundCorrect.load(),
      soundWrong.load()
    ]);
    
    audioContextStarted = true;
    console.log("Audio initialized successfully");
  } catch (error) {
    console.warn("Audio initialization failed:", error);
  }
}

// Function to start BGM with user interaction
function startBGM() {
  if (soundEnabled) return;
  
  initAudio().then(() => {
    bgm.play()
      .then(() => {
        soundEnabled = true;
        console.log("BGM started successfully");
      })
      .catch(error => {
        console.warn("Failed to play BGM:", error);
        
        // Fallback: Enable sound on first user interaction
        const enableOnInteraction = () => {
          bgm.play().catch(() => {});
          soundEnabled = true;
          document.removeEventListener('click', enableOnInteraction);
          document.removeEventListener('touchstart', enableOnInteraction);
        };
        
        document.addEventListener('click', enableOnInteraction);
        document.addEventListener('touchstart', enableOnInteraction);
      });
  });
}

// Function to play sound effects
function playSound(sound) {
  if (!soundEnabled) return;
  
  sound.currentTime = 0;
  sound.play().catch(error => {
    console.warn("Could not play sound effect:", error);
  });
}

/* TIMER */
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
{q:"Which modern tool has greatly influenced today's communication?",o:["Carrier pigeons","Stone tablets","Smoke signals","Social media"],a:3},
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
{q:"Which communication involves group decision-making?",o:["Mass communication","Small group communication","Public communication","Non-verbal"],a:1},
{q:"Which communication involves newspapers, TV and radio?",o:["Mass communication","Interpersonal","Intrapersonal","Public"],a:0},
{q:"Which non-verbal category studies body movement?",o:["Proxemics","Oculesics","Vocalics","Kinesics"],a:3},
{q:"Which non-verbal category studies space and distance?",o:["Kinesics","Proxemics","Vocalics","Artifactuals"],a:1},
{q:"Which non-verbal category studies eye contact?",o:["Proxemics","Vocalics","Oculesics","Haptics"],a:2},
{q:"Which non-verbal category involves touch?",o:["Haptics","Vocalics","Kinesics","Artifactuals"],a:1},
{q:"Which non-verbal category involves voice qualities?",o:["Proxemics","Vocalics","Oculesics","Artifactuals"],a:0},
{q:"Which non-verbal category involves clothing and accessories?",o:["Vocalics","Proxemics","Haptics","Artifactuals",],a:3},

/* ===== COMMUNICATION BARRIERS (61–110) ===== */

{q:"Which barrier involves noise and distance?",o:["Psychological","Cultural","Emotional","Physical"],a:3},
{q:"Which barrier involves eyesight or hearing difficulties?",o:["Cultural","Emotional","Physiological","Attitudinal"],a:2},
{q:"Which barrier involves anger and stress?",o:["Physical","Psychological","Cultural","Systematic"],a:1},
{q:"Which barrier involves stereotypes and cultural background?",o:["Cultural","Emotional","Attitudinal","Language"],a:0},
{q:"Which barrier involves fear and anxiety?",o:["Physical","Cultural","Systematic","Emotional"],a:3},
{q:"Which barrier involves personality conflicts?",o:["Emotional","Cultural","Attitudinal","Language"],a:2},
{q:"Which barrier involves false assumptions?",o:["Systematic","Expectations and prejudices","Language","Emotional"],a:1},
{q:"Which barrier involves lack of role clarity in organizations?",o:["Systematic","Attitudinal","Cultural","Language"],a:0},
{q:"Which barrier involves slang and jargon?",o:["Emotional","Attitudinal","Cultural","Language"],a:3},
{q:"Which barrier involves taboo topics?",o:["Emotional","Attitudinal","Cultural","Language"],a:2},
{q:"Which barrier involves poor management?",o:["Emotional","Attitudinal","Cultural","Language"],a:1},
{q:"Which barrier involves miscommunication in organizations?",o:["Systematic","Emotional","Attitudinal","Language"],a:0},
{q:"Which barrier involves similar-sounding words?",o:["Emotional","Attitudinal","Language","Cultural"],a:2},
{q:"Which barrier involves abbreviations?",o:["Emotional","Attitudinal","Cultural","Language"],a:0},
{q:"Which barrier involves stress?",o:["Emotional","Psychological","Attitudinal","Cultural"],a:1},
{q:"Which barrier involves low self-esteem?",o:["Psychological","Emotional","Attitudinal","Cultural"],a:0},
{q:"Which barrier involves pain?",o:["Emotional","Attitudinal","Cultural","Physiological"],a:3},
{q:"Which barrier involves hearing difficulties?",o:["Emotional","Attitudinal","Physiological","Cultural"],a:2},

/* ===== HEALTHCARE & AGE GROUP COMMUNICATION (111–160) ===== */

{q:"Why must healthcare providers avoid assumptions?",o:["Patients are identical","Each patient is unique","Patients always understand","Communication is unnecessary"],a:1},
{q:"Why is observation important in patient communication?",o:["Helps assess patient condition","Replaces diagnosis","Avoids treatment","Eliminates respect"],a:0},
{q:"Why must older adults receive simple instructions?",o:["Refuse treatment","Dislike communication","Slower responses","Prefer silence"],a:2},
{q:"Why is attentive listening important with children?",o:["Promotes security","Replaces speech","Avoids diagnosis","Discourages cooperation"],a:0},
{q:"Why should toddlers be communicated with at eye level?",o:["Intimidate them","Confuse them","Discourage them","Show calmness"],a:3},
{q:"Why should negative sentences be avoided with children?",o:["Promote honesty","Increase fear","Encourage cooperation","Reduce respect"],a:1},
{q:"Why should demonstrations be used with children?",o:["More effective than verbal instruction","Confuse children","Discourage cooperation","Replace respect"],a:0},
{q:"Why should praise be used with children?",o:["Discourages effort","Encourages cooperation","Replaces respect","Confuses them"],a:1},
{q:"Why should teenagers be given privacy?",o:["Respect modesty","Dislike respect","Avoid communication","Prefer silence"],a:0},
{q:"Why is an interpreter important in foreign language communication?",o:["Avoid respect","Confuse patients","Replace diagnosis","Ensure understanding"],a:3},
{q:"Why should providers look directly at patients when using interpreters?",o:["Show respect","Intimidate","Confuse","Avoid communication"],a:0},
{q:"Why should providers speak clearly to hearing-impaired patients?",o:["Confuse them","Discourage them","Ensure understanding","Replace respect"],a:2},
{q:"Why should providers avoid shouting at hearing-impaired patients?",o:["Shows respect","Shouting distorts speech","Is effective","Avoids diagnosis"],a:1},
{q:"Why should noisy backgrounds be avoided for hearing-impaired patients?",o:["Interfere with understanding","Promote respect","Encourage communication","Replace diagnosis"],a:0},
{q:"Why is a certified interpreter essential for deaf patients?",o:["Confuse them","Discourage them","Replace respect","Ensure accurate communication"],a:3},
{q:"Why should written communication be used with deaf patients?",o:["Provides clarity","Confuses them","Discourages them","Replaces respect"],a:0},
{q:"Why should clear verbal instructions be given to visually impaired patients?",o:["Confuse them","Discourage them","Ensure understanding","Replace respect"],a:2},
{q:"Why is communication vital in healthcare?",o:["Replaces diagnosis","Discourages respect","Avoids treatment","Miscommunication can mean life or death"],a:3}
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
  // Start BGM on first interaction
  if (!soundEnabled) {
    startBGM();
  }
  
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

/* QUESTION */
function askQuestion() {
  if (questionQueue.length === 0) shuffleQuestions();
  const q = questionQueue.pop();

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
    playSound(soundCorrect);
    button.classList.add("correct");
    firstCard.classList.remove("closed");
    canPickSecond = true;

    setTimeout(() => {
      modal.classList.add("hidden");
      inputLocked = false;
    }, 300);
  } else {
    playSound(soundWrong);
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

// Also start BGM if user clicks any button
replayBtn.addEventListener("click", () => {
  if (!soundEnabled) startBGM();
});
fullscreenBtn.addEventListener("click", () => {
  if (!soundEnabled) startBGM();
});

});