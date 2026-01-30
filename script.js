const plank = document.getElementById('plank');
const seesawGroup = document.getElementById('seesaw-group');
const svg = document.getElementById('sim-svg');

const PLANKSTART = 200;
const PLANKEND= 600;
const GHOST_CY = 250;
const MAX_ANGLE = 30;

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


let currentAngle = 0; // Tahterevallinin o anki açısı  (0: düz, 10: sağa yatık, -10: sola yatık)
let placedBalls = [];// Yerleşen topların listesi {weight, distance} Artık her düşen topun ağırlığını ve mesafesini bu listede tutuyoruz. Dengeyi bu listeye bakarak hesaplıyoruz.
const measures = {
    torques: {
        right: 0,
        left: 0
    },
    weights: {
        right: 0,
        left: 0
    }
}
function calculatePhysics(){
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
    console.log("left torque:",measures.torques.left,"right torque:",measures.torques.right);
    // Calculating Angle
    // We lock it between -30 and +30 degrees with Math.max/min.
    let torqueDiff = (measures.torques.right - measures.torques.left) / 20;           
    currentAngle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, torqueDiff));

    return currentAngle; // Turn seesaw
}

function rotatePlank(currentAngle){
    seesawGroup.style.transform = `rotate(${currentAngle}deg)`;
}

function updatePlankPosition(){
    const currentAngle = calculatePhysics();
    rotatePlank(currentAngle);
}

// A function that finds the instantaneous height Y of at point X
function getPlankY(distance) {
    const angleRad = currentAngle * (Math.PI / 180);  // Turned degree to radian. rad = degree * (PI / 180) 
    // Y = PivotY + (mesafe * sin(açı))
    return 450 + (distance * Math.sin(angleRad));       
}

// Sound Method
function playLandingSound(weight) {
    const audioContext = new AudioContext();
    const osc = audioContext.createOscillator(); // soruce of sound

    osc.type = "triangle"; // type of sound
    osc.frequency.value = 220 - weight * 7; // ağırlık arttıkça tizlik azalyor

    osc.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.05);
}

// GHOST CIRCLE PART
let nextWeight = getRandomWeight(); // at the beginning we randomly select the weight of circle
const ghostGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
//ghostGroup.style.pointerEvents = "none";
svg.appendChild(ghostGroup);

function updateGhost(x, weight) {
    ghostGroup.innerHTML = ''; 
    const r = 10 + (weight * 2);

    const circle = createCircle(x,GHOST_CY,r,"gray")
    const text = createText(x,GHOST_CY,"black",12,weight  )

    ghostGroup.appendChild(circle);
    ghostGroup.appendChild(text);
    ghostGroup.style.display = "block";
}

svg.addEventListener('mousemove', function(event) { // instead of mousemove on plank I changed it to svg for able to see ghost circle between 200-600
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;  

    // If we are only in between 200-600(PLANKSTART-PLANKEND)
    if (mouseX >= PLANKSTART && mouseX <= PLANKEND) {
    // Update the ghost ball (X coordinate is the same as the mouse cursor, weight is the next weight)
        updateGhost(mouseX, nextWeight);
    } else {
        ghostGroup.style.display = "none";
    }
});

// Click on plank
plank.addEventListener('click', function(event) {

// LOCATION PART
    // Screen position of SVG
    const rect = svg.getBoundingClientRect();
    // Calculating x coordinate of the clicked point inside SVG
    // (Real mouse coordiantes - Left side of the SVG (distance between frame and left of screen))
    const mouseX = event.clientX - rect.left;
    // Distance from the pivot(center)
    const distance = mouseX - 400;

// CIRCLE CREATION PART
    const weight = nextWeight; // getRandomWeight()
    const radius = 10 + (weight * 2); 
    const circleCy = 440 - radius
    const randomColor = getRandomColor(); 
    const fallingGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // Creating circle
    const circle = createCircle(mouseX,circleCy,radius,randomColor,"rgba(0,0,0,0.2)",1)

    // Creating shine                        //////////////??????????????????????????????
    let shineRadius= radius * 0.2;
    let shineCy=  (440 - radius - 1) - (radius * 0.4);
    let shineCx= mouseX - (radius * 0.4)
    const shine = createCircle( shineCx, shineCy,shineRadius,"rgba(255, 255, 255, 0.6)")

    // Creataing Weight Txt
    let labelCy = 440 - radius +5
    let labelFontSize = 10 + weight
    const label = createText(mouseX,labelCy,"white",labelFontSize, weight)

    // Added to "g" seesawGroup for moving together.
    fallingGroup.appendChild(circle);
    fallingGroup.appendChild(shine);
    fallingGroup.appendChild(label);

    // Adding all of them to the svg group not seesaw group.
    svg.appendChild(fallingGroup);

const targetY = getPlankY(distance)-radius;

function fallingAnimation(circle, shine, label, targetY){
    let velocity = 0;
    let currentY = GHOST_CY     // başlangıç noktası GHOST_CY(250)
    const gravity = 0.5;
    const fallingSteps = () => {
        velocity += gravity;
        currentY += velocity;
        circle.setAttribute("cy",currentY)
        shine.setAttribute("cy",currentY - (radius * 0.4))
        label.setAttribute("y",currentY)

        if (currentY < targetY){
            requestAnimationFrame(fallingSteps); // contnue fallingSteps
        }
        else{
            circle.setAttribute("cy",currentY)
            shine.setAttribute("cy",currentY - (radius * 0.4))
            label.setAttribute("y",currentY + 5)
            seesawGroup.appendChild(fallingGroup);  // yamultuyor
            // Koordinatları seesawGroup'a göre sıfırlıyoruz. Topu artık mouse  click yaptığımız yere yani pivottan distance kadar uzaklığa yerleştiriyoruz.
            circle.setAttribute("cx", 400 + distance);
            circle.setAttribute("cy", 450 - radius);
            
            shine.setAttribute("cx", (400 + distance) - (radius * 0.4));
            shine.setAttribute("cy", (450 - radius) - (radius * 0.4));
            
            label.setAttribute("x", 400 + distance);
            label.setAttribute("y", 450 - radius + 5);
            placedBalls.push({weight: weight, distance: distance ,color: randomColor})
            playLandingSound(weight)
            updatePlankPosition();
        }
    }
    requestAnimationFrame(fallingSteps); // starts fallingSteps
}

    fallingAnimation(circle, shine, label, targetY)

   // After the ball is created determine the next weight and update the ghost.
   nextWeight = getRandomWeight();
   updateGhost(mouseX, nextWeight);

   console.log("Down:", weight, "Next:", nextWeight);
});

