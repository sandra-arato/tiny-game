/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { GamesApi } from '../api/Api';

const open = (editor: Editor, api: GamesApi, msg: string) => {
  const words = api.obstacles.items.filter((o) => o.active);
  editor.windowManager.open({
    title: `Game Over - ${msg}`,
    body: {
      type: 'panel',
      items: [
        {
          type: 'htmlpanel', // component type
          html:
          `<div>
            <p>Score: ${api.score}</p>
            <p>Words left: ${words.length}</p>
          </div>`
        },
      ]
    },
    buttons: [
      {
        type: 'cancel',
        name: 'close',
        text: 'Close',
        primary: true
      }
    ]
  });
};

export default {
  open
};