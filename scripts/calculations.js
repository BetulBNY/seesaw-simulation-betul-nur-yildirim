

function calcuateAngle(torqueDiff) {
    return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, torqueDiff));
}

function updateTorque(){
    // Calculating Torque
    const lastBall = placedBalls[placedBalls.length - 1]; // sürekli bütün listeyi dönmek yerine son elemanı güncelliyoruz
    if (lastBall.distance < 0) {
        // Left S,de
        measures.weights.left += lastBall.weight;
        measures.torques.left += lastBall.weight * Math.abs(lastBall.distance);
    } else {
        // Right Side
        measures.weights.right += lastBall.weight;
        measures.torques.right += lastBall.weight * Math.abs(lastBall.distance);
    }

    return (measures.torques.right - measures.torques.left) / 20;   
}

export function updatePlankState(){
    let torqueDiff = updateTorque();        
    measures.currentAngle = calcuateAngle(torqueDiff);
    rotatePlank();
}

// A function that finds the instantaneous height Y of at point X
export function getPlankY(distance) {
    const angleRad = measures.currentAngle * (Math.PI / 180);  // Turned degree to radian. rad = degree * (PI / 180) 
    // Y = PivotY + (mesafe * sin(açı))
    return 450 + (distance * Math.tan(angleRad));             //////////////////////////????????????????????????????? Tan      
}


