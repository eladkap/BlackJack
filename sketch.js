const SCREEN_WIDTH = 1400;
const SCREEN_HEIGHT = 800;

const CARD_SYMBOLS = ['-', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const CARD_SHAPES = ['\u2660', '\u2665', '\u2663', '\u2666'];

const CARD_WIDTH = 80;
const CARD_HEIGHT = 120;
const CARD_FONT_SIZE = 14;

const MAX_HAND_CARDS = 5;


var deck;

var dealer_hand;
var player_hand;

var isDealer2ndCardRevealed;

var hitButton;
var standButton;
var newRoundButton;
var revealDealerCardButton;

const roundResults = ['Game on',
											'BlackJack - Player Wins!',
 											'Player is Busted - Dealer Wins!',
											'Player Wins',
											'Dealer is Busted - Player Wins!',
											'Dealer Wins!',
											'Tie!'];

var roundResult = 0;


function setup() {
	createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
	background(0);
	setupGame();
	noLoop();
}

function draw() {
	// background(0);
}

function setupGame(){
	setButtons();
	resetRound();
}

function setButtons(){
	hitButton = createButton('Hit');
	hitButton.position(200, 200);
	hitButton.mousePressed(hit);

	standButton = createButton('Stand');
	standButton.position(200, 300);
	standButton.mousePressed(stand);

	newRoundButton = createButton('New Round');
	newRoundButton.position(width / 2, height / 2);
	newRoundButton.mousePressed(resetRound);
	newRoundButton.hide();

	revealDealerCardButton = createButton('Reveal Dealer Card');
	revealDealerCardButton.position(width / 2, height / 2 + 320);
	revealDealerCardButton.mousePressed(revealDealerCard);
	revealDealerCardButton.hide();
}

function displayScore(){
	noStroke();
	fill(0, 120, 120);
	textSize(32);
	text(player_hand.score(), width / 2 - CARD_WIDTH * 3 - 100, 150);
	text(dealer_hand.score(), width / 2 - CARD_WIDTH * 3 - 100, height - CARD_HEIGHT - 150);
}

function displayMessage(msg, msg_color){
	noStroke();
	fill(msg_color);
	textSize(32);
	text(msg, width / 2 - 200, height / 2 - 100);
}

function finishRound(roundResult){
	if ([1, 3, 4].includes(roundResult)){
		displayMessage(roundResults[roundResult], color(0, 250, 0));
	}
	else if ([2, 5].includes(roundResult)){
		displayMessage(roundResults[roundResult], color(250, 0, 0));
	}
	hitButton.hide();
	standButton.hide();
	revealDealerCardButton.hide();
	newRoundButton.show();
}

function resetRound(){
	background(0);
	isDealer2ndCardRevealed = false;
	deck = new Deck(1);
	deck.shuffle_cards();
	player_hand = new Hand(width / 2 - CARD_WIDTH * 3, 100, deck, 1, 2);
	player_hand.addCard(deck, to_reveal=true);
	player_hand.addCard(deck, to_reveal=true);
	player_hand.display();

	dealer_hand = new Hand(width / 2 - CARD_WIDTH * 3, height - CARD_HEIGHT - 100, deck, 2, 2);
	dealer_hand.addCard(deck, to_reveal=true);
	dealer_hand.addCard(deck, to_reveal=false);
	dealer_hand.display();

	displayScore();

	hitButton.show();
	standButton.show();
	newRoundButton.hide();
	revealDealerCardButton.hide();
}

function hit(){
	background(0);
	player_hand.addCard(deck, to_reveal=true);
	player_hand.display();
	dealer_hand.display();
	displayScore();

	// BlackJack - player wins
	if (player_hand.score() == 21){
		roundResult = 1;
		finishRound(roundResult);
		return;
	}

	// Player passed 21 pts and busted
	else if (player_hand.score() > 21){
		roundResult = 2;
		finishRound(roundResult);
		return;
	}

	// Player has reached max hand cards = 5
	else if (player_hand.count() == MAX_HAND_CARDS){
		stand();
	}
}

function stand(){
	background(0);
	player_hand.display();
	dealer_hand.display();
	displayScore();
	revealDealerCardButton.show();
	standButton.hide();
	hitButton.hide();
}

function revealDealerCard(){
	background(0);
	if (dealer_hand.count() == 2 && !isDealer2ndCardRevealed){
		console.log('reveal dealer 2n card');
		dealer_hand.cards_list[1].reveal();
		isDealer2ndCardRevealed = true;
	}
	else{
		dealer_hand.addCard(deck, to_reveal=true);
	}
	player_hand.display();
	dealer_hand.display();
	displayScore();

	if (dealer_hand.score() > 21){
		roundResult = 4;
		finishRound(roundResult);
		return;
	}

	if (player_hand.score() < dealer_hand.score()){
		roundResult = 5;
		finishRound(roundResult);
		return;
	}

	if (dealer_hand.count() == MAX_HAND_CARDS){
		checkWinner();
	}
}

function checkWinner(){
	hitButton.hide();
	standButton.hide();
	if (player_hand.score() > dealer_hand.score()){
		displayMessage(roundResults[3], color(0, 250, 0));
	}
	else if (player_hand.score() < dealer_hand.score()){
		displayMessage(roundResults[5], color(250, 0, 0));
	}
	else{
		displayMessage(roundResults[6], color(255));
	}
	newRoundButton.show();
	revealDealerCardButton.hide();
}
