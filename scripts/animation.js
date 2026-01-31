import seesawgr, measures


export function rotatePlank(){
    seesawGroup.style.transform = `rotate(${measures.currentAngle}deg)`;
}    
export function fallingAnimation(wholeCircle, shine, label, targetY){
    let velocity = 0;
    let currentY = GHOST_CY     // başlangıç noktası GHOST_CY(250)
    const gravity = 0.5;
    const fallingSteps = () => {
        currentY += velocity;
        
        setBallY(currentY, radius, wholeCircle, shine, label)

        velocity += gravity;

        if (currentY + velocity < targetY) {
            requestAnimationFrame(fallingSteps); // contnue fallingSteps
        }
        else {
            // Calculate the angular deviation caused by rotation of the seesaw group element.
            const angleRadian = measures.currentAngle * (Math.PI / 180);
            const adjustedDistance = distance / Math.cos(angleRadian);
            const localCX = 400 + adjustedDistance;
            const localCY = 450 - radius; // Kalasın üst yüzeyi
            
            // placedBalls.push({weight: weight, distance: distance ,color: randomColor})
            placedBalls.push({weight: weight, distance: distance ,color: randomColor, localCX:localCX, localCY:localCY, radius:radius})

            setBallY(localCY, radius, wholeCircle, shine, label);
            
            setBallX(localCX, radius, wholeCircle, shine, label);


            seesawGroup.appendChild(fallingGroup);  // yamultuyor
            
            updatePlankState();
            
            playLandingSound(weight)
            updatePanelsDOM();
        }
    }
    requestAnimationFrame(fallingSteps); // starts fallingSteps
}
