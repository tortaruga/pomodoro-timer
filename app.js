import * as variables from './DOMvariables.js';

// initialize timer as default 
let deg = 0;
let isTimeUp = false;
let isTimerActive = false;

let time = {
    min: 25,
    sec: 0
};

let totalSeconds;

displayTime();
setTotalSeconds();

// timer buttons
variables.startBtn.addEventListener('click', startTimer);
variables.pauseBtn.addEventListener('click', pauseTimer);

// settings buttons
variables.settingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        
        reset();
        variables.settingBtns.forEach(btn => btn.classList.remove('active'));

        handleActive(btn, 'add');

        if (btn.id === 'task') {
            setTimer(25, 0);
        } else if (btn.id === 'short-break') {
            setTimer(5, 0);
        } else if (btn.id === 'long-break') {
            setTimer(15, 0);
        } else if (btn.id === 'custom') {
            handleModal();
        }
    })
})

// start timer
function updateDeg() {
    // update timer visualizer
    const degPerSecond = (360 / totalSeconds);
    deg += degPerSecond;
    variables.border.style.background = `conic-gradient(var(--red) ${deg}deg, transparent ${deg}deg)`;
    // stop when timer reaches end
    if (deg >= 360) stopTimer();
} 

function updateTimer() {
    if (time.min <= 0 && time.sec <= 0) {
        stopTimer();
        return;
    }

    if (time.sec > 0) {
        time.sec--;
    } else {
        time.sec = 59;
        time.min--;
    }

    displayTime();
}

function startTimer() {
    isTimerActive = true;
    const interval = setInterval(() => {
        updateDeg();
        updateTimer();

        if (isTimerActive) {
            handleActive(variables.startBtn, 'add');
            handleActive(variables.pauseBtn, 'remove');
        } else {
            handleActive(variables.startBtn, 'remove');
            handleActive(variables.pauseBtn, 'add');
        }
        if (isTimeUp || !isTimerActive) clearInterval(interval); 
    }, 1000);
}

// pause / stop timer

function stopTimer() {
    isTimeUp = true;
    variables.notification.style.animation = 'notification .5s forwards';
    // add sound alert
    const notificationSound = new Audio('./assets/alert.mp3');
    notificationSound.play();
}

function pauseTimer() {
    isTimerActive = false;
}

// notification
variables.closeNotificationBtn.addEventListener('click', () => {
    variables.notification.style.animation = 'dismiss .5s forwards'; 
    reset();
})

// custom timer settings
function handleModal() {
    variables.modal.classList.toggle('hide');
    variables.backdrop.classList.toggle('hide');
}

variables.closeModalBtn.addEventListener('click', handleModal);

variables.form.addEventListener('submit', (e) => {
    e.preventDefault();

    time = {
        min: document.getElementById('min').value || 0,
        sec: document.getElementById('sec').value || 0,
    };

    displayTime();
    setTotalSeconds();
    handleModal();
})



// utility functions
function displayTime() {
    variables.timeContainer.innerHTML = `${time.min >= 10 ? time.min : '0' + time.min}<span class=colon>:</span>${time.sec >= 10 ? time.sec : '0' + time.sec}`
}

function setTotalSeconds() {
    totalSeconds = (time.min * 60) + (time.sec);
}

function handleActive(btn, action) {
    action === 'add' ? btn.classList.add('active') : btn.classList.remove('active');
}

function setTimer(min, sec) {
    time = {
        min: min,
        sec: sec,
    }

    displayTime();
    setTotalSeconds();
}

function reset() {
    deg = 0;
    variables.border.style.background = `conic-gradient(var(--red) ${deg}deg, transparent ${deg}deg)`;
    isTimeUp = false;
    isTimerActive = true;

    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
}
