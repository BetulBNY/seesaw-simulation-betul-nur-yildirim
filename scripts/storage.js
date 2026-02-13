import { measures, placedBalls, setPlacedBalls, setMeasures, logs, setLogs, isPaused, setPause } from "./config.js";
import { uploadBalls } from "./svg-factory.js";
import { updatePanelsDOM, addNewLog, setPauseDom } from "./dom-access.js";
import { rotatePlank } from "./animation.js";

export function saveStateToLocalStorage() {
    const state = {
        placedBalls: placedBalls,
        measures: measures,
        logs: logs,
        isPaused: isPaused
    };
    localStorage.setItem("savedState", JSON.stringify(state));
}

export function loadStateFromLocalStorage() {
    const savedState = localStorage.getItem("savedState");
    if (savedState) {
        const state = JSON.parse(savedState);

        setPlacedBalls(state.placedBalls);
        setMeasures(state.measures);
        setLogs(state.logs);  // save to local storage
        
        setPause(state.isPaused);
        //console.log(state.isPaused)

        setPauseDom(state.isPaused)
        // Update UI
        uploadBalls(placedBalls);
        updatePanelsDOM()
        rotatePlank(measures.currentAngle);

        console.log(logs,"logs loaded");
        
        for (let log of logs){
            addNewLog(log.distanceToPlankCenter, log.weight)
        }   
    }           
}           
