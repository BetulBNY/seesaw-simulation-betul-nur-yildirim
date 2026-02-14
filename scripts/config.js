import { getRandomWeight } from "./calculations.js";

export const PLANKSTART = 100;
export const PLANKEND = 500;
export const PLANK_LENGTH = PLANKEND - PLANKSTART; 
export const PLANK_CENTER = (PLANKEND + PLANKSTART) / 2;
export const PLANK_Y = 350;
export const GHOST_CY = 100;
export const MAX_ANGLE = 30;

export let isPaused = false;

// List of colors
export const colors = ["#ff5733", "#33ff57", "#3357ff", "#f39c12", "#8e44ad", "#1abc9c", "#e84393", "#f1c40f"];
export let placedBalls = [];// List of placed balls {weight, distance, color} Now we are storing the weight and distance of each fallen ball in this list. We are calculating the balance by looking at this list.
window.placedBalls = placedBalls;
export let measures = {
    torques: {
        right: 0,
        left: 0
    },
    weights: {
        right: 0,
        left: 0
    },
    currentAngle: 0, // Plank's current angle (0: flat, 10: tilted right, -10: tilted left)
    nextWeight: getRandomWeight()
}

export let logs = [];

export function setPlacedBalls(newPlacedBalls) { // to assign value from other files
    placedBalls = newPlacedBalls;
}

export function setMeasures(newMeasures) { 
    measures = newMeasures;
}

export function setLogs(newlogs) { 
    logs = newlogs;
}

export function setPause(newPause) { 
    isPaused = newPause;
}
