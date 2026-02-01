resetSeesaw()

window.addEventListener("beforeunload", saveStateToLocalStorage);
window.addEventListener("load", loadStateFromLocalStorage);

svg.addEventListener('mousemove', mouseMoveHandler);
document.getElementById("reset").addEventListener("click", resetStateHandler);


