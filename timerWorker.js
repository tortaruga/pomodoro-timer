let time = {
    min: 25,
    sec: 0
}

let isTimerActive = false;
let interval;

let deg = 0;
let totalSeconds = 25 * 60;

self.onmessage = function (e) {
    if (e.data.command === 'set timer') {
        time.min = e.data.min;
        time.sec = e.data.sec; 
        deg = 0;
        totalSeconds = (time.min * 60) + time.sec;
        stopTimer();
        postMessage({command: 'timer set', min: time.min, sec: time.sec, deg: deg})
    } else if (e.data.command === 'start timer') {
        isTimerActive = true;
        startTimer();
        postMessage({command: 'timer running', isTimerActive, min: time.min, sec: time.sec, deg: deg})
    } else if (e.data.command === 'pause timer') {
        isTimerActive = false;
        stopTimer();
        postMessage({command: 'timer stopped', isTimerActive, min: time.min, sec: time.sec, deg: deg})
    }
}


function startTimer() {
    interval = setInterval(() => {
   if (time.min === 0 && time.sec === 0) {
        // stop timer
        clearInterval(interval);
        isTimerActive = false;
        postMessage({ command: 'time is up' });
        return
    }

    if (time.sec > 0) {
        time.sec--;
    } else if (time.sec === 0) {
        time.sec = 59;
        time.min--;
    }
     
    updateDeg();
    postMessage({command: 'timer running', isTimerActive, min: time.min, sec: time.sec, deg: deg})
    }, 1000);
            
} 

function stopTimer() {
    clearInterval(interval);
    postMessage({command: 'timer paused', min: time.min, sec: time.sec});
}


function updateDeg() {
    if (!isTimerActive) return;
    // update timer visualizer
    const degPerSecond = (360 / totalSeconds);
    deg += degPerSecond;
} 
