import { measures, logs, setLogs } from "./config.js";

export function updatePanelsDOM() {
    document.getElementById("angle-value").textContent = `${measures.currentAngle.toFixed(1)}°`; 
    document.getElementById("left-weight-value").textContent = measures.weights.left; 
    document.getElementById("right-weight-value").textContent = measures.weights.right; 
    document.getElementById("left-torque-value").textContent = measures.torques.left.toFixed(1); 
    document.getElementById("right-torque-value").textContent = measures.torques.right.toFixed(1); 
}




export function addNewLog(distanceToPlankCenter, weight) {
    // creating
    const direction = distanceToPlankCenter >= 0? "right" : "left";
    const logText = `${weight} kg shiny ball was dropped on the ${direction} side, ${Math.abs(distanceToPlankCenter).toFixed(0)} px horizontally from the pivot.`
    

    const logItem = document.createElement("p");
    logItem.textContent = logText;
    const logsContainer = document.getElementById("logs");
    logsContainer.prepend(logItem);  // Instead of appendChild, for reverse logs writing

    // otomatik aşağı kaydır (log artınca çok hoş oluyor)
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

export function resetLogs() {
    const logsContainer = document.getElementById("logs");
    logsContainer.innerHTML = "";
    setLogs([]);
}


