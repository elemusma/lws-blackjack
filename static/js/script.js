// Challenge 5: Blackjack

let blackjackGame = {
    'you': {'scoreSpan': '#yourBlackjackResult', 'div': '#yourBox', 'score': 0},
    'dealer': {'scoreSpan': '#dealerBlackjackResult', 'div': '#dealerBox', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9','10','K','J','Q','A'],
    'cardsMap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':[1, 11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand':false,
    'turnsOver':false,
}

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjackHitBtn').addEventListener('click', blackjackHit);
document.querySelector('#blackjackDealBtn').addEventListener('click', blackjackDeal);
document.querySelector('#blackjackStandBtn').addEventListener('click', dealerLogic);

function blackjackHit(){
if (blackjackGame['isStand'] === false){
    let card = randomCard();
    console.log(card);
    showCard(card, YOU);
    updateScore(card,YOU);
    showScore(YOU); 
    console.log(YOU['score']);
}
}
function randomCard(){
    let randomIndex = Math.floor(Math.random() *13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer){
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}
function blackjackDeal(){
    if (blackjackGame['turnsOver'] === true){
        blackjackGame['isStand'] = false;
// computeWinner();
    // showResult(computeWinner());
    // let winner = computeWinner();
    // showResult(winner);
    let yourImages = document.querySelector('#yourBox').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealerBox').querySelectorAll('img');

    for (i=0; i < yourImages.length; i++){
        yourImages[i].remove();
    }
    for (i=0; i < dealerImages.length; i++){
        dealerImages[i].remove();
    }

    YOU['score']=0;
    DEALER['score']=0;
    document.querySelector('#yourBlackjackResult').textContent=0;
    document.querySelector('#yourBlackjackResult').style.color='white';
    document.querySelector('#dealerBlackjackResult').textContent=0;
    document.querySelector('#dealerBlackjackResult').style.color='white';

    document.querySelector('#result').textContent = "Let's Play";
    document.querySelector('#result').style.color = "black";
    blackjackGame['turnsOver']=true;
    }
}
function updateScore(card, activePlayer){
    if(card === 'A'){
    // if adding 11 keeps me below 21, add 11. Otherwise, add 1
if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
activePlayer['score'] += blackjackGame['cardsMap'][card][1];
} else {
activePlayer['score'] += blackjackGame['cardsMap'][card][0];
}
    } else {

activePlayer['score']+= blackjackGame['cardsMap'][card];
}
}
function showScore(activePlayer){
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic(){
    blackjackGame['isStand'] = true;

    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true){
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    // if (DEALER['score'] > 15){
        blackjackGame['turnsOver'] = true;
        let winner = computeWinner();
    showResult(winner);
    // console.log(blackjackGame['turnsOver']);
    // }
}

// compute winner and return who just won
// update the wins, draws and losses
function computeWinner(){
    let winner;

    if (YOU['score'] <=21) {
        // condition when higher score than dealer or dealer busts and you're under 21
        if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)){
            // console.log('You won!');
            blackjackGame['wins']++;
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        }
        // condition when user busts but dealer doesn't
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;
        // condition when user and dealer both bust
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }
    console.log(blackjackGame);
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true){
        if(winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost';
            messageColor = 'red';
            lossSound.play();
        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You drew.';
            messageColor = 'black';
        }
    
        document.querySelector('#result').textContent = message;
        document.querySelector('#result').style.color = messageColor;
    }
}