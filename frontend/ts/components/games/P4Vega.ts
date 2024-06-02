import p4Vega from "../../actions/games/p4-Vega/p4-Vega";
import * as Tone from 'tone';

function component() {
    const render = () => {
        return /*html*/`
            <section id="p4-vega" class="p4-vega">
                <h1 class="u-canvas-title">p4-Vega</h1>
                <img id="p4" src="./sprites/p4Vega/p4.png" style="display: none;">
                <img id="water" src="./sprites/p4Vega/water.png" style="display: none;">
                <img id="bhBlue" src="./sprites/p4Vega/bhBlue.png" style="display: none;">
                <img id="bhRed" src="./sprites/p4Vega/bhRed.png" style="display: none;">
                <img id="bhYellow" src="./sprites/p4Vega/bhYellow.png" style="display: none;">
            </section>   
        `;
    }

    const action = async () => {
        await p4Vega();

        // Setup and play the background music using Tone.js
        const player = new Tone.Player({
            url: "./assets/audio/bg-sound-p4.mp3",
            loop: true,
            autostart: true
        }).toDestination();

        await Tone.start();
    }

    return {
        render, 
        action
    }
}

export default component();