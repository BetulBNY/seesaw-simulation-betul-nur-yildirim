import { plankClickHandler } from "./user-actions-handler.js";
import { GHOST_CY } from "./config.js";

export const svg = document.getElementById('sim-svg');              
export const seesawGroup = document.getElementById('seesaw-group');
export const ghostGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
svg.appendChild(ghostGroup);

// Create Circle Method
export function createCompleteCircle(circleCx,circleCy,radius,color, weight, strokeColor="rgba(0,0,0,0.2)",strokeWidth=1) {
    const wholeCircle = createCircle(circleCx,circleCy,radius,color,strokeColor,strokeWidth)
    const shine = createShine(radius, circleCx)
    const label = createCircleText(circleCx,circleCy, weight)

    const fallingGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // Added to "g" seesawGroup for moving together.
    fallingGroup.appendChild(wholeCircle);
    fallingGroup.appendChild(shine);
    fallingGroup.appendChild(label);

    // Adding all of them to the svg group not seesaw group.
    svg.appendChild(fallingGroup);
    
    return { wholeCircle, shine, label, fallingGroup} ;
}

function createCircle(centerX,centerY,radius,color,strokeColor,strokeWidth) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY); 
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", color);
    circle.setAttribute("stroke", strokeColor); 
    circle.setAttribute("stroke-width", strokeWidth);      

    circle.style.pointerEvents = "none";

    return circle;
}

function createShine(radius, circleCx){
    let shineRadius= radius * 0.2;
    let shineCy=  (440 - radius - 1) - (radius * 0.4);
    let shineCx= circleCx - (radius * 0.4)

    return createCircle(shineCx, shineCy, shineRadius, "rgba(255, 255, 255, 0.6)")
}

function createCircleText(circleCx,circleCy=GHOST_CY , weight, textColor="white", textAnchor = "middle",fontFamily="Arial",fontWeight="bold") {
    //let labelCy = 440 - radius +5
    let fontSize = 10 + weight;
    //const label = createText(mouseX,labelCy,"white",labelFontSize, weight)

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", circleCx);
    text.setAttribute("y", circleCy + 5);
    text.setAttribute("fill", textColor);
    text.setAttribute("font-size", fontSize +"px");
    text.textContent = weight + "kg";

    text.setAttribute("text-anchor", textAnchor); // Center horizontally
    text.setAttribute("font-family", fontFamily);
    text.setAttribute("font-weight", fontWeight);
    text.style.pointerEvents = "none";

    return text;
}

export function setBallY(cy, radius, wholeCircle, shine, label) {
    wholeCircle.setAttribute("cy", cy)
    shine.setAttribute("cy", cy - (radius * 0.4))
    label.setAttribute("y", cy + 5)
}

export function setBallX(cx, radius, wholeCircle, shine, label) {
    wholeCircle.setAttribute("cx", cx);
    shine.setAttribute("cx", cx - (radius * 0.4));
    label.setAttribute("x", cx);
}


// GHOST CIRCLE PART
export function updateGhost(x, weight) {
    ghostGroup.innerHTML = ''; 
    const radius = 10 + (weight * 2);

    const circle = createCircle(x, GHOST_CY, radius, "gray")
    const text = createCircleText(x, GHOST_CY, weight, "black")  

    ghostGroup.appendChild(circle);
    ghostGroup.appendChild(text);
    ghostGroup.style.display = "block";
}

export function uploadBalls(placedBalls) {
    placedBalls.map(ball => {
            const  {wholeCircle, shine, label, fallingGroup} = createCompleteCircle(ball.localCX,ball.localCY, ball.radius, ball.color, ball.weight) 
            setBallY( ball.localCY, ball.radius, wholeCircle, shine, label);
            setBallX( ball.localCX, ball.radius, wholeCircle, shine, label);
            seesawGroup.appendChild(fallingGroup);       
        }
    ) 
}


export function resetSeesaw() {
    seesawGroup.innerHTML = "";
    createPlank();
}

export function createPlank() {
    const plank = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    plank.setAttribute("id", "plank");
    plank.setAttribute("x", 200);
    plank.setAttribute("y", 440);
    plank.setAttribute("width", 400);
    plank.setAttribute("height", 10);
    plank.setAttribute("fill", "#e67e22");
    plank.setAttribute("rx", 5);

    seesawGroup.appendChild(plank);
    plank.addEventListener("click", plankClickHandler);
}
