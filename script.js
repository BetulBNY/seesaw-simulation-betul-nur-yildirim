const plank = document.getElementById('plank');
const seesawGroup = document.getElementById('seesaw-group');
const svg = document.getElementById('sim-svg');

// Click on plank
plank.addEventListener('click', function(event) {
    
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
});