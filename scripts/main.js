
const PLANKSTART = 200;
const PLANKEND= 600;
const GHOST_CY = 250;
const MAX_ANGLE = 30;

// List of colors
const colors = ["#ff5733", "#33ff57", "#3357ff", "#f39c12", "#8e44ad", "#1abc9c", "#e84393", "#f1c40f"];

// Random color generator
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}
// Random wieght generator
function getRandomWeight() {
    return Math.floor(Math.random() * 10) + 1;
}


export let placedBalls = [];// Yerleşen topların listesi {weight, distance} Artık her düşen topun ağırlığını ve mesafesini bu listede tutuyoruz. Dengeyi bu listeye bakarak hesaplıyoruz.
export let measures = {
    torques: {
        right: 0,
        left: 0
    },
    weights: {
        right: 0,
        left: 0
    },
    currentAngle: 0, // Tahterevallinin o anki açısı  (0: düz, 10: sağa yatık, -10: sola yatık)
    nextWeight: getRandomWeight()
}


resetSeesaw()

window.addEventListener("beforeunload", saveStateToLocalStorage);
window.addEventListener("load", loadStateFromLocalStorage);

svg.addEventListener('mousemove', mouseMoveHandler);
document.getElementById("reset").addEventListener("click", resetStateHandler);


///////////////// DOM SECTION
function updatePanelsDOM() {
    document.getElementById("angle-value").textContent = measures.currentAngle.toFixed(1); 
    document.getElementById("left-weight-value").textContent = measures.weights.left; 
    document.getElementById("right-weight-value").textContent = measures.weights.right; 
    document.getElementById("left-torque-value").textContent = measures.torques.left.toFixed(1); 
    document.getElementById("right-torque-value").textContent = measures.torques.right.toFixed(1); 
}