import { seesawGroup, setBallY, setBallX } from "./svg-factory.js";
import { measures, GHOST_CY, placedBalls, PLANK_CENTER, PLANK_Y } from "./config.js";
import { updatePlankState } from "./calculations.js";
import { playLandingSound } from "./audio.js";
import { updatePanelsDOM } from "./dom-access.js";

export function rotatePlank(){
    seesawGroup.style.transform = `rotate(${measures.currentAngle}deg)`;
} 
   
export function fallingAnimation(wholeCircle, shine, label, targetY, fallingGroup, radius, distanceToPlankCenter, weight, randomColor){  
    let velocity = 0;
    let currentY = GHOST_CY   // Start Point of the ball
    const gravity = 0.3;

    const fallingSteps = () => {
        currentY += velocity;
        setBallY(currentY, radius, wholeCircle, shine, label)
        velocity += gravity;

        if (currentY + velocity < targetY) {
            requestAnimationFrame(fallingSteps); // continue falling steps
        }
        else {
            // Calculate the angular deviation caused by rotation of the seesaw group element.
            const angleRadian = measures.currentAngle * (Math.PI / 180);
            const adjustedDistance = distanceToPlankCenter / Math.cos(angleRadian);
            const localCX = PLANK_CENTER + adjustedDistance;
            const localCY = PLANK_Y - radius; // Plank's top surface
            
            placedBalls.push({weight: weight, distanceToPlankCenter: distanceToPlankCenter ,color: randomColor, localCX:localCX, localCY:localCY, radius:radius})
            console.log("placed BAlls:", placedBalls, "window.placedBalls:", window.placedBalls)
            setBallY(localCY, radius, wholeCircle, shine, label);            
            setBallX(localCX, radius, wholeCircle, shine, label);

            seesawGroup.appendChild(fallingGroup);  // appending to seesaw group
            
            updatePlankState();
            playLandingSound(weight)
            updatePanelsDOM();
        }
    }
    requestAnimationFrame(fallingSteps); // starts falling steps
}
