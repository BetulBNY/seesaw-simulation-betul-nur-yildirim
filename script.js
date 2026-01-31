const plank = document.getElementById('plank');
const seesawGroup = document.getElementById('seesaw-group');
const svg = document.getElementById('sim-svg');

const PLANKSTART = 200;
const PLANKEND= 600;
const GHOST_CY = 250;
const MAX_ANGLE = 30;

window.addEventListener("beforeunload", saveStateToLocalStorage);
window.addEventListener("load", loadStateFromLocalStorage);

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

function createCompleteCircle(circleCx,circleCy,radius,color, weight, strokeColor="rgba(0,0,0,0.2)",strokeWidth=1) {
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

//let currentAngle = 0; // Tahterevallinin o anki açısı  (0: düz, 10: sağa yatık, -10: sola yatık)
let placedBalls = [];// Yerleşen topların listesi {weight, distance} Artık her düşen topun ağırlığını ve mesafesini bu listede tutuyoruz. Dengeyi bu listeye bakarak hesaplıyoruz.
//let nextWeight = getRandomWeight(); // at the beginning we randomly select the weight of circle
const ghostGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
svg.appendChild(ghostGroup);


let measures = {
    torques: {
        right: 0,
        left: 0
    },
    weights: {
        right: 0,
        left: 0
    },
    currentAngle: 0, // Tahterevallinin o anki açısı  (0: düz, 10: sağa yatık, -10: sola yatık)
    nextWeight: getRandomWeight()
}

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

function rotatePlank(){
    seesawGroup.style.transform = `rotate(${measures.currentAngle}deg)`;
}

function updatePlankPosition(){
    let torqueDiff = updateTorque();        
    measures.currentAngle = calcuateAngle(torqueDiff);
    rotatePlank();
}

// A function that finds the instantaneous height Y of at point X
function getPlankY(distance) {
    const angleRad = measures.currentAngle * (Math.PI / 180);  // Turned degree to radian. rad = degree * (PI / 180) 
    // Y = PivotY + (mesafe * sin(açı))
    return 450 + (distance * Math.tan(angleRad));             //////////////////////////????????????????????????????? Tan      
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
function updateGhost(x, weight) {
    ghostGroup.innerHTML = ''; 
    const radius = 10 + (weight * 2);

    const circle = createCircle(x, GHOST_CY, radius, "gray")
    const text = createCircleText(x, GHOST_CY, weight, "black")  

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
        updateGhost(mouseX, measures.nextWeight);
    } else {
        ghostGroup.style.display = "none";
    }
});











function plankClickHandler(event) {

    // LOCATION PART
        // Screen position of SVG
        const rect = svg.getBoundingClientRect();
        // Calculating x coordinate of the clicked point inside SVG
        // (Real mouse coordiantes - Left side of the SVG (distance between frame and left of screen))
        const mouseX = event.clientX - rect.left;
        // Distance from the pivot(center)
        const distance = mouseX - 400;
    
        // CIRCLE CREATION PART
        const weight = measures.nextWeight;
        const radius = 10 + (weight * 2); 
        const randomColor = getRandomColor(); 
        //C
        
        // Creating circle
    
        const { wholeCircle, shine, label, fallingGroup } = createCompleteCircle(mouseX, GHOST_CY, radius, randomColor, weight)
    
    const targetY = getPlankY(distance)-radius;
    
    (function fallingAnimation(circle, shine, label, targetY){
        let velocity = 0;
        let currentY = GHOST_CY     // başlangıç noktası GHOST_CY(250)
        const gravity = 0.5;
        const fallingSteps = () => {
            currentY += velocity;
            
            circle.setAttribute("cy",currentY)
            shine.setAttribute("cy",currentY - (radius * 0.4))
            label.setAttribute("y",currentY + 5)
    
            velocity += gravity;
    
            if (currentY + velocity < targetY) {
                requestAnimationFrame(fallingSteps); // contnue fallingSteps
            }
            else {
                // Koordinatları seesawGroup'a göre sıfırlıyoruz. Topu artık mouse  click yaptığımız yere yani pivottan distance kadar uzaklığa yerleştiriyoruz.
    
    
                // Calculate the angular deviation caused by rotation of the seesaw group element.
                const angleRadian = measures.currentAngle * (Math.PI / 180);
                const adjustedDistance = distance / Math.cos(angleRadian);
                const localCX = 400 + adjustedDistance;
                const localCY = 450 - radius; // Kalasın üst yüzeyi
                
               // placedBalls.push({weight: weight, distance: distance ,color: randomColor})
                placedBalls.push({weight: weight, distance: distance ,color: randomColor, localCX:localCX, localCY:localCY, radius:radius})
    
                circle.setAttribute("cx", localCX);
                circle.setAttribute("cy", localCY);
                
                shine.setAttribute("cx", localCX - (radius * 0.4));
                shine.setAttribute("cy", localCY - (radius * 0.4));
                
                label.setAttribute("x", localCX);
                label.setAttribute("y", localCY + 5);
    
    
                seesawGroup.appendChild(fallingGroup);  // yamultuyor
                
                updatePlankPosition();
             
                playLandingSound(weight)
                updatePanelsDOM();
            }
        }
        requestAnimationFrame(fallingSteps); // starts fallingSteps
    })(wholeCircle, shine, label, targetY)
    
       // After the ball is created determine the next weight and update the ghost.
       measures.nextWeight = getRandomWeight();
       updateGhost(mouseX, measures.nextWeight);
    }




// Click on plank
plank.addEventListener('click', plankClickHandler);

///////////////// DOM SECTION
function updatePanelsDOM() {
    document.getElementById("angle-value").textContent = measures.currentAngle.toFixed(1); 
    document.getElementById("left-weight-value").textContent = measures.weights.left; 
    document.getElementById("right-weight-value").textContent = measures.weights.right; 
    document.getElementById("left-torque-value").textContent = measures.torques.left.toFixed(1); 
    document.getElementById("right-torque-value").textContent = measures.torques.right.toFixed(1); 
}

/// LOCAL STORAGE



function saveStateToLocalStorage() {
    const state = {
        placedBalls: placedBalls,
        measures: measures,
    };
    localStorage.setItem("savedState", JSON.stringify(state));
}


function loadStateFromLocalStorage() {
    const savedState = localStorage.getItem("savedState");
    if (savedState) {
        const state = JSON.parse(savedState);
        
        placedBalls = state.placedBalls
        measures = state.measures
        
        // Updat UI
        uploadBalls();
        updatePanelsDOM()
        rotatePlank();

    }           
}            


function uploadBalls() {
    placedBalls.map(ball => {
            const  {wholeCircle, shine, label, fallingGroup} = createCompleteCircle(ball.localCX,ball.localCY, ball.radius, ball.color, ball.weight) 
            wholeCircle.setAttribute("cx", ball.localCX);
            wholeCircle.setAttribute("cy", ball.localCY);
            shine.setAttribute("cx", ball.localCX - (ball.radius * 0.4));
            shine.setAttribute("cy", ball.localCY - (ball.radius * 0.4));
            label.setAttribute("x", ball.localCX);
            label.setAttribute("y", ball.localCY + 5);
            
            seesawGroup.appendChild(fallingGroup);       
        }
    ) 

}

document.getElementById("reset").addEventListener("click", resetState);

function resetSvg() {
    seesawGroup.innerHTML = "";
    const plank = createPlank();
    seesawGroup.appendChild(plank);
    plank.addEventListener("click", plankClickHandler);
}
function resetState() {

    resetSvg()

    placedBalls = [];
    measures = {
        torques: {
            right: 0,
            left: 0
        },
        weights: {
            right: 0,
            left: 0
        },
        currentAngle: 0, 
        nextWeight: getRandomWeight()
    }

    updatePanelsDOM();
    rotatePlank();
}


function createPlank() {
    const plank = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    plank.setAttribute("id", "plank");
    plank.setAttribute("x", 200);
    plank.setAttribute("y", 440);
    plank.setAttribute("width", 400);
    plank.setAttribute("height", 10);
    plank.setAttribute("fill", "#e67e22");
    plank.setAttribute("rx", 5);

    return plank;
}
