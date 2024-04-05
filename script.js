let workTime = 25; // Default work time in minutes
let breakTime = 5; // Default break time in minutes
let isWorkTime = true;
let timer;
let remainingTime = workTime * 60;
let cycleCount = 0;

const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const applySettingsButton = document.getElementById('applySettings');
const beepSound = document.getElementById('beepSound');
const cycleCounterDisplay = document.getElementById('cycleCounter');
const timerElement = document.getElementById('timer');

function updateDisplay(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function playBeep() {
    beepSound.play();
}

function startTimer() {
    if (remainingTime === workTime * 60 || remainingTime === breakTime * 60) {
        toggleControls(true);
    }
    clearInterval(timer);
    timer = setInterval(() => {
        remainingTime--;
        updateDisplay(remainingTime);

        if (remainingTime <= 0) {
            playBeep();
            isWorkTime = !isWorkTime;
            remainingTime = (isWorkTime ? workTime : breakTime) * 60;
            if (!isWorkTime) {
                cycleCount++;
                cycleCounterDisplay.textContent = `Cycles Completed: ${cycleCount}`;
            }
            updateSessionIndicator();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    toggleControls(false);
}

function resetTimer() {
    clearInterval(timer);
    isWorkTime = true;
    remainingTime = workTime * 60;
    updateDisplay(remainingTime);
    toggleControls(false);
    updateSessionIndicator();
}

function applySettings() {
    workTime = parseInt(workTimeInput.value) || workTime;
    breakTime = parseInt(breakTimeInput.value) || breakTime;
    saveSettings();
    resetTimer();
}

function toggleControls(disabled) {
    pauseButton.disabled = disabled;
    applySettingsButton.disabled = disabled;
    workTimeInput.disabled = disabled;
    breakTimeInput.disabled = disabled;
}

function updateSessionIndicator() {
    if (isWorkTime) {
        timerElement.classList.remove('breakSession');
        timerElement.classList.add('workSession');
    } else {
        timerElement.classList.remove('workSession');
        timerElement.classList.add('breakSession');
    }
}

function saveSettings() {
    localStorage.setItem('workTime', workTime.toString());
    localStorage.setItem('breakTime', breakTime.toString());
}

function loadSettings() {
    workTime = parseInt(localStorage.getItem('workTime')) || 25;
    breakTime = parseInt(localStorage.getItem('breakTime')) || 5;
    workTimeInput.value = workTime;
    breakTimeInput.value = breakTime;
    resetTimer();
}

document.addEventListener('DOMContentLoaded', loadSettings);
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
applySettingsButton.addEventListener('click', applySettings);
