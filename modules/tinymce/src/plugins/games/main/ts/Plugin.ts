/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import Commands from './api/Commands';
import Buttons from './ui/Buttons';
import Engine from './core/Engine';
import Api from './api/Api';

export default function () {
  PluginManager.add('games', function (editor) {
    const api = Api.get();
    Commands.register(editor, api);
    Buttons.register(editor);
    Engine.setup(editor, api);
    editor.addShortcut('ctrl+P', '', 'mcePlay');
  });
}
