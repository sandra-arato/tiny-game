/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { GamesApi } from '../api/Api';
import Events from '../api/Events';
import Renderer from './Renderer';
import Ball from './Ball';
import Obstacles from './Obstacles';
import Paddle from './Paddle';
import Dialog from '../ui/Dialog';
import PauseGame from '../ui/PauseGame';

const notifyCollision = (editor: Editor, api: GamesApi) => {
  Events.fireGamesCollision(editor, api);
};

const notifyGameOver = (editor: Editor, api: GamesApi, msg: string) => {
  Events.fireGameOver(editor, api, msg);
};

const init = (editor: Editor, api: GamesApi) => {
  api.obstacles = new Obstacles(editor, api);
  api.ball = new Ball(editor);
  api.paddle = new Paddle(editor, api);

  editor.shortcuts.add('37+meta', 'left', () => {
    api.paddle.moveLeft();
  });
  editor.shortcuts.add('39+meta', 'right', () => {
    api.paddle.moveRight();
  });

  return { editor, api };
};

const play = (editor: Editor, api: GamesApi) => {
  api.isRunning = true;
  Renderer.run(editor, api);
};

const pause = (editor: Editor, api: GamesApi) => {
  api.isRunning = false;
  Renderer.pause(editor, api);
};

const setup = (editor: Editor, api: GamesApi) => {
  editor.on('gamesCollision', (e) => {
    editor.fire('wordCountUpdate', {
      wordCount: {
        words: e.words,
        characters: e.score,
        charactersWithoutSpaces: 0,
      }
    });
  });

  editor.on('gameOver', (e) => {
    // stop the game if it's still running
    if (api.isRunning) {
      pause(editor, api);
      Dialog.open(editor, api, e.msg);
    }
  });

  editor.on('click', () => {
    if (api.isRunning) {
      pause(editor, api);
      PauseGame.open(editor, api);
    }
  });
};

const restart = (editor: Editor, api: GamesApi) => {
  pause(editor, api);
  delete api.ball;
  delete api.obstacles;
  delete api.paddle;
  editor.setContent(editor.startContent);
};

export default {
  setup,
  init,
  play,
  pause,
  restart,
  notifyCollision,
  notifyGameOver,
};