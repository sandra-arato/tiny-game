/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { GamesApi } from './Api';
import { console } from '@ephox/dom-globals';

const fireGamesCollision = (editor: Editor, api: GamesApi) => {
  console.log('fire event');
  editor.fire('gamesCollision', {
    collision: {
      items: api.collision.getItems(),
    },
    score: api.score,
  });
};

export default {
  fireGamesCollision
};