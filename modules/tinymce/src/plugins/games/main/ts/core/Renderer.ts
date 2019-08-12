/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { GamesApi } from '../api/Api';
import Events from '../api/Events';
import { window } from '@ephox/dom-globals';

// To-do: rethink this whole setup
let start = null;

const reset = () => {
    start = null;
    return start;
};

const pause = (editor: Editor, api: GamesApi) => {
    // To-do: ask about Delays.cancelAF
    return window.cancelAnimationFrame(api.runner);
};

const run = (editor: Editor, api: GamesApi) => {
    // in case we'll run the games with another object
    if (api.ball) {
        // collision detection and move for each frame
        const step = (timestamp: number) => {
            if (!start)  { start = timestamp; }
            const progress = timestamp - start;
            api.paddle.checkCollision(api.ball);
            api.obstacles.checkCollision(api.ball);
            api.ball.checkCollision();

            if (progress < api.timeout && api.isRunning) {
                // to-do: add time counter somewhere
                // in the game scree to show countdown
                api.runner = window.requestAnimationFrame(step);
            } else if (progress > api.timeout && api.isRunning) {
                pause(editor, api);
                Events.fireGameOver(editor, api, 'Your time is up');
            }
        };
        api.runner = window.requestAnimationFrame(step);
    }
    return api;
};

export default {
    run,
    pause,
    reset,
};