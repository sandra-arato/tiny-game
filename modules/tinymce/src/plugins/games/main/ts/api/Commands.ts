/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */
import Editor from 'tinymce/core/api/Editor';
import Env from 'tinymce/core/api/Env';
import { GamesApi } from './Api';
import Engine from '../core/Engine';

const register = function (editor: Editor, api: GamesApi) {
  editor.addCommand('mcePlay', function () {
    if (Env.ie && Env.ie <= 9) {
      // will need to come up with a fallback
      // or get Delays.cancelAF into Tiny
    } else {
      if (api.isRunning) {
        // pause
        Engine.pause(editor, api);
      } else {
        Engine.play(editor, api);
      }
    }
  });
};

export default {
  register
};
