export function saveStateToLocalStorage() {
    const state = {
        placedBalls: placedBalls,
        measures: measures,
    };
    localStorage.setItem("savedState", JSON.stringify(state));
}


export function loadStateFromLocalStorage() {
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