import { getRandomWeight } from "./calculations.js";

export const PLANKSTART = 200;
export const PLANKEND= 600;
export const GHOST_CY = 250;
export const MAX_ANGLE = 30;

// List of colors
export const colors = ["#ff5733", "#33ff57", "#3357ff", "#f39c12", "#8e44ad", "#1abc9c", "#e84393", "#f1c40f"];


export let placedBalls = [];// Yerleşen topların listesi {weight, distance} Artık her düşen topun ağırlığını ve mesafesini bu listede tutuyoruz. Dengeyi bu listeye bakarak hesaplıyoruz.
export let measures = {
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


