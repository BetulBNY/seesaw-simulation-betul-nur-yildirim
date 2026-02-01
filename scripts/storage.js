import { measures, placedBalls, setPlacedBalls, setMeasures } from "./config.js";
import { uploadBalls } from "./svg-factory.js";
import { updatePanelsDOM } from "./dom-access.js";
import { rotatePlank } from "./animation.js";


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
        
        setPlacedBalls(state.placedBalls);
        setMeasures(state.measures);

        // Updat UI
        uploadBalls(placedBalls);
        updatePanelsDOM()
        rotatePlank(measures.currentAngle);
    }           
}           
