/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { HTMLElement } from '@ephox/dom-globals';
import Obstacles from '../core/Obstacles';
import Ball from '../core/Ball';

type ItemsGetter = () => Array<any>;
type PositionGetter = () => Position;

export type Position = {
    offsetTop: number,
    offsetLeft: number
}

// I could improve naming...
// the idea is that anyone can extend
// an object that can act as a character
// within the game
export type Object = {
    element: HTMLElement,
    position: Position,
    [key: string]: any,
}

interface CollisionGetters {
    getItems: ItemsGetter;
    getPosition: PositionGetter;
}

export interface GamesApi {
    collision: CollisionGetters;
    obstacles: Obstacles | null;
    ball?: Ball;
    isRunning: boolean;
    score: number | null;
    timeout: number;
    runner?: (timestamp: number) => void;
    gameOver: boolean;
}

const getCollidingItems = (editor: Editor): ItemsGetter => {
    return () => ['foo', 'bar'];
};

const getCollisionLocation = (editor: Editor): PositionGetter => {
    const test: Position = {
        offsetTop: 0,
        offsetLeft: 0,
    };
    return () => test;
};


// To-do: improve getters and setters.
// rethink whether to just expose an EngineManager instead
// which would manage state as a class level object
const get = (editor: Editor): GamesApi => {
    return {
      collision: {
        getItems: getCollidingItems(editor),
        getPosition: getCollisionLocation(editor),
      },
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


  