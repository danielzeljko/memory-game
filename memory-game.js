"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
let isBoardLocked = false;
let totalFlips = 0;
let currentLevel = 1;

const playBtn = document.getElementById("playBtn");
playBtn.addEventListener("click", startGame)

/** Starts the game */
function startGame(){
  const gameStats = document.getElementById("game-stats");
  gameStats.classList.toggle("d-none");
  playBtn.classList.toggle("d-none");
  const colors = shuffle(generateRandomColors());
  createCards(colors);
  initializeStats();
  countDownTimer();
}

function initializeStats() {
  const level = document.getElementById("level");
  const flips = document.getElementById("flips");
  flips.textContent = 0;
  level.textContent = currentLevel;
}

/** Generates random RGB color values */
function generateRandomColors() {
  const randColors = [];
  for (let i = 1; i <= 5; i++) {
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
    }
  }
}

function updateFlips(){
  totalFlips++;
  flips.textContent = totalFlips;
}

function countDownTimer(){
  const time = document.getElementById("time");
  let count = 60;
  time.textContent = count;

  const timer = setInterval(() => {
    count--;
    time.textContent = count;

    if(count === 0) clearInterval(timer);
  }, FOUND_MATCH_WAIT_MSECS);
}
