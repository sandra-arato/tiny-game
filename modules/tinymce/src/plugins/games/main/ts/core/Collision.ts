/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Ball from './Ball';
import { HTMLElement } from '@ephox/dom-globals';

export type Obstacle = {
    element: HTMLElement,
    score: null | number,
    width: number,
    height: number,
    onCollision?: () => void,
    active: boolean,
};

type Direction = {
    dx: number,
    dy: number,
};

class Collision {
    public items: [Ball, Obstacle];
    public direction: Direction;

    constructor (object: Ball, obstacle: Obstacle) {
        this.items = [object, obstacle];
        this.init();
    }

    public init (): Collision {
        const ball = this.items[0];
        const obstacle = this.items[1];
        this.direction = {
            ...ball.direction
        };
        obstacle.active = false;
        obstacle.element.style.opacity = '0';
        ball.bounce();
        return this;
    }

    public getItems (): [Ball, Obstacle] {
        return this.items;
    }
}

export default Collision;
