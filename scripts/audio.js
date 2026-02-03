// Sound Method
export function playLandingSound(weight) {
    const audioContext = new AudioContext();
    const osc = audioContext.createOscillator(); // soruce of sound

    osc.type = "triangle"; // type of sound
    osc.frequency.value = 220 - weight * 7; // as weight increases, frequency decreases

    osc.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.05);
}
