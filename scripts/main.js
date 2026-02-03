import {resetSeesaw} from "./svg-factory.js";
import { saveStateToLocalStorage, loadStateFromLocalStorage } from "./storage.js";
import { svg } from "./svg-factory.js";
import { mouseMoveHandler, resetStateHandler, pauseHandler, pauseBtn } from "./user-actions-handler.js";

resetSeesaw()

window.addEventListener("beforeunload", saveStateToLocalStorage);
window.addEventListener("load", loadStateFromLocalStorage);
svg.addEventListener('mousemove', mouseMoveHandler);
document.getElementById("reset").addEventListener("click", resetStateHandler);
pauseBtn.addEventListener('click', pauseHandler);
