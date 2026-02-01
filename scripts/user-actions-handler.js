import { fallingAnimation, rotatePlank } from "./animation.js";
import { createCompleteCircle, updateGhost, svg, ghostGroup, resetSeesaw } from "./svg-factory.js";
import { measures, PLANKSTART, PLANKEND, PLANK_CENTER, GHOST_CY, placedBalls, logs } from "./config.js";
import { getRandomWeight, getRandomColor, getPlankY} from "./calculations.js";
import { updatePanelsDOM, addNewLog, resetLogs } from "./dom-access.js";



export function mouseMoveHandler(event) { // instead of mousemove on plank I changed it to svg for able to see ghost circle between 200-600
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;  

    // If we are only in between 200-600(PLANKSTART-PLANKEND)
    if (mouseX >= PLANKSTART-1 && mouseX <= PLANKEND) {
    // Update the ghost ball (X coordinate is the same as the mouse cursor, weight is the next weight)
        updateGhost(mouseX, measures.nextWeight);
    } else {
        ghostGroup.style.display = "none";
    }
}

export function plankClickHandler(event) {
    // LOCATION PART
    // Screen position of SVG
    const rect = svg.getBoundingClientRect();
    // Calculating x coordinate of the clicked point inside SVG
    // (Real mouse coordiantes - Left side of the SVG (distance between frame and left of screen))
    const mouseX = event.clientX - rect.left;
    // Distance from the pivot(center)
    const distanceToPlankCenter = mouseX - PLANK_CENTER;

    // CIRCLE CREATION PART
    const weight = measures.nextWeight;
    const radius = 10 + (weight * 2); 
    const randomColor = getRandomColor(); 
    // Creating circle
    const { wholeCircle, shine, label, fallingGroup } = createCompleteCircle(mouseX, GHOST_CY, radius, randomColor, weight)

    const targetY = getPlankY(distanceToPlankCenter)-radius;

    addNewLog(distanceToPlankCenter, weight);  // write to frontedn
    logs.push({distanceToPlankCenter, weight}); // push to backend

    fallingAnimation(wholeCircle, shine, label, targetY, fallingGroup, radius, distanceToPlankCenter, weight, randomColor);
    
   // After the ball is created determine the next weight and update the ghost.
    measures.nextWeight = getRandomWeight();
    updateGhost(mouseX, measures.nextWeight);
    
}


export function resetStateHandler() {

    resetSeesaw()

    // placedBalls reset
    placedBalls.length = 0;

    // measures reset
    measures.torques.right = 0;
    measures.torques.left = 0;

    measures.weights.right = 0;
    measures.weights.left = 0;

    measures.currentAngle = 0;
    measures.nextWeight = getRandomWeight();


    updatePanelsDOM();
    rotatePlank(measures.currentAngle);

    resetLogs()
    //updateLogsDOM()
}


