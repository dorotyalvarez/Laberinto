let startTime;
let timerInterval;

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 100);
}

function updateTimerDisplay() {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = elapsedTime % 1000;
    // Muestra el tiempo en el formato deseado
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = `${seconds}.${Math.floor(milliseconds / 100)} seconds`;
}

function resetTimer() {
    clearInterval(timerInterval); // Detener el temporizador actual
    startTime = Date.now(); // Reiniciar el tiempo
    updateTimerDisplay(); // Actualizar la pantalla
}

function stopTimer() {
    clearInterval(timerInterval); // Detener el temporizador
}