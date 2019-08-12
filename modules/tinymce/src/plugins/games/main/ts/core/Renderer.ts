/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { GamesApi } from '../api/Api';
import { console, window } from '@ephox/dom-globals';

// To-do: rethink this whole setup
let start = null;

const reset = () => {
    start = null;
    return start;
};

// To-do: fix pause, not working ATM
const pause = (api: GamesApi) => {
    // To-do: write PR for Delays.cancelAF
    // console.log(api.runner);
    return window.cancelAnimationFrame(api.runner);
}

const run = (api: GamesApi) => {
    // in case we'll run the games with another object
    if (api.ball) {
        
        // collision detection and move for each frame
        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            api.paddle.checkCollision2(api.ball);
            api.obstacles.checkCollision(api.ball);
            api.ball.checkCollision();

            if (progress < api.timeout) {
                api.runner = window.requestAnimationFrame(step);
                // to-do: add time counter somewhere
            }
        }
        api.runner = window.requestAnimationFrame(step);
    }
    return api;
};

export default {
    run,
    pause,
    reset,
};