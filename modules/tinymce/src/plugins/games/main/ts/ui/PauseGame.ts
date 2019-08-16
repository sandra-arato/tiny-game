/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import Engine from '../core/Engine';
import { GamesApi } from '../api/Api';

const open = (editor: Editor, api: GamesApi) => {
  editor.windowManager.open({
    title: `You clicked the editor`,
    body: {
      type: 'panel',
      items: [
        {
          type: 'htmlpanel', // component type
          html:
          `<div>
            <p>You paused the game. What would you like to do now?</p>
          </div>`
        },
      ]
    },
    buttons: [
      {
        type: 'submit',
        name: 'restart',
        text: 'Restart',
        primary: false
      },
      {
        type: 'cancel',
        name: 'resume',
        text: 'Resume',
        primary: true
      }
    ],
    onCancel: () => {
        Engine.play(editor, api);
    },
    onSubmit: (dialogApi) => {
        Engine.restart(editor, api);
        dialogApi.close();
    }

  });
};

export default {
  open
};