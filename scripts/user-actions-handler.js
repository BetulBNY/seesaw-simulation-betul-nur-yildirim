import { fallingAnimation, rotatePlank } from "./animation.js";
import { createCompleteCircle, updateGhost, svg, ghostGroup, resetSeesaw } from "./svg-factory.js";
import { measures, PLANKSTART, PLANKEND, PLANK_CENTER, GHOST_CY, placedBalls, logs, isPaused, setPause } from "./config.js";
import { getRandomWeight, getRandomColor, getPlankY} from "./calculations.js";
import { updatePanelsDOM, addNewLog, resetLogs } from "./dom-access.js";

export function mouseMoveHandler(event) { // instead of mousemove on plank I changed it to svg for able to see ghost circle between PLANKSTART-PLANKEND
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;  
    // If we are only in between PLANKSTART-PLANKEND
    if (mouseX >= PLANKSTART-1 && mouseX <= PLANKEND) {
    // Update the ghost circle (X coordinate is the same as the mouse cursor, weight is the next weight)
        updateGhost(mouseX, measures.nextWeight);
    } else {
        ghostGroup.style.display = "none";
    }
}

export function plankClickHandler(event) {
    if (isPaused) {
        alert("Simulaiton is paused! To drop the ball, click continue button.");
        return;
    }
    // LOCATION SECTION
    // Screen coordinates of SVG
    const rect = svg.getBoundingClientRect();
    // Calculating x coordinate of the clicked point inside SVG (Real mouse coordinates - Left side of the SVG (distance between frame and left side of the screen))
    const mouseX = event.clientX - rect.left;
    const distanceToPlankCenter = mouseX - PLANK_CENTER;

    // CIRCLE CREATION SECTION
    const weight = measures.nextWeight;
    const radius = 10 + (weight * 2); 
    const randomColor = getRandomColor(); 
    const { wholeCircle, shine, label, fallingGroup } = createCompleteCircle(mouseX, GHOST_CY, radius, randomColor, weight)
    const targetY = getPlankY(distanceToPlankCenter)-radius;

    addNewLog(distanceToPlankCenter, weight);  // write to frontend
    logs.push({distanceToPlankCenter, weight}); // save to logs

    fallingAnimation(wholeCircle, shine, label, targetY, fallingGroup, radius, distanceToPlankCenter, weight, randomColor);
    
   // After the circle is created determine the next weight and update the ghost.
    measures.nextWeight = getRandomWeight();
    updateGhost(mouseX, measures.nextWeight);
    
}

export function resetStateHandler() {
    resetSeesaw()
    // reset placedBalls
    placedBalls.length = 0;

    // reset measures
    measures.torques.right = 0;
    measures.torques.left = 0;

    measures.weights.right = 0;
    measures.weights.left = 0;

    measures.currentAngle = 0;
    measures.nextWeight = getRandomWeight();

    updatePanelsDOM();
    rotatePlank(measures.currentAngle);
    resetLogs()
}

export const pauseBtn = document.getElementById('pause');

export function pauseHandler() {
    setPause(!isPaused)
    console.log("paused")
    if (isPaused) {
        // Pause
        pauseBtn.textContent = "CONTINUE";
        pauseBtn.classList.add("continue"); 
    } else {
        // Continue
        pauseBtn.textContent = "PAUSE";
        pauseBtn.classList.remove("continue"); 
    }
}


