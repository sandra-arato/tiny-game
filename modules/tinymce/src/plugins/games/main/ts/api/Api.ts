/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { HTMLElement } from '@ephox/dom-globals';
import Obstacles from '../core/Obstacles';
import Ball from '../core/Ball';
import Paddle from '../core/Paddle';

// I could improve naming here...
// the idea is that anyone can extend
// an object that can act as a character
// within the game
export type Object = {
    element: HTMLElement,
    [key: string]: any,
};

export interface GamesApi {
    obstacles: Obstacles | null;
    ball?: Ball;
    paddle?: Paddle;
    isRunning: boolean;
    score: number | null;
    timeout: number;
    runner?: any;
    gameOver: boolean;
}

const get = (): GamesApi => {
  return {
    obstacles: null,
    isRunning: false,
    score: 0,
    timeout: 60 * 1000, // To-do: make this an option
    gameOver: false,
  };
};

export default {
  get
};