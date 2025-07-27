const worker = new Worker("timerWorker.js");

const settingBtns = document.querySelectorAll('.settings button');
const border = document.querySelector('.border');

let min;
let sec; 

let isTimerActive = false;
let deg = 0;


settingBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        // remove selected button styles from previous selected button
        // add it to currently selected button
        document.querySelectorAll('.active').forEach(btn => handleActive(btn, 'remove'));
        handleActive(btn, 'add');

        // set timer according to button chosen
        if (btn.id === 'task') {
            min = 25;
            sec = 0;
        } else if (btn.id === 'short-break') {
            min = 5;
            sec = 0;
        } else if (btn.id === 'long-break') {
            min = 15;
            sec = 0
        } else if (btn.id === 'custom') {
            handleModal();
        }

        worker.postMessage({command: 'set timer', min: min, sec: sec});
    })
})

worker.onmessage = function (e) {
    if (e.data.command === 'timer set') {
        min = e.data.min;
        sec = e.data.sec;
        // update visualizer
        border.style.background = `conic-gradient(var(--red) ${e.data.deg}deg, transparent ${e.data.deg}deg)`;
        displayTime();
    } else if (e.data.command === 'timer running') {
        isTimerActive = e.data.isTimerActive;
        min = e.data.min;
        sec = e.data.sec;
        // update visualizer
        border.style.background = `conic-gradient(var(--red) ${e.data.deg}deg, transparent ${e.data.deg}deg)`;
        displayTime();
        document.querySelector('.colon').classList.add('active');
    } else if (e.data.command === 'time is up') {
        handleNotification();
        document.querySelector('.colon').classList.remove('active');
    } else if (e.data.command = 'timer stopped') {
        isTimerActive = e.data.isTimerActive;
        min = e.data.min;
        sec = e.data.sec;
        // update visualizer
        border.style.background = `conic-gradient(var(--red) ${e.data.deg}deg, transparent ${e.data.deg}deg)`;
        displayTime();
        document.querySelector('.colon').classList.remove('active');
    }
}

function displayTime() {
    const timeContainer = document.querySelector('.time'); 
    timeContainer.innerHTML = `${min < 10 ? "0" + min : min}<span class='colon'>:</span>${sec < 10 ? "0" + sec : sec}`;
}


// custom timer modal stuff
function handleModal() {
    const modal = document.querySelector('.custom-timer-modal');
    const backdrop = document.querySelector('.backdrop');

    modal.classList.toggle('hide');
    backdrop.classList.toggle('hide');
}

const form = document.querySelector('.custom-timer-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let min = Number(document.getElementById('min').value) || 0; 
    let sec = Number(document.getElementById('sec').value) || 0; 
    
    // handle seconds higher than 60
    if (sec >= 60) {
        min = min + Math.floor(sec / 60);
        sec = sec % 60;
    }

    worker.postMessage({command: 'set timer', min: min, sec: sec});
    handleModal();
})

const closeModalBtn = document.querySelector('.custom-timer-modal .close-btn');
closeModalBtn.addEventListener('click', handleModal);

// handle start timer
const startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', () => {
    if (!isTimerActive) {
        worker.postMessage({command: 'start timer'});
        // select right button
        handleActive(pauseBtn, 'remove');
        handleActive(startBtn, 'add');
    }
    
})

// handle notification when time's up

function handleNotification() {
    const notification = document.querySelector('.notification');
    notification.style.animation = 'notification .5s forwards';
    // add sound alert
    const notificationSound = new Audio('./assets/alert.mp3');
    notificationSound.play();
}

const closeNotificationBtn = document.querySelector('.notification .close-btn');

closeNotificationBtn.addEventListener('click', () => {
    const notification = document.querySelector('.notification');
    notification.style.animation = 'dismiss .5s forwards'; 
})

// handle stop timer

const pauseBtn = document.querySelector('.pause-btn'); 

pauseBtn.addEventListener('click', () => {
    worker.postMessage({command: 'pause timer'});
    // select right button
    handleActive(pauseBtn, 'add');
    handleActive(startBtn, 'remove');
}) 


// handle visual feedback for selected buttons
function handleActive(btn, action) {
    action === 'add' ? btn.classList.add('active') : btn.classList.remove('active');
}