let deck;
let resultDeck;
let startButton = document.querySelector('#start');
let gameField = document.querySelector('#game-field');
let flippedCards = [];

let game = new Game();

game.gameViewModel();

startButton.addEventListener("click", startGame);
gameField.addEventListener("click", evt => {
    game.flip(evt, game.skirtCard, flippedCards);
});

function startGame() {
    game.hideRules();
    game.disableMenuButtons();
    deck = game.createDeck(cards, game.difficultyGame);
    resultDeck = game.shuffle(deck);
    game.generate(resultDeck, game.skirtCard);
    game.timer();
}