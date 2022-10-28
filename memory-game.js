"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;

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

const colors = shuffle(generateRandomColors());
createCards(colors);


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
    img.src = "assets/rithm-logo.svg";
    img.alt = "";
    card.appendChild(img);
    gameBoard.appendChild(card);
    card.addEventListener("click", handleCardClick);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.classList.toggle("visible");
  card.classList.toggle("hidden");
}

/** Flip a card face-down. */

function unFlipCard(card) {
  setTimeout(() => {
    card.classList.toggle("visible");
    card.classList.toggle("hidden");
  }, FOUND_MATCH_WAIT_MSECS);
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  const thisCard = evt.target;
  flipCard(thisCard);
  unFlipCard(thisCard);
}
