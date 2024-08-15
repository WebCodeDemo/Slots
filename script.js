// Constants
const SPIN_COST = 8;
const INITIAL_MONEY = 100;
const ICONS = [1, 2, 3, 4, 5, 6, 7];
const PAYOUT = {
    FIVE_OF_A_KIND: 45,
    FOUR_OF_A_KIND: 25,
    THREE_OF_A_KIND: 0
};

// Jackpot Constants
const INITIAL_MAJOR_JACKPOT = 138653;
const INITIAL_MINOR_JACKPOT = 10000;
const MAJOR_JACKPOT_INCREMENT = 920;
const MINOR_JACKPOT_INCREMENT = 8;
const MICRO_JACKPOT = 2500;
const NON_JACKPOT = 500;

const encouragingMessages = [
    "I sense greatness in your future. Now is the time to take the risk you've been sitting on.",
    "Fortune favors the bold. Keep going for it!",
    "The Major Jackpot is so close, I can feel it",
    "With every spin you are closer to the Major Jackpot. Can you feel it?",
    "The universe is sending you a message: big wins are coming!",
    "Holy shit! Your next spin could be life-changing!",
    "Lady Luck is smiling upon you. You are a winner!",
    "I can smell the Major Jackpot just around the corner!",
    "You have a lucky streak. Take advantage of it.",
    "You feel it in your gut to keep spinning!",
    "The momentum is building. It's all coming together.",
    "You must be a professional. You make it look easy!",
    "The game is now becoming thrilling. Let it guide you to victory!",
    "You are so close to your dreams coming true!",
    "Blow on the dice, take another spin!",
    "The casino is the stage and you are the main charter!",
    "You have so much money! Tell me you want to be a philanthropist.",
    "You have the luck of a billion fortune cookies",
    "You're turning heads with your winning streak. What's your secret?",
    "Friendship is the secret to incredibly wins. Harness that power!",
    "Luck is what happens when preparation meets opportunity. Keep spinning for greater prizes!",
    "Your winning strategy is paying off. Stick to your instincts!",
    "Amazing! You are dancing to the tune of luck!",
    "Every win is a high five from the universe. Keep those hands up!",
    "You're on a roll! Let the momentum take you further!",
    "The casino is your playground, and you feel like a little kid!",
    "Fortune is knocking at your door. Want to spin again?",
    "Your positive vibes are creating a winning atmosphere. Breathe it in!",
    "The road to riches is paved with small wins. Keep collecting!",
    "I've never seen so much luck! You're crazy skilled at this!",
    "I have a really, REALLY good feeling about the next spin!",
    "You are a fucking legend, all you do is win, win, win.",
    "Game recognizes game, and you're playing at 200 IQ+ levels!",
    "I can feel your aura glowing bright. More wins are coming soon",
    "WTF? How is this possible?! You are completely defying the odds! How are you doing that?",
    "This win is a brick in your house of retirement.",
];

function getRandomEncouragingMessage() {
    const randomIndex = Math.floor(Math.random() * encouragingMessages.length);
    return encouragingMessages[randomIndex];
}

// Game state
let playerMoney = INITIAL_MONEY;
let majorJackpot = INITIAL_MAJOR_JACKPOT;
let minorJackpot = INITIAL_MINOR_JACKPOT;

// DOM Elements
const reels = Array.from(document.querySelectorAll('.reel img'));
const spinButton = document.getElementById('spin-button');
const playerMoneyDisplay = document.getElementById('player-money');
const majorJackpotDisplay = document.getElementById('major-jackpot-amount');
const minorJackpotDisplay = document.getElementById('minor-jackpot-amount');

function getRandomPayout(basePayout) {
    const randomOffset = Math.floor(Math.random() * 31) - 15; // Random number between -15 and 15
    return basePayout + randomOffset;
}

// Helper functions
function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updatePlayerMoneyDisplay() {
    playerMoneyDisplay.textContent = `Your Cash: $${playerMoney}`;
}

function updateJackpotDisplays() {
    const majorJackpotElement = document.getElementById('major-jackpot-amount');
    const minorJackpotElement = document.getElementById('minor-jackpot-amount');
    
    majorJackpotElement.textContent = `$${majorJackpot.toLocaleString()}`;
    minorJackpotElement.textContent = minorJackpot.toLocaleString();
    
    // Add animation class
    majorJackpotElement.classList.add('jackpot-updated');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        majorJackpotElement.classList.remove('jackpot-updated');
    }, 500);
}

function startWinAnimation() {
    document.querySelector('.game-container').classList.add('winning');
    document.querySelector('.jackpot-panel').classList.add('winning');
    document.querySelector('.slot-machine-panel').classList.add('winning');
    document.querySelector('.bottom-panel').classList.add('winning');
}

function stopWinAnimation() {
    document.querySelector('.game-container').classList.remove('winning');
    document.querySelector('.jackpot-panel').classList.remove('winning');
    document.querySelector('.slot-machine-panel').classList.remove('winning');
    document.querySelector('.bottom-panel').classList.remove('winning');
}

function spin() {
    

    playerMoney -= SPIN_COST;
    updatePlayerMoneyDisplay();

    // Increase jackpots
    majorJackpot += MAJOR_JACKPOT_INCREMENT;
    minorJackpot += MINOR_JACKPOT_INCREMENT;
    updateJackpotDisplays();

    const randomNumber = Math.random();
    let outcome, payout;

    if (randomNumber < 0.05) { // 5% chance for 5 of a kind
    outcome = Array(5).fill(getRandomIcon());
    payout = getRandomPayout(PAYOUT.FIVE_OF_A_KIND);
	} else if (randomNumber < 0.10) { // 5% chance for 4 of a kind
    const mainIcon = getRandomIcon();
    outcome = Array(4).fill(mainIcon);
    outcome.push(getRandomIcon());
    outcome = shuffleArray(outcome);
    payout = getRandomPayout(PAYOUT.FOUR_OF_A_KIND);
    } else { // 90% chance for 3 of a kind or less
        const mainIcon = getRandomIcon();
        outcome = Array(3).fill(mainIcon);
        while (outcome.length < 5) {
            let newIcon = getRandomIcon();
            if (newIcon !== mainIcon) {
                outcome.push(newIcon);
            }
        }
        outcome = shuffleArray(outcome);
        payout = PAYOUT.THREE_OF_A_KIND;
    }

    // Update reels
    reels.forEach((reel, index) => {
        reel.src = `images/${outcome[index]}.jpg`;
    });

    // Update player money
    playerMoney += payout;
    updatePlayerMoneyDisplay();

    if (payout > 0) {
        startWinAnimation();
        setTimeout(() => {
            stopWinAnimation();
            const encouragingMessage = getRandomEncouragingMessage();
			alert(`Congratulations! You won $${payout}!\n\n${encouragingMessage}`);
        }, 3000);
    }
}

// Event listeners
spinButton.addEventListener('click', spin);

// Initialize
updatePlayerMoneyDisplay();
updateJackpotDisplays();