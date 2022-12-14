"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const NUM_CARD_PAIRS = 8;
let isBoardLocked = false;
let totalFlips = 0;
let elapsedTime = null;
let pairsRemaining = NUM_CARD_PAIRS;
let timerId;

const playBtn = document.getElementById("playBtn");
playBtn.addEventListener("click", startGame)

const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", resetGame);

const highScoreBtn = document.getElementById("highScoreBtn");
highScoreBtn.addEventListener("click", showHighScore);

const highestScore = {
  time: null,
  flips: null,
}

/** Show highscore */
function showHighScore(){
  const highestScore = JSON.parse(localStorage.getItem("highestScore"));
  if(highestScore){
    alert(JSON.stringify(JSON.parse(localStorage.getItem("highestScore")), null, 2))
  } else {
    alert("No highscore has been set.")
  }
}

/** Starts the game */
function startGame(){
  const gameStats = document.getElementById("game-stats");
  gameStats.classList.toggle("d-none");
  playBtn.classList.toggle("d-none");
  const newRecord = document.getElementById("newRecord");
  newRecord.classList.add("d-none")
  createBoard();
  // playTheme();
}

// didn't feel like implementing a mute button
/** Play the game theme song */

// function playTheme(){
//   const audio = new Audio("assets/Extreme-Sport-Trap-Music-PISTA.mp3");
//   audio.play();
// }

/** Play the correct tone */

function playRight(){
  const audio = new Audio("assets/mixkit-correct-answer-tone-2870.wav");
  audio.play();
}

/** Play the incorrect tone */

function playWrong(){
  const audio = new Audio("assets/mixkit-failure-arcade-alert-notification-240.wav");
  audio.play();
}

/** Create the game game board */

function createBoard(){
  // reset previous board
  const gameBoard = document.getElementById("game");
  gameBoard.innerHTML = "";

  // create new board
  const colors = shuffle(generateRandomColors());
  createCards(colors);
  initializeStats();
  countUpTimer();
}

/** Restart the game */

function resetGame(){
  initializeStats();
  createBoard();
  // playTheme();

  // hide restart section
  const restartDiv = document.getElementById("restart");
  restartDiv.classList.add("d-none");
}

/** Set up the game stats */
function initializeStats() {
  clearInterval(timerId);

  const time = document.getElementById("time");
  const pairs = document.getElementById("pairs");
  const flips = document.getElementById("flips");
  time.textContent = 0;
  totalFlips = 0;
  flips.textContent = totalFlips;
  pairsRemaining = NUM_CARD_PAIRS;
  pairs.textContent = pairsRemaining;
}

/** Generates random RGB color values */
function generateRandomColors() {
  const randColors = [];
  for (let i = 1; i <= NUM_CARD_PAIRS; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    randColors.push(`rgb(${r}, ${g}, ${b})`, `rgb(${r}, ${g}, ${b})`);
  }
  return randColors;
}


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const card = document.createElement("div");
    const img = document.createElement("img");
    card.classList = "card hidden";
    card.style.background = color;
    card.setAttribute("data-flipped", false);
    card.setAttribute("data-matched", false);
    img.src = "assets/rithm-logo.svg";
    img.alt = "";
    card.appendChild(img);
    gameBoard.appendChild(card);
    card.addEventListener("click", handleCardClick);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  updateFlips();
  card.classList.toggle("visible");
  card.classList.toggle("hidden");
  card.dataset.flipped = true;
  checkCardMatch();
}

/** Flip a card face-down. */

function unFlipCard(cards) {
  cards.map(card => card.classList.remove("incorrect"))

  setTimeout(() => {

    cards.map(card => {
      card.classList.add("incorrect");
      card.classList.toggle("visible");
      card.classList.toggle("hidden");
      card.dataset.flipped = false;
    });
    isBoardLocked = false;
    playWrong();
  }, FOUND_MATCH_WAIT_MSECS + 500);
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  if (isBoardLocked) return;

  const thisCard = evt.target;
  if(thisCard.dataset.flipped === "false") flipCard(thisCard);
}

/** Checks to see if the two cards match each other */
function checkCardMatch() {
  const options = `div[data-flipped="true"]:not(div[data-matched="true"])`;
  const currFlippedCards = document.querySelectorAll(options);

  if (currFlippedCards.length === 2) {
    isBoardLocked = true;

    const [firstCard, secondCard] = currFlippedCards;
    if (firstCard.style.backgroundColor !== secondCard.style.backgroundColor) {
      unFlipCard([firstCard, secondCard]);
    } else {
      firstCard.removeEventListener("click", handleCardClick);
      secondCard.removeEventListener("click", handleCardClick);
      firstCard.dataset.matched = true;
      secondCard.dataset.matched = true;
      isBoardLocked = false;
      pairsRemaining--;
      pairs.textContent = pairsRemaining;
      playRight();


      if(pairsRemaining === 0){
        gameOver();
      }
    }
  }
}

/** Increate total flips and update the UI */

function updateFlips(){
  totalFlips++;
  flips.textContent = totalFlips;
}

/** Start the count up timer */

function countUpTimer(){
  const time = document.getElementById("time");
  let count = 0;
  time.textContent = count;

  const timer = setInterval(() => {
    timerId = timer;

    count++;
    elapsedTime = count;
    time.textContent = `${count} sec`;
  }, FOUND_MATCH_WAIT_MSECS);
}

/** Show game over, stop timer, set high score */

function gameOver(){
  const restart = document.getElementById("restart");
  restart.classList.remove("d-none")
  clearInterval(timerId);
  setHighScore();
}

/** Set high score */
function setHighScore(){
  const lastHighScore = JSON.parse(localStorage.getItem("highestScore"));

  if(lastHighScore){

    if(elapsedTime < lastHighScore.time && totalFlips <= lastHighScore.flips) {
      highestScore.flips = totalFlips;
      highestScore.time = elapsedTime;
      localStorage.setItem("highestScore", JSON.stringify(highestScore));
      const newRecord = document.getElementById("newRecord");
      newRecord.classList.remove("d-none")
    }

  } else {
    highestScore.flips = totalFlips;
    highestScore.time = elapsedTime;
    localStorage.setItem("highestScore", JSON.stringify(highestScore));
  }
}
