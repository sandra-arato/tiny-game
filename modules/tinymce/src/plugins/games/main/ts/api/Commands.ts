/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */
import { console } from '@ephox/dom-globals';
import Editor from 'tinymce/core/api/Editor';
import Env from 'tinymce/core/api/Env';
import { GamesApi } from './Api';
import Engine from '../core/Engine';

const register = function (editor: Editor, api: GamesApi) {
  editor.addCommand('mcePlay', function () {
    // tslint:disable-next-line:no-console
    if (Env.ie && Env.ie <= 9) {
      console.log('fallback to setInterval')
    } else {
      Engine.play(api);
    }
  });
};

export default {
  register
};
