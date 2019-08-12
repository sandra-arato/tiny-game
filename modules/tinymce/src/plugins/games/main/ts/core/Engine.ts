/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { GamesApi } from '../api/Api';
import Renderer from './Renderer';
import Ball from './Ball';
import Obstacles from './Obstacles';
import Events from '../api/Events';
import { console } from '@ephox/dom-globals';
import Paddle from './Paddle';

const notifyCollision = (editor: Editor, api: GamesApi) => {
  Events.fireGamesCollision(editor, api);
};

const play = (api: GamesApi) => {
  api.isRunning = true;
  Renderer.run(api);
}

const pause = (api: GamesApi) => {
  api.isRunning = false;
  Renderer.pause(api);
}

const setup = (editor: Editor, api: GamesApi) => {
  editor.on('init', () => {
    console.log(editor);
    api.obstacles = new Obstacles(editor, api);
    api.ball = new Ball(editor);
    api.paddle = new Paddle(editor);
    console.log(editor.shortcuts);
    editor.shortcuts.add('37+meta', 'left', () => {
      api.paddle.moveLeft();
    });
    editor.shortcuts.add('39+meta', 'right', () => {
      api.paddle.moveRight();
  
    })
  });

  editor.on('gamesCollision', (e) => {
    const words = api.obstacles.items.filter(o => o.active);

    editor.fire('wordCountUpdate', {
      wordCount: {
        words: words.length,
        characters: api.score,
        charactersWithoutSpaces: 0,
      }
    });
  });
  

  
};

export default {
  setup,
  play,
  pause,
  notifyCollision,
};