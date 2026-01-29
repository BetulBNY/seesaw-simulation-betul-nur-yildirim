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


// Click on plank
plank.addEventListener('click', function(event) {

// LOCATION PART
    // Screen position of SVG
    const rect = svg.getBoundingClientRect();
    console.log("SVG's screen location:", rect);

    // Calculating x coordinate of the clicked point inside SVG
    // (Real mouse coordiantes - Left side of the SVG (distance between frame and left of screen))
    const mouseX = event.clientX - rect.left;
    console.log("SVG left:", rect.left);
    console.log("Mouse click coordinates:", event.clientX);

    // Distance from the pivot(center)
    const distance = mouseX - 400;

    console.log("X inside SVG:", mouseX.toFixed(0));
    console.log("Distance from center:", distance.toFixed(0));

    if (distance < 0) {
        console.log("Clicked Left Side!");
    } else {
        console.log("Clicked Right Side!");
    }

// CIRCLE CREATION PART
    const weight = getRandomWeight();
    const radius = 10 + (weight * 2); 
    const randomColor = getRandomColor(); 

    // Group for weight text, circle and shine effect
    const weightCircleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Creating circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute("cx", mouseX);          
    circle.setAttribute("cy", 440 - radius);     // Right above the plank
    circle.setAttribute("r", radius);           
    circle.setAttribute("fill", randomColor); 
    circle.setAttribute("stroke", "rgba(0,0,0,0.2)"); 
    circle.setAttribute("stroke-width", "1");

    // Shine effect
    const shine = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // Shining circle added to upper left
    shine.setAttribute("cx", mouseX - (radius * 0.4)); 
    shine.setAttribute("cy", (440 - radius - 1) - (radius * 0.4));
    shine.setAttribute("r", radius * 0.2); 
    shine.setAttribute("fill", "rgba(255, 255, 255, 0.6)"); 

    // Weight Txt
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", mouseX);
    label.setAttribute("y", 440 - radius +5); 
    label.setAttribute("text-anchor", "middle"); // Center horizontally
    label.setAttribute("fill", "white");
    label.setAttribute("font-size", "12px");
    label.setAttribute("font-family", "Arial");
    label.setAttribute("font-weight", "bold");
    label.setAttribute("font-size", (10 + weight) + "px"); 
    label.textContent = weight + "kg";

    // Added to "g" seesawGroup for moving together.
    weightCircleGroup.appendChild(circle);
    weightCircleGroup.appendChild(shine);
    weightCircleGroup.appendChild(label);

    // Adding all of them to the main seesaw group.
    seesawGroup.appendChild(weightCircleGroup);


    console.log(`${weight} kg ağırlığında bir top eklendi. Uzaklık: ${distance.toFixed(0)}`);

});

