export function updatePanelsDOM() {
    document.getElementById("angle-value").textContent = measures.currentAngle.toFixed(1); 
    document.getElementById("left-weight-value").textContent = measures.weights.left; 
    document.getElementById("right-weight-value").textContent = measures.weights.right; 
    document.getElementById("left-torque-value").textContent = measures.torques.left.toFixed(1); 
    document.getElementById("right-torque-value").textContent = measures.torques.right.toFixed(1); 
}