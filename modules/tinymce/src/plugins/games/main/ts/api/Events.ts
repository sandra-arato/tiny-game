/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { GamesApi } from './Api';
import { Obstacle } from '../core/Obstacles';

const fireGamesCollision = (editor: Editor, api: GamesApi) => {
  const words = api.obstacles.items.filter((o: Obstacle) => o.active);
  editor.fire('gamesCollision', {
    score: api.score,
    words: words.length,
  });
};

const fireGameOver = (editor: Editor, api: GamesApi, msg: string) => {
  const words = api.obstacles.items.filter((o: Obstacle) => o.active);
  editor.fire('gameOver', {
    score: api.score,
    words: words.length,
    msg,
  });
};

export default {
  fireGamesCollision,
  fireGameOver
};