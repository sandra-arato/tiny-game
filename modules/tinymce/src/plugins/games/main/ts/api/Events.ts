/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { GamesApi } from './Api';

const fireGamesCollision = (editor: Editor, api: GamesApi) => {
  editor.fire('gamesCollision', {
    collision: {
      items: api.collision.getItems(),
      position: api.collision.getPosition(),
    }
  });
};

export default {
  fireGamesCollision
};