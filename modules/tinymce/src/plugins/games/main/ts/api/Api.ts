/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';

export type ItemsGetter = () => Array<any>;
export type PositionGetter = () => Position;

type Position = {
    offset: {
        top: number,
        left: number
    };
}

interface CollisionGetters {
    getItems: ItemsGetter;
    getPosition: PositionGetter;
}

export interface GamesApi {
    collision: CollisionGetters;
}

const getCollidingItems = (editor: Editor): ItemsGetter => {
    return () => ['foo', 'bar'];
};

const getCollisionLocation = (editor: Editor): PositionGetter => {
    const test: Position = {
        offset: {
            top: 0,
            left: 0,
        }
    };
    return () => test;
};

const get = (editor: Editor): GamesApi => {
    return {
      collision: {
        getItems: getCollidingItems(editor),
        getPosition: getCollisionLocation(editor),
      },
    };
  };

export {
get
};


  