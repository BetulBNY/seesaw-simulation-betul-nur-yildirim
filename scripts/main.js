import {resetSeesaw, svg } from "./svg-factory.js";
import { saveStateToLocalStorage, loadStateFromLocalStorage } from "./storage.js";
import { mouseMoveHandler, resetStateHandler, pauseHandler } from "./user-actions-handler.js";

resetSeesaw()

svg.addEventListener('mousemove', mouseMoveHandler);

window.addEventListener("beforeunload", saveStateToLocalStorage);
window.addEventListener("load", loadStateFromLocalStorage);

document.getElementById("reset").addEventListener("click", resetStateHandler);
document.getElementById("pause").addEventListener("click", pauseHandler);

