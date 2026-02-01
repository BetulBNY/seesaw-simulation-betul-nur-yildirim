import { measures, placedBalls, setPlacedBalls, setMeasures, logs, setLogs, isPaused, setPause } from "./config.js";
import { uploadBalls } from "./svg-factory.js";
import { updatePanelsDOM, addNewLog } from "./dom-access.js";
import { rotatePlank } from "./animation.js";
import { pauseHandler } from "./user-actions-handler.js";

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
        setLogs(state.logs);  // save to lcoalstorage
        
        setPause(!state.isPaused);
        //console.log(state.isPaused)

        pauseHandler()
        // Updat UI
        uploadBalls(placedBalls);
        updatePanelsDOM()
        rotatePlank(measures.currentAngle);

        console.log(logs,"loglar yüklendi");
        for (let log of logs){
            addNewLog(log.distanceToPlankCenter, log.weight)
        }
    }           
}           
