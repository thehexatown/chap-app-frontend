const suits = ["spades", "hearts", "clubs", "diamonds"];

function getValue() {
  var randomValue = Math.floor(Math.random() * 13) + 1;
  return randomValue;
}

function getSuit() {
  var randomValue = Math.floor(Math.random() * suits.length);
  return suits[randomValue];
}

function generateCard() {
  const cardValue = getValue();
  const suitValue = getSuit();

  const card = [suitValue, cardValue];
  return card;
}

function formatScore(score) {
  if (score > 10) {
    return 10;
  } else {
    return score;
  }
}

function generateHand(player) {
  while (player.deck.length < 2) {
    const cardPlayer = generateCard();
    player.deck.push(cardPlayer);

    const playerCardScore = formatScore(Number(cardPlayer[1]));
    player.score = player.score + playerCardScore;

    if (player.score == 21) {
      player.deck = [];
      player.score = 0;
    }
  }
}

function generateLeftHand(leftPlayer) {
  while (leftPlayer.deck.length < 2) {
    const cardPlayer = generateCard();
    leftPlayer.deck.push(cardPlayer);

    const playerCardScore = formatScore(Number(cardPlayer[1]));
    leftPlayer.score = leftPlayer.score + playerCardScore;

    if (leftPlayer.score == 21) {
      leftPlayer.deck = [];
      leftPlayer.score = 0;
    }
  }
}

export { generateCard, generateHand, formatScore, generateLeftHand };
