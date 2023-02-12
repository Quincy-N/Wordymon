import { opponents } from "./opponents.js";

const rules = [
    {
        text: 'You can play by clicking or using the keyboard controls below.<br>Alphabet keys: choose letter<br>Enter: attack with word<br>Space: switch letter<br>Backspace/Delete: remove last letter<br>Period: pause game',
        image: ''
    },
    {
        text: "Choose letters from the letter bank to create a word in the empty squares below the letter bank. Click a letter in your word to remove it. The number in the corner of a letter is for the points you'll earn by using it.",
        image: './resources/images/letter-bank.PNG'
    },
    {
        text: "The health bar on the left is for your wordymon's health. When the health bar is empty, the game is over. The health bar for the opponent is on the right under the score. When the opponent's health bar is empty, the opponent is defeated.",
        image: './resources/images/game-health-score.PNG'
    },
    {
        text: 'The time bar shows how much time you have left to attack with your word. If time runs out, your opponent will attack and you will lose health. Getting hit twice in a row will reset the letter bank.',
        image: './resources/images/timebar.PNG'
    },
    {
        text: "You can restore some of your wordymon's health by using letters that have a green heart on them.",
        image: './resources/images/health-letter.PNG'
    },
    {
        text: "Click the attack button or press the Enter key to attack with the word you made. The points you'll earn from the word are shown under that button. If the word is not accepted, the letters will return to the word bank. The switch letter button is for replacing one letter with a new random one.",
        image: './resources/images/game-buttons.PNG'
    },
    {
        text: "A letter can be switched once during each battle with an opponent. Switching a letter will subtract the points on the letter from your score.",
        image: './resources/images/letter-switching.PNG'
    },
    {
        text: "Click the pause button or press the period key to pause the game. Pausing will reset your progress in the current battle.",
        image: './resources/images/pause-game.PNG'
    }
]

const player = {
    name: 'player',
    images: {
        idle: [
            './resources/images/player-1.svg', './resources/images/player-2.svg',
            './resources/images/player-3.svg', './resources/images/player-4.svg'
        ],
        throw: [
            './resources/images/player-throw-1.svg', './resources/images/player-throw-2.svg',
            './resources/images/player-throw-3.svg', './resources/images/player-throw-4.svg'
        ]
    },
    currentImage: '',
    previousImage: '',
}

const opponent = {
    name: '',
    images: [],
    currentImage: '',
    previousImage: '',
    timing: 0,
    damage: 0
}

const playerEffect = {
    name: '',
    images: [],
    currentImage: '',
    previousImage: '',
    timing: 0
}

const opponentEffect = {
    name: '',
    images: [],
    currentImage: '',
    previousImage: '',
    timing: 0
}

const effects = [
    {
        name: 'smoke hit',
        images: [
            './resources/images/smoke-explosion-1.svg', './resources/images/smoke-explosion-2.svg',
        ],
        timing: 90
    },
    {
        name: 'smoke explosion',
        images: [
            './resources/images/smoke-explosion-1.svg', './resources/images/smoke-explosion-2.svg',
            './resources/images/smoke-explosion-3.svg', './resources/images/smoke-explosion-4.svg',
            './resources/images/smoke-explosion-5.svg', './resources/images/smoke-explosion-6.svg',
            './resources/images/smoke-explosion-7.svg', './resources/images/smoke-explosion-8.svg',
            './resources/images/smoke-explosion-9.svg', './resources/images/smoke-explosion-10.svg'
        ],
        timing: 100
    }
];

const normalLetters = [
    {character: 'B', points: 3}, {character: 'C', points: 3}, {character: 'D', points: 2},
    {character: 'F', points: 4}, {character: 'G', points: 2}, {character: 'H', points: 4}, 
    {character: 'K', points: 5}, {character: 'L', points: 1}, {character: 'M', points: 3},
    {character: 'N', points: 1}, {character: 'P', points: 3}, {character: 'R', points: 1},
    {character: 'S', points: 1}, {character: 'T', points: 1}, {character: 'V', points: 4},
    {character: 'W', points: 4}, {character: 'Y', points: 4}
];

const hardLetters = [
    {character: 'J', points: 8}, {character: 'Q', points: 10}, {character: 'X', points: 8},
    {character: 'Z', points: 10}
]
const vowels = [
    {character: 'A', points: 1}, {character: 'E', points: 1}, {character: 'I', points: 1},
    {character: 'O', points: 1}, {character: 'U', points: 1}
];
const gameWindow = document.getElementById('game-window');
const soundPrompt = document.getElementById('sound-prompt');
const yesButton = document.getElementById('yes');
const noButton = document.getElementById('no');
let soundOn;
const soundButton = document.getElementById('sound-button');
const gameHandler = document.getElementById('game-handler');
const gameHeading = document.getElementById('game-heading');
let titleEffect;
const gameInfo = document.getElementById('game-info');
const gameInfoGraphic = document.getElementById('game-info-graphic');
const playButton = document.getElementById('play-button');
let gameNumber = 0;
const middleButton = document.getElementById('middle-button');
const rightButton = document.getElementById('right-button');
let rulesPage = 0;
const pauseButton = document.getElementById('pause-button');
player.element = document.getElementById('player');
const playerHealthLevel = document.getElementById('player-health-value');
playerEffect.element = document.getElementById('player-effect');
const opponentContainer = document.getElementById('opponent-container');
opponent.element = document.getElementById('opponent');
const opponentHealthbar = document.getElementById('opponent-healthbar');
const opponentHealthLevel = document.getElementById('opponent-health-value');
const timebar = document.getElementById('opponent-timebar');
const timerLevel = document.getElementById('opponent-time-value');
opponent.x = opponent.element.getBoundingClientRect().x + (opponent.element.getBoundingClientRect().width / 2);
opponent.y = opponent.element.getBoundingClientRect().y + (opponent.element.getBoundingClientRect().height / 2);
let opponentName = document.getElementById('opponent-name');
opponentEffect.element = document.getElementById('opponent-effect');
const message = document.getElementById('message'); //spot above letter bank for communicating with player
const wordContainer = document.getElementById('word-container');
const letterSpots = wordContainer.children;
const letterBank = document.getElementById('letter-bank');
const letterBankLetters = letterBank.children;
const submitButton = document.getElementById('submit'); //button for attacking
const wordPoints = document.getElementById('word-points');
let containerPoints = 0; //points showing the value of the word being built
const gameScore = document.getElementById('game-score');
let totalPoints = 0;
const letterSwitcher = document.getElementById('switch-letter');
let letterSwitched = false;
let letterIsSwitching = false;
let timerStop; //variable for the timeout called after the timer ends
let timeLeft;
let timeInterval; //variable for the timer
let playerHit = 0;
let opponentsDefeated = 0;
let addHealth;
let canPlay = false;
let canSwitch = false;
let gamePaused = false;
let vowelSet = false;
const opening = new Howl({
    src: ['./resources/sounds/opening.webm', './resources/sounds/opening.mp3'],
    loop: true,
});
const backgroundMusic = new Howl({
    src: ['./resources/sounds/background-music.webm', './resources/sounds/background-music.mp3'],
    loop: true,
});
const gameOverMusic = new Howl({
    src: ['./resources/sounds/game-over.webm', './resources/sounds/game-over.mp3'],
    loop: true,
});
const blockSound = new Howl({
    src: ['./resources/sounds/block.webm', './resources/sounds/block.mp3'],
    html5: true
});
const blockReverseSound = new Howl({
    src: ['./resources/sounds/block-reverse.webm', './resources/sounds/block-reverse.mp3'],
    html5: true
});
const whooshSound = new Howl({
    src: ['./resources/sounds/whoosh.webm', './resources/sounds/whoosh.mp3'],
    html5: true
});
const hitSound = new Howl({
    src: ['./resources/sounds/hit.webm', './resources/sounds/hit.mp3'],
});
const explosionSound = new Howl({
    src: ['./resources/sounds/explosion.webm', './resources/sounds/explosion.mp3'],
    html5: true
});
const errorSound = new Howl({
    src: ['./resources/sounds/error.webm', './resources/sounds/error.mp3'],
});
//Fix for mobile screen height
// Calculate 1vh value in pixels based on window inner height
let vh = window.innerHeight * 0.01;
let scaleAmount = 1;
// Set the CSS variable to the root element which is equal to 1vh
document.documentElement.style.setProperty('--vh', vh + 'px');
function calculateVh() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}
// Initial calculation
calculateVh();
// Re-calculate on device orientation change
window.addEventListener('orientationchange', () => {
    calculateVh();
    opponent.x = opponent.element.getBoundingClientRect().x + (opponent.element.getBoundingClientRect().width / 2);
    opponent.y = opponent.element.getBoundingClientRect().y + (opponent.element.getBoundingClientRect().height / 2);
});

document.addEventListener('DOMContentLoaded', () => {
    soundPrompt.showModal();
    if (window.innerHeight > window.innerWidth) {
        gameWindow.style.width = '100vw';
        gameWindow.style.height = `100vw`;
        scaleAmount = 1;
    } else {
        if (window.innerWidth > window.innerHeight*(850/659)) {
            scaleAmount = ((window.innerHeight*(850/659)) / window.innerWidth);
            if (scaleAmount < .8 && window.innerHeight > 500) {
                scaleAmount = .8;
            }
            console.log(scaleAmount);
            gameWindow.style.transform = `scale(${scaleAmount})`;
            gameWindow.style.height = `calc((var(--vh) * 100) / ${scaleAmount})`;
            gameWindow.style.maxWidth = `calc(((850/659) * 100 * var(--vh)) / ${scaleAmount})`;
        } else {
            gameWindow.style.height = 'calc(var(--vh) * 100)';
            gameWindow.style.maxWidth = 'calc((850/659) * 100 * var(--vh))';
            scaleAmount = 1;
        }
    }
});
// Handle when user is not on site, but site is running
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
    } else if (canPlay === true) {
        canPlay = false;
        gamePaused = true;
        clearInterval(timeInterval);
        clearTimeout(timerStop);
        gameHeading.innerHTML = 'Game paused';
        gameHeading.style.opacity = 1;
        playButton.style.width = 'min(16vw, calc(.16 * var(--max-win-width)))';
        playButton.innerHTML = 'Play';
        gameHandler.showModal();
    }
});
// Handle when user resizes window
window.addEventListener('resize', () => {
    console.log('w:',window.innerWidth,' h:', window.innerHeight);
    calculateVh();
    gameWindow.removeAttribute('style');
    if (window.innerHeight > window.innerWidth) {
        gameWindow.style.width = '100vw';
        gameWindow.style.height = `100vw`;
        scaleAmount = 1;
    } else {
        if (window.innerWidth > window.innerHeight*(850/659)) {
            scaleAmount = ((window.innerHeight*(850/659)) / window.innerWidth);
            if (scaleAmount < .8 && window.innerHeight > 500) {
                scaleAmount = .8;
            }
            console.log(scaleAmount);
            gameWindow.style.transform = `scale(${scaleAmount})`;
            gameWindow.style.height = `calc((var(--vh) * 100) / ${scaleAmount})`;
            gameWindow.style.maxWidth = `calc(((850/659) * 100 * var(--vh)) / ${scaleAmount})`;
        } else {
            gameWindow.style.height = 'calc(var(--vh) * 100)';
            gameWindow.style.maxWidth = 'calc((850/659) * 100 * var(--vh))';
            scaleAmount = 1;
        }
    }
    opponent.x = opponent.element.getBoundingClientRect().x + (opponent.element.getBoundingClientRect().width / 2);
    opponent.y = opponent.element.getBoundingClientRect().y + (opponent.element.getBoundingClientRect().height / 2);
});
// Prevent enter and space keys from interfering with gameplay
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && canPlay === true) {
        e.preventDefault();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && canPlay === true) {
        e.preventDefault();
    }
});
// Handle game start and resuming from pause or game over
gameHandler.addEventListener('close', () => {
    middleButton.innerHTML = 'Rules';
    rightButton.style.display = 'none';
    gameInfo.style.display = 'none';
    gameInfoGraphic.style.display = 'none';
    gameHeading.style.display = 'block';
    rulesPage = 0;
    canPlay = true;
    canSwitch = true;
    clearInterval(titleEffect);
    if (gamePaused === true) {
        opponentHealthLevel.removeAttribute('style');
        opponentHealthLevel.setAttribute('value', 100);
        timerLevel.setAttribute('value', 100);
        timerLevel.removeAttribute('style');
        timerLevel.style.width = '100%';
        submitButton.focus();
        setTimer();
        gamePaused = false;
    } else {
        opening.stop();
        gameOverMusic.stop();
        backgroundMusic.play();
        resetLetters();
        if (gameNumber > 0) {
            setMotion(player, player.images.idle, 200, true, false);
            opponentHealthLevel.removeAttribute('style');
            opponentHealthLevel.setAttribute('value', 100);
            playerHealthLevel.removeAttribute('style');
            playerHealthLevel.setAttribute('value', 100);
            timerLevel.setAttribute('value', 100);
            timerLevel.style.width = '100%';
            timerLevel.style.backgroundColor = 'rgb(85, 173, 241)';
            letterSwitcher.style.backgroundColor = 'rgb(72, 199, 99)';
            letterSwitcher.style.cursor = 'pointer';
            letterSwitcher.setAttribute('active', true);
            letterSwitched = false;
            letterIsSwitching = false;
            submitButton.removeAttribute('style');
            submitButton.setAttribute('active', true);
            letterSwitcher.innerHTML = 'Switch letter';
            letterSwitcher.removeAttribute('style');
            setTimeout(() => {
                setTimer();
            }, 500);
            opponentDefeat();
            opponentsDefeated = 0;
            totalPoints = 0;
            playerHit = 0;
            gameScore.innerHTML = `SCORE: ${totalPoints}`;
            wordPoints.innerHTML = `${containerPoints}<span> pts</span>`;
        } else {
            setOpponent();
            setMotion(opponent, opponent.images, opponent.timing, true, false);
            setTimer();
        }
    }
});
// Game buttons
yesButton.addEventListener('click', () => {
    soundOn = true;
    Howler.mute(false);
    soundButton.setAttribute('on', true);
    soundPrompt.close();
    setMotion(player, player.images.idle, 200, true, false);
    gameHandler.showModal();
    blockSound.play();
    setTimeout(() => {
        opening.play();
    }, 200);
    titleEffect = setInterval(() => {
        if (gameHeading.style.opacity == 0) {
            gameHeading.style.opacity = 1;
        } else {
            gameHeading.style.opacity = 0;
        }
    }, 750);
});

noButton.addEventListener('click', () => {
    soundOn = false;
    soundButton.setAttribute('on', false);
    soundPrompt.close();
    setMotion(player, player.images.idle, 200, true, false);
    gameHandler.showModal();
    Howler.mute(true);
    titleEffect = setInterval(() => {
        if (gameHeading.style.opacity == 0) {
            gameHeading.style.opacity = 1;
        } else {
            gameHeading.style.opacity = 0;
        }
    }, 750);
});

playButton.addEventListener('click', () => {
    if (soundOn === true) {
        blockSound.play();
    }
    gameHandler.close();
});

middleButton.addEventListener('click', () => {
    if (soundOn === true) {
        blockSound.play();
    }
    switch (rulesPage) {
        case 0:
            middleButton.innerHTML = 'Back';
            rightButton.style.display = 'block';
            gameHeading.style.display = 'none';
            gameInfo.innerHTML = rules[0].text;
            gameInfo.style.textAlign = 'left';
            gameInfo.style.display = 'block';
            gameInfoGraphic.style.display = 'block';
            rulesPage = 1;
            break;
        case 1:
            middleButton.innerHTML = 'Rules';
            rightButton.style.display = 'none';
            if (gameHeading.innerHTML === 'Game Over') {
                if (opponentsDefeated === 1) {
                    gameInfo.innerHTML = `Nice work! You defeated ${opponentsDefeated} monster and earned ${totalPoints} points!`;
                } else {
                    gameInfo.innerHTML = `Nice work! You defeated ${opponentsDefeated} monsters and earned ${totalPoints} points!`;
                }
            } else {
                gameInfo.style.display = 'none';
            }
            gameInfoGraphic.style.display = 'none';
            gameHeading.style.display = 'block';
            rulesPage = 0;
            break;
        case 2:
            gameInfo.innerHTML = rules[0].text;
            gameInfoGraphic.style.display = 'none';
            gameInfoGraphic.setAttribute('src', rules[0].image);
            rulesPage = 1;
            break;
        case 3:
            gameInfo.innerHTML = rules[1].text;
            gameInfoGraphic.setAttribute('src', rules[1].image);
            rulesPage = 2;
            break;
        case 4:
            gameInfo.innerHTML = rules[2].text;
            gameInfoGraphic.setAttribute('src', rules[2].image);
            rulesPage = 3;
            break;
        case 5:
            gameInfo.innerHTML = rules[3].text;
            gameInfoGraphic.setAttribute('src', rules[3].image);
            rulesPage = 4;
            break;
        case 6:
            gameInfo.innerHTML = rules[4].text;
            gameInfoGraphic.setAttribute('src', rules[4].image);
            rulesPage = 5;
            break;
        case 7:
            gameInfo.innerHTML = rules[5].text;
            gameInfoGraphic.setAttribute('src', rules[5].image);
            rulesPage = 6;
            break;
        case 8:
            gameInfo.innerHTML = rules[6].text;
            gameInfoGraphic.setAttribute('src', rules[6].image);
            rightButton.style.display = 'block';
            rulesPage = 7;
            break;
    }
});

rightButton.addEventListener('click', () => {
    if (soundOn === true) {
        blockSound.play();
    }
    switch (rulesPage) {
        case 1:
            gameInfo.innerHTML = rules[1].text;
            gameInfoGraphic.setAttribute('src', rules[1].image);
            rulesPage = 2;
            break;
        case 2:
            gameInfo.innerHTML = rules[2].text;
            gameInfoGraphic.setAttribute('src', rules[2].image);
            rulesPage = 3;
            break;
        case 3:
            gameInfo.innerHTML = rules[3].text;
            gameInfoGraphic.setAttribute('src', rules[3].image);
            rulesPage = 4;
            break;
        case 4:
            gameInfo.innerHTML = rules[4].text;
            gameInfoGraphic.setAttribute('src', rules[4].image);
            rulesPage = 5;
            break;
        case 5:
            gameInfo.innerHTML = rules[5].text;
            gameInfoGraphic.setAttribute('src', rules[5].image);
            rulesPage = 6;
            break;
        case 6:
            gameInfo.innerHTML = rules[6].text;
            gameInfoGraphic.setAttribute('src', rules[6].image);
            rulesPage = 7;
            break;
        case 7:
            gameInfo.innerHTML = rules[7].text;
            gameInfoGraphic.setAttribute('src', rules[7].image);
            rightButton.style.display = 'none';
            rulesPage = 8;
            break;
    }
});

pauseButton.addEventListener('click', () => {
    canPlay = false;
    gamePaused = true;
    clearInterval(timeInterval);
    clearTimeout(timerStop);
    gameHeading.innerHTML = 'Game paused';
    gameHeading.style.opacity = 1;
    playButton.style.width = 'min(16vw, calc(.16 * var(--max-win-width)))';
    playButton.innerHTML = 'Play';
    gameHandler.showModal();
});

soundButton.addEventListener('click', () => {
    if (soundOn === true) {
        Howler.mute(true);
        soundOn = false;
        soundButton.setAttribute('on', false);
    } else {
        soundOn = true;
        Howler.mute(false);
        soundButton.setAttribute('on', true);
    }
})

submitButton.addEventListener('click', () => {
    if (letterIsSwitching === false) {
        attackWithWord();
    }
});

letterSwitcher.addEventListener('click', () => {
    if (letterIsSwitching === true) {
        letterSwitcher.innerHTML = 'Switch letter';
        letterSwitcher.style.backgroundColor = 'rgb(72, 199, 99)';
        message.innerHTML = '';
        submitButton.removeAttribute('style');
        submitButton.setAttribute('active', true);
        letterIsSwitching = false;
        for (let letter of letterBankLetters) {
            if (letter.style.visibility != 'hidden') {
                let points = letter.getElementsByTagName('span')[0];
                points.innerHTML = letter.getAttribute('points');
            }
        }
        submitButton.focus();
    } else if (letterSwitched === false && canSwitch === true) {
        letterIsSwitching = true;
        letterSwitcher.innerHTML = 'Cancel';
        letterSwitcher.style.backgroundColor = 'rgb(199, 78, 72)';
        submitButton.style.backgroundColor = 'rgb(113, 113, 113)';
        submitButton.style.cursor = 'default';
        submitButton.setAttribute('active', false);
        message.innerHTML = 'Choose letter to switch';
        for (let letter of letterBankLetters) {
            if (letter.style.visibility != 'hidden') {
                let points = letter.getElementsByTagName('span')[0];
                points.innerHTML = '-' + points.innerHTML;
            }
        }
        submitButton.focus();
    }
});
// Handle when user clicks letters
for (let letter of letterBankLetters) {
    letter.addEventListener('click', () => {
        if (canPlay === true) {
            if (soundOn === true) {
                blockSound.play();
            }
            if (letterIsSwitching === true) {
                if (totalPoints - letter.getAttribute('points') >= 0) {
                    totalPoints -= letter.getAttribute('points');
                    gameScore.innerHTML = `SCORE: ${totalPoints}`;
                    newLetter(letter);
                    letterSwitcher.innerHTML = 'Switch letter';
                    letterSwitcher.style.backgroundColor = 'rgb(113, 113, 113)';
                    letterSwitcher.style.cursor = 'default';
                    letterSwitcher.setAttribute('active', false);
                    message.innerHTML = '';
                    submitButton.removeAttribute('style');
                    submitButton.setAttribute('active', true);
                    letterIsSwitching = false;
                    letterSwitched = true;
                    for (let letter of letterBankLetters) {
                        if (letter.style.visibility != 'hidden') {
                            let points = letter.getElementsByTagName('span')[0];
                            points.innerHTML = letter.getAttribute('points');
                        }
                    }
                } else {
                    errorSound.play();
                    letter.style.border = 'solid rgb(134, 47, 47) min(.5vw, calc(.005 * var(--max-win-width)))'
                    setTimeout(() => {
                        letter.removeAttribute('style');
                    }, 500);
                }
            } else {
                let targetSpot = document.querySelector("div#word-container div[filled='false']");
                targetSpot.innerHTML = letter.innerHTML;
                targetSpot.setAttribute('character', letter.getAttribute('character'));
                targetSpot.setAttribute('points', letter.getAttribute('points'));
                targetSpot.setAttribute('filled', true);
                targetSpot.setAttribute('heart', letter.getAttribute('heart'));
                letter.style.visibility = 'hidden';
                containerPoints += Number(targetSpot.getAttribute('points'));
                wordPoints.innerHTML = `${containerPoints}<span> pts</span>`;
            }
        }
    });
}

for (let element of letterSpots) {
    element.addEventListener('click', () => {
        element.removeAttribute('style');
        if (soundOn === true) {
            blockReverseSound.play();
        }
        element.setAttribute('filled', false);
        containerPoints -= Number(element.getAttribute('points'));
        wordPoints.innerHTML = `${containerPoints}<span> pts</span>`;
        for (let letter of letterBankLetters) {
            if (element.innerHTML == letter.innerHTML && letter.style.visibility == 'hidden') {
                letter.removeAttribute('style');
                element.innerHTML = '';
                break;
            }
        }
    });
}
// Handle user playing with keyboard controls
document.addEventListener('keyup', (e) => {
    if (canPlay === true) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            let filledSpots = document.querySelectorAll("div#word-container div[filled='true']");
            if (filledSpots.length != 0) {
                let targetSpot = filledSpots[filledSpots.length - 1];
                targetSpot.removeAttribute('style');
                targetSpot.setAttribute('filled', false);
                if (soundOn === true) {
                    blockReverseSound.play();
                }
                containerPoints -= Number(targetSpot.getAttribute('points'));
                wordPoints.innerHTML = `${containerPoints}<span> pts</span>`;
                for (let letter of letterBankLetters) {
                    if (targetSpot.innerHTML == letter.innerHTML && letter.style.visibility == 'hidden') {
                        if (letterIsSwitching === true) {
                            let points = letter.getElementsByTagName('span')[0];
                            points.innerHTML = '-' + points.innerHTML;
                        }
                        letter.removeAttribute('style');
                        targetSpot.innerHTML = '';
                        break;
                    }
                }
            }
        } else if (e.key === 'Enter') {
            if (letterIsSwitching === false) {
                canPlay = false;
                canSwitch = false;
                attackWithWord();
            }
        } else if (e.key === ' ') {
            if (letterIsSwitching === true) {
                letterSwitcher.innerHTML = 'Switch letter';
                letterSwitcher.style.backgroundColor = 'rgb(72, 199, 99)';
                message.innerHTML = '';
                submitButton.removeAttribute('style');
                submitButton.setAttribute('active', true);
                letterIsSwitching = false;
                for (let letter of letterBankLetters) {
                    if (letter.style.visibility != 'hidden') {
                        let points = letter.getElementsByTagName('span')[0];
                        points.innerHTML = letter.getAttribute('points');
                    }
                }
                submitButton.focus();
            } else if (letterSwitched === false && canSwitch === true) {
                letterIsSwitching = true;
                letterSwitcher.innerHTML = 'Cancel';
                letterSwitcher.style.backgroundColor = 'rgb(199, 78, 72)';
                submitButton.style.backgroundColor = 'rgb(113, 113, 113)';
                submitButton.style.cursor = 'default';
                submitButton.setAttribute('active', false);
                message.innerHTML = 'Choose letter to switch';
                for (let letter of letterBankLetters) {
                    if (letter.style.visibility != 'hidden') {
                        let points = letter.getElementsByTagName('span')[0];
                        points.innerHTML = '-' + points.innerHTML;
                    }
                }
                submitButton.focus();
            }
        } else if (e.key === '.') {
            if (gamePaused === false) {
                canPlay = false;
                gamePaused = true;
                clearInterval(timeInterval);
                clearTimeout(timerStop);
                gameHeading.innerHTML = 'Game paused';
                gameHeading.style.opacity = 1;
                playButton.style.width = 'min(16vw, calc(.16 * var(--max-win-width)))';
                playButton.innerHTML = 'Play';
                gameHandler.showModal();
            }
        } else {
            for (let letter of letterBankLetters) {
                if (e.key.toUpperCase() === letter.getAttribute('character') && letter.style.visibility != 'hidden') {
                    if (soundOn === true) {
                        blockSound.play();
                    }
                    if (letterIsSwitching === true) {
                        if (totalPoints - letter.getAttribute('points') >= 0) {
                            totalPoints -= letter.getAttribute('points');
                            gameScore.innerHTML = `SCORE: ${totalPoints}`;
                            newLetter(letter);
                            letterSwitcher.innerHTML = 'Switch letter';
                            letterSwitcher.style.backgroundColor = 'rgb(113, 113, 113)';
                            letterSwitcher.style.cursor = 'default';
                            letterSwitcher.setAttribute('active', false);
                            message.innerHTML = '';
                            submitButton.removeAttribute('style');
                            submitButton.setAttribute('active', true);
                            letterIsSwitching = false;
                            letterSwitched = true;
                            for (let letter of letterBankLetters) {
                                if (letter.style.visibility != 'hidden') {
                                    let points = letter.getElementsByTagName('span')[0];
                                    points.innerHTML = letter.getAttribute('points');
                                }
                            }
                        } else {
                            errorSound.play();
                            letter.style.border = 'solid rgb(134, 47, 47) min(.5vw, calc(.005 * var(--max-win-width)))'
                            setTimeout(() => {
                                letter.removeAttribute('style');
                            }, 500);
                        }
                        break;
                    } else {
                        let targetSpot = document.querySelector("div#word-container div[filled='false']");
                        targetSpot.innerHTML = letter.innerHTML;
                        targetSpot.setAttribute('character', letter.getAttribute('character'));
                        targetSpot.setAttribute('points', letter.getAttribute('points'));
                        targetSpot.setAttribute('filled', true);
                        targetSpot.setAttribute('heart', letter.getAttribute('heart'));
                        letter.style.visibility = 'hidden';
                        containerPoints += Number(targetSpot.getAttribute('points'));
                        wordPoints.innerHTML = `${containerPoints}<span> pts</span>`;
                        break;
                    }
                }
            }
        }
    }
    
})

// Function to start movement of elements that are animated
function setMotion(object, images, timing, loop, hide) {
    object.element.setAttribute('src', images[0]);
    object.element.style.visibility = 'visible';
    let motionInterval = setInterval(() => {
        object.currentImage = object.element.getAttribute('src');
        let imagesLength = images.length;
        for (let i = 0; i < imagesLength; i++) {
            if (object.currentImage === images[0]) {
                object.element.setAttribute('src', images[1]);
                object.previousImage = images[0];
                break;
            } else if (object.currentImage === images[imagesLength - 1]) {
                object.element.setAttribute('src', images[imagesLength - 2]);
                object.previousImage = images[imagesLength - 1];
                break;
            } else if (object.currentImage === images[i]) {
                if (object.previousImage === images[i - 1]) {
                    object.element.setAttribute('src', images[i + 1]);
                    object.previousImage = images[i];
                    break;
                } else if (object.previousImage === images[i + 1]) {
                    object.element.setAttribute('src', images[i - 1]);
                    object.previousImage = images[i];
                    break;
                }
            }
        }
    }, timing);
    object.motionInterval = motionInterval;
    if (loop === false) {
        setTimeout(() => {
            clearInterval(object.motionInterval);
            if (hide === true) {
                object.element.style.visibility = 'hidden';
                object.element.setAttribute('src', images[0]);
            }
        }, timing * (images.length)-1);
    }
}
// Function to prepare the opponent for the user to battle
function setOpponent() {
    let oppIndex = Math.floor(Math.random() * opponents.length);
    opponent.name = opponents[oppIndex].name;
    opponentName.innerHTML = opponent.name;
    opponent.images = opponents[oppIndex].images;
    opponent.width = opponents[oppIndex].width;
    opponent.timing = opponents[oppIndex].timing;
    opponent.timeBar = opponents[oppIndex].timebar;
    opponent.damage = opponents[oppIndex].damage;
    opponent.element.setAttribute('src', opponent.images[0]);
    opponent.element.style.width = `min(${opponent.width}vw, calc(.${opponent.width} * var(--max-win-width)))`;
    opponent.x = opponent.element.getBoundingClientRect().x + (opponent.element.getBoundingClientRect().width / 2);
    opponent.y = opponent.element.getBoundingClientRect().y + (opponent.element.getBoundingClientRect().height / 2);
    opponent.element.style.visibility = 'visible';
    let windowOffset = (window.innerWidth - gameWindow.getBoundingClientRect().width) / 2;
    if (windowOffset < 0) {
        windowOffset = 0;
    }
    opponentContainer.style.transform = 'translateX(0px)';
    opponentHealthbar.style.width = `${opponents[oppIndex].healthbar}%`;
    opponentHealthLevel.style.width = '100%';
    opponentHealthLevel.setAttribute('value', 100);
    timebar.style.width = `${opponents[oppIndex].timebar}%`;
    timerLevel.setAttribute('value', 100);
    let nameStart = opponent.name.slice(0,1).toLowerCase();
    if (nameStart === 'a' || nameStart === 'e' || nameStart === 'i' || nameStart === 'o' || nameStart === 'u') {
        message.innerHTML = `An ${opponent.name.toLowerCase()} appeared!`;
    } else {
        message.innerHTML = `A ${opponent.name.toLowerCase()} appeared!`;
    }
    setTimeout(() => {
        opponent.x = opponent.element.getBoundingClientRect().x + (opponent.element.getBoundingClientRect().width / 2);
        opponent.y = opponent.element.getBoundingClientRect().y + (opponent.element.getBoundingClientRect().height / 2);
        if (message.innerHTML == `A ${opponent.name.toLowerCase()} appeared!` || message.innerHTML == `An ${opponent.name.toLowerCase()} appeared!`) {
            message.innerHTML = '';
        }
    }, 1510);
    canPlay = true;
    canSwitch = true;
}
// Function to choose effect to put on player or opponent
function setEffect(effectObject, effectName) {
    let effect = effects.find(effect => {
        if (effect.name === effectName) {
            return true;
        }
    });
    effectObject.name = effect.name;
    effectObject.images = effect.images;
    effectObject.timing = effect.timing;
    effectObject.element.setAttribute('src', effect.images[0]);
}
// Function to set timer for opponent's attack
function setTimer() {
    clearInterval(timeInterval);
    clearTimeout(timerStop);
    // set time based on a time bar with width of 40% being 20 seconds and convert to milliseconds
    let endTime = (20/40) * opponent.timeBar * 1000;
    timeLeft = endTime;
    let newLevel;
    // set amount of time bar to remove for each second. full length time bar divided by full time in seconds.
    let increment = 100 / (endTime / 1000);
    timerStop = setTimeout(() => {
        newLevel = 0;
        timerLevel.style.width = `${newLevel}%`;
        playerDamage();
    }, (endTime));
    timeInterval = setInterval(() => {
        newLevel = timerLevel.getAttribute('value') - increment;
        timeLeft = timeLeft - 1000;
        timerLevel.style.width = `${newLevel}%`;
        if(timeLeft <= 5000) {
            timerLevel.style.backgroundColor = 'rgb(199, 78, 72)';
        }
        timerLevel.setAttribute('value', newLevel);
    }, 1000);
}
// Function to handle user receiving damage in game
function playerDamage() {
    setEffect(playerEffect, 'smoke hit');
    setMotion(playerEffect, playerEffect.images, playerEffect.timing, false, true);
    if (soundOn === true) {
        hitSound.play();
    }
    playerHit++;
    let newHealthLevel = playerHealthLevel.getAttribute('value') - opponent.damage;
    if (newHealthLevel <= 0) {
        newHealthLevel = 0;
        canPlay = false;
        playerHealthLevel.style.width = `${newHealthLevel}%`;
        playerHealthLevel.setAttribute('value', newHealthLevel);
        clearInterval(timeInterval);
        clearInterval(player.motionInterval);
        opponentContainer.removeAttribute('style');
        clearInterval(opponent.motionInterval);
        gameHeading.innerHTML = 'Game Over';
        if (opponentsDefeated === 1) {
            gameInfo.innerHTML = `Nice work! You defeated ${opponentsDefeated} monster and earned ${totalPoints} points!`;
        } else {
            gameInfo.innerHTML = `Nice work! You defeated ${opponentsDefeated} monsters and earned ${totalPoints} points!`;
        }
        gameHeading.style.paddingBottom = '0px';
        gameHeading.style.opacity = 1;
        gameInfo.style.textAlign = 'center';
        gameInfo.style.display = 'block';
        playButton.style.width = 'min(32vw, calc(.32 * var(--max-win-width)))';
        playButton.innerHTML = 'Play again';
        gameNumber++;
        playButton.style.visibility = 'hidden';
        middleButton.style.visibility = 'hidden';
        setTimeout(() => {
            playButton.style.visibility = 'visible';
            middleButton.style.visibility = 'visible';
            opponent.element.removeAttribute('style');
        }, 1510);
        clearTimeout(timerStop);
        gameHandler.showModal();
        backgroundMusic.stop();
        if (soundOn === true) {
            gameOverMusic.play();
        }
    } else {
        clearInterval(timeInterval);
        playerHealthLevel.style.width = `${newHealthLevel}%`;
        playerHealthLevel.setAttribute('value', newHealthLevel);
        if (playerHit === 2) {
            resetLetters();
            playerHit = 0;
            containerPoints = 0;
            wordPoints.innerHTML = `${containerPoints}<span> pts</span>`;
        }
        timerLevel.setAttribute('value', 100);
        timerLevel.style.width = '100%';
        timerLevel.style.backgroundColor = 'rgb(85, 173, 241)';
        setTimeout(() => {
            setTimer();
        }, 100);
    }
}
// Function to handle opponent being defeated
function opponentDefeat() {
    for (let letter of letterBankLetters) {
        letter.style.visibility = 'hidden';
    }
    resetLetters();
    opponentsDefeated++;
    containerPoints = 0;
    message.innerHTML = '';
    opponent.element.removeAttribute('style');
    setTimeout(() => {
        setOpponent();
        setMotion(opponent, opponent.images, opponent.timing, true, false);
    }, 1510);
}
// Function to change a letter
function newLetter(element) {
    // add vowel bias
    let randomNum = Math.floor(Math.random() * 19);
    let character;
    let points;
    if (randomNum < 1) {
        let letterIndex = Math.floor(Math.random() * hardLetters.length);
        character = hardLetters[letterIndex].character;
        points = hardLetters[letterIndex].points;
    } else if (randomNum < 8) {
        let vowelIndex = Math.floor(Math.random() * vowels.length);
        character = vowels[vowelIndex].character;
        points = vowels[vowelIndex].points;
    } else {
        let letterIndex = Math.floor(Math.random() * normalLetters.length);
        character = normalLetters[letterIndex].character;
        points = normalLetters[letterIndex].points;
    }
    element.innerHTML = `${character}<span>${points}</span>`;
    element.setAttribute('character', character);
    element.setAttribute('points', points);
    element.setAttribute('heart', false);
    let randomNum2 = Math.floor(Math.random() * 29);
    if (randomNum2 < 2) {
        let heart = document.createElement('img');
        heart.setAttribute('src', './resources/images/heart.svg');
        element.appendChild(heart);
        element.setAttribute('heart', true)
    }
}
// Function to move letters to attack opponent
function attackMotion(attackElement, objectToAttack) {
    // get object coordinates and move element to those coordinates
    objectToAttack.x = objectToAttack.element.getBoundingClientRect().x + (objectToAttack.element.getBoundingClientRect().width / 2);
    objectToAttack.y = objectToAttack.element.getBoundingClientRect().y + (objectToAttack.element.getBoundingClientRect().height / 2);
    let distanceX = objectToAttack.x - (attackElement.getBoundingClientRect().x + (attackElement.getBoundingClientRect().width / 2));
    let distanceY = objectToAttack.y - (attackElement.getBoundingClientRect().y + (attackElement.getBoundingClientRect().height / 2));
    attackElement.style.transform = `translate(${distanceX / scaleAmount}px, ${distanceY / scaleAmount}px)`;
}
// Function to carry out the attack using the word the user created
async function attackWithWord() {
    submitButton.style.backgroundColor = 'rgb(113, 113, 113)';
    submitButton.style.cursor = 'default';
    letterSwitcher.style.backgroundColor = 'rgb(113, 113, 113)';
    letterSwitcher.style.cursor = 'default';
    submitButton.setAttribute('active', false);
    letterSwitcher.setAttribute('active', false);
    let filledSpots = document.querySelectorAll("div#word-container div[filled='true']");
    addHealth = 0;
    let word = '';
    for (let spot of filledSpots) {
        word = word + spot.getAttribute('character').toLowerCase();
        if (spot.getAttribute('heart') === 'true') {
            addHealth = addHealth + 1;
        }
    }
    let firstLetter = word.slice(0,1);
    let lengthCode = `l${word.length}`;
    // Handle empty word being submitted
    if (word === '') {
        for (let spot of letterSpots) {
            spot.style.border = 'dashed red .2rem';
            if (soundOn === true) {
                errorSound.play();
            }
            submitButton.removeAttribute('style');
            submitButton.setAttribute('active', true);
            if (letterSwitched === false) {
                letterSwitcher.removeAttribute('style');
                letterSwitcher.setAttribute('active', true);
            }
            canPlay = true;
            canSwitch = true;
            setTimeout(() => {
                spot.removeAttribute('style');
            }, 300);
        }
    } else {
        try {
            const response = await fetch('./data/words.json');
            if (response.ok) {
                const jsonWordInfo = await response.json();
                // Actions to take if word is valid
                if (jsonWordInfo[firstLetter][lengthCode][word] === 1) {
                    clearTimeout(timerStop);
                    clearInterval(timeInterval);
                    clearInterval(player.motionInterval);
                    message.innerHTML = `Wordymon used "${word}"!`;
                    setMotion(player, player.images.throw, 100, false, false);
                    setTimeout(() => {
                        setMotion(player, player.images.idle, 200, true, false);
                    }, 410);
                    playerHit = 0;
                    totalPoints += containerPoints;
                    let opponentDamage = containerPoints * 2;
                    containerPoints = 0;
                    let oldLevel = opponentHealthLevel.getAttribute('value');
                    gameScore.innerHTML = `SCORE: ${totalPoints}`;
                    wordPoints.innerHTML = `${containerPoints}<span> pts</span>`;
                    // Increase player health if player used letters with hearts which makes addHealth positive
                    if (addHealth > 0 && playerHealthLevel.getAttribute('value') < 100) {
                        let newHealthLevel = Number(playerHealthLevel.getAttribute('value')) + (10 * addHealth);
                        if (newHealthLevel > 100) {
                            newHealthLevel = 100;
                        }
                        setTimeout(() => {
                            playerHealthLevel.style.width = `${newHealthLevel}%`;
                            playerHealthLevel.setAttribute('value', newHealthLevel);
                        }, 500);
                    }
                    // Move letters to attack opponent
                    setTimeout(() => {
                        for (let spot of filledSpots) {
                            attackMotion(spot, opponent);
                            setTimeout( () => {
                                if (soundOn === true) {
                                    hitSound.play();
                                }
                                spot.style.visibility = 'hidden';
                            }, 360);
                        }
                    }, 200);
                    if (soundOn === true) {
                        whooshSound.play();
                    }
                    // Handle opponent damage that defeats them
                    if (opponentDamage >= oldLevel) {
                        setTimeout(() => {
                            setEffect(opponentEffect, 'smoke explosion');
                            setTimeout(() => {
                                opponent.element.style.visibility = 'hidden';
                                
                            }, 300);
                            clearInterval(opponent.motionInterval);
                            setMotion(opponentEffect, opponentEffect.images, opponentEffect.timing, false, true);
                            if (soundOn === true) {
                                explosionSound.play();
                            }
                            if (opponentDamage > 23) {
                                message.innerHTML = `"${word}" was super effective!`;
                            } else if (opponentDamage > 11) {
                                message.innerHTML = `"${word}" was effective!`;
                            } else {
                                message.innerHTML = `"${word}" did some damage`;
                            }
                            opponentHealthLevel.style.width = '0%';
                        }, 560);
                        setTimeout(() => {
                            message.innerHTML = `${opponent.name} was defeated!`;
                            opponentContainer.removeAttribute('style');
                        }, 2260);
                        setTimeout(() => {
                            // Reset bars and buttons for new opponent
                            opponentHealthLevel.removeAttribute('style');
                            timerLevel.setAttribute('value', 100);
                            timerLevel.style.width = '100%';
                            timerLevel.style.backgroundColor = 'rgb(85, 173, 241)';
                            letterSwitcher.style.backgroundColor = 'rgb(72, 199, 99)';
                            letterSwitcher.style.cursor = 'pointer';
                            letterSwitcher.setAttribute('active', true);
                            letterSwitched = false;
                            submitButton.removeAttribute('style');
                            submitButton.setAttribute('active', true);
                            setTimeout(() => {
                                setTimer();
                            }, 1520);
                            opponentDefeat();
                        }, 4260);
                    } else {
                        // Handle regular opponent damage
                        setTimeout(() => {
                            setEffect(opponentEffect, 'smoke hit');
                            setMotion(opponentEffect, opponentEffect.images, opponentEffect.timing, false, true);
                            
                        }, 560);
                        // Update opponent healthbar
                        setTimeout(() => {
                            if (opponentDamage > 23) {
                                message.innerHTML = `"${word}" was super effective!`;
                            } else if (opponentDamage > 11) {
                                message.innerHTML = `"${word}" was effective!`;
                            } else {
                                message.innerHTML = `"${word}" did some damage`;
                            }
                            opponentHealthLevel.style.width = `${oldLevel - opponentDamage}%`
                            if (oldLevel - opponentDamage < 25) {
                                opponentHealthLevel.style.backgroundColor = 'rgb(199, 78, 72)';
                            }
                            opponentHealthLevel.setAttribute('value', oldLevel - opponentDamage);
                        }, 1060);
                        // Revert things for new turn
                        setTimeout(() => {
                            resetLetters();
                            message.innerHTML = '';
                            timerLevel.setAttribute('value', 100);
                            timerLevel.style.width = '100%';
                            timerLevel.style.backgroundColor = 'rgb(85, 173, 241)';
                            submitButton.removeAttribute('style');
                            submitButton.setAttribute('active', true);
                            if (letterSwitched === false) {
                                letterSwitcher.removeAttribute('style');
                                letterSwitcher.setAttribute('active', true);
                            }
                            canPlay = true;
                            canSwitch = true;
                            setTimeout(() => {
                                setTimer();
                            }, 100);
                        }, 2260);
                    }
                } else {
                    // Show that word was not accepted by turning spots in word container red
                    for (let spot of letterSpots) {
                        spot.style.border = 'dashed red .2rem';
                        if (soundOn === true) {
                            errorSound.play();
                        }
                        setTimeout(() => {
                            spot.removeAttribute('style');
                        }, 300);
                    }
                    let filledSpots = document.querySelectorAll("div#word-container div[filled='true']");
                    for (let spot of filledSpots) {
                        spot.setAttribute('filled', false);
                        containerPoints = 0;
                        wordPoints.innerHTML = `${containerPoints}<span> pts</span>`;
                        for (let letter of letterBankLetters) {
                            if (spot.innerHTML == letter.innerHTML && letter.style.visibility == 'hidden') {
                                letter.removeAttribute('style');
                                spot.innerHTML = '';
                                break;
                            }
                        }
                    }
                    submitButton.removeAttribute('style');
                    submitButton.setAttribute('active', true);
                    if (letterSwitched === false) {
                        letterSwitcher.removeAttribute('style');
                        letterSwitcher.setAttribute('active', true);
                    }
                    canPlay = true;
                    canSwitch = true;
                }
            }    
        }
        catch(error) {
            alert(error);
        }
    }
}
// Function to reset word and change all letters
function resetLetters() {
    let filledSpots = document.querySelectorAll("div#word-container div[filled='true']");
    // reset letters in word container to be empty
    for (let spot of filledSpots) {
        spot.style.transform = 'translate(0px, 0px)';
        spot.setAttribute('filled', false);
        spot.innerHTML = '';
    }
    setTimeout(() => {
        for (let spot of filledSpots) {
            spot.style.visibility = 'visible';
        }
    }, 350);
    // replace used letter spaces with new letters and guarantee one vowel
    vowelSet = false;
    for (let letter of letterBankLetters) {
        letter.removeAttribute('style');
        newLetter(letter);
        let character = letter.getAttribute('character');
        if (character === 'A' || character === 'E' || character === 'I' || character === 'O' || character === 'U') {
            vowelSet = true;
        }
        if (letter.getAttribute('id') === 'letter-8' && vowelSet === false) {
            let vowelIndex = Math.floor(Math.random() * vowels.length);
            let character = vowels[vowelIndex].character;
            let points = vowels[vowelIndex].points;
            letter.innerHTML = `${character}<span>${points}</span>`;
            letter.setAttribute('character', character);
            letter.setAttribute('points', points);
            letter.setAttribute('heart', false);
            let randomNum2 = Math.floor(Math.random() * 29);
            if (randomNum2 < 2) {
                let heart = document.createElement('img');
                heart.setAttribute('src', './resources/images/heart.svg');
                letter.appendChild(heart);
                letter.setAttribute('heart', true);
            }
        }
    }
}




