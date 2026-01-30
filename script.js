const plank = document.getElementById('plank');
const seesawGroup = document.getElementById('seesaw-group');
const svg = document.getElementById('sim-svg');

// List of colors
const colors = ["#ff5733", "#33ff57", "#3357ff", "#f39c12", "#8e44ad", "#1abc9c", "#e84393", "#f1c40f"];
// Random color generator
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}
// Random wieght generator
function getRandomWeight() {
    return Math.floor(Math.random() * 10) + 1;
}

// Create Circle Method
function createCircle(centerX,centerY,r,color,strokeColor,strokeWidth) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY); 
    circle.setAttribute("r", r);
    circle.setAttribute("fill", color);
    circle.setAttribute("stroke", strokeColor); 
    circle.setAttribute("stroke-width", strokeWidth);
    circle.style.pointerEvents = "none";
    return circle;
}

function createText(xLocation,yLocation,textColor,fontSize, weight, textAnchor = "middle",fontFamily="Arial",fontWeight="bold") {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", xLocation);
    text.setAttribute("y", yLocation + 5);
    text.setAttribute("fill", textColor);
    text.setAttribute("font-size", fontSize +"px");
    text.textContent = weight + "kg";

    text.setAttribute("text-anchor", textAnchor); // Center horizontally
    text.setAttribute("font-family", fontFamily);
    text.setAttribute("font-weight", fontWeight);
    text.style.pointerEvents = "none";

    return text;
}

