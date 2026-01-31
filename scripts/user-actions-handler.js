const seesawGroup = document.getElementById('seesaw-group');
const svg = document.getElementById('sim-svg');
resetSeesaw()

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


let placedBalls = [];// Yerleşen topların listesi {weight, distance} Artık her düşen topun ağırlığını ve mesafesini bu listede tutuyoruz. Dengeyi bu listeye bakarak hesaplıyoruz.
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
        // Creating circle
        const { wholeCircle, shine, label, fallingGroup } = createCompleteCircle(mouseX, GHOST_CY, radius, randomColor, weight)
    
    const targetY = getPlankY(distance)-radius;
    
    (function fallingAnimation(wholeCircle, shine, label, targetY){
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
                // Koordinatları seesawGroup'a göre sıfırlıyoruz. Topu artık mouse  click yaptığımız yere yani pivottan distance kadar uzaklığa yerleştiriyoruz.
    
    
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
    })(wholeCircle, shine, label, targetY)
    
       // After the ball is created determine the next weight and update the ghost.
       measures.nextWeight = getRandomWeight();
       updateGhost(mouseX, measures.nextWeight);
    }




// Click on plank
//plank.addEventListener('click', plankClickHandler);

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
        uploadBalls(placedBalls);
        updatePanelsDOM()
        rotatePlank(measures.currentAngle);

    }           
}            


document.getElementById("reset").addEventListener("click", resetState);

function resetState() {

    resetSeesaw()

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
    rotatePlank(measures.currentAngle);
}


