/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import Delay from 'tinymce/core/api/util/Delay';
import Rect from 'tinymce/core/api/geom/Rect';
import { GamesApi, Position, Object } from '../api/Api';
import Ball from './Ball';
import Events from '../api/Events';
import { console, HTMLElement } from '@ephox/dom-globals';

export type Obstacle = {
    element: HTMLElement,
    score: null | number,
    width: number,
    height: number,
    position: Position,
    onCollision?: () => void,
    active: boolean,
}

export interface ObstaclesConstructor {
    new (editor: Editor, api: GamesApi): Obstacles;
}

// setting Options to pass in different
// behaviour for the obstacles
type Options = {
    scoreRule: (x: number) => void
};

const randomScalingNumber = 59;
const randomBaseNumber = 35;

const defaultOptions = {
    scoreRule: (x: number) => {
        return (x * randomScalingNumber - randomBaseNumber);
    }
}

type Direction = {
    dx: number,
    dy: number,
}

class Collision {
    items: [Ball, Obstacle];
    direction: Direction;

    constructor (object: Ball, obstacle: Obstacle) {
        this.items = [object, obstacle];
        this.init();
    }

    init () {
        const ball = this.items[0];
        const obstacle = this.items[1];
        this.direction = {
            ...ball.direction
        };
        obstacle.active = false;
        obstacle.element.style.visibility = 'hidden';
        ball.bounce();
        return this;
    }

    getItems () {
        return this.items;
    }

    getPosition () {

    }

}

class Obstacles {
    editor: Editor;
    api: GamesApi;
    options: Options;
    items: Array<Obstacle>;
    collisions: Set<Collision>;

    constructor (editor: Editor, api: GamesApi, options?: Options) {
        this.editor = editor;
        this.api = api;
        this.init(editor, api);
        this.options = options || defaultOptions;
        this.collisions = new Set();
        /* 
            To-do: To make things faster for the rendering, I'd possibly
            move the checkCollision to a web worker. 
            Which is a little trickier than I thought in TS/webpack...
        */
    }

    public init (editor: Editor, api: GamesApi) {
        const obstacles = [];
        // taking first paragraph for POC
        const paragraph = <HTMLElement>editor.dom.select('p')[0];

        if (paragraph) {
            const blocks = paragraph.innerText.split(' ') || [];
            const localObstacles = [];
            let newContent = '';

            for (let i = 0; i < blocks.length; i++) {
                // value could be set based on an api passed in score funtion
                const score = blocks[i].length * randomScalingNumber - randomBaseNumber;
                newContent = newContent + `<span data-score=${score}>${blocks[i]} </span>`;
                localObstacles.push({
                    score,
                });
            }
            editor.setContent(newContent);

            // need to run the obstacle setup once all DOM
            // elements have been rendered in the editor
            Delay.setEditorTimeout(editor, () => {
                const paragraph = <HTMLElement> editor.getBody().firstChild;
                for (let j = 0; j < blocks.length; j++) {
                    const element = <HTMLElement> paragraph.children[j];
                    const rect = Rect.fromClientRect(element.getBoundingClientRect());
                    obstacles.push({
                        element: element,
                        score: localObstacles[j].score,
                        rect: rect,
                        active: true,
                    });
                }
            }, 0);
        }
        this.items = obstacles;
        const score = api.score;
        console.log(score);
        return this;
    }

    private isTouching (ballRect, item): boolean {
        // don't want to do anything if it's already inactive
        if (!item.active) {
            return false;
        }
        const isTouching = Rect.intersect(ballRect, item.rect);

        if (isTouching) {
            const collision = new Collision(this.api.ball, item);
            this.collisions.add(collision);
            this.api.score = this.api.score + item.score;
            Events.fireGamesCollision(this.editor, this.api);
            return true;
        }

        return false;

    }

    public checkCollision (ball: Object): boolean {
        const ballRect = Rect.fromClientRect(ball.element.getBoundingClientRect());
        const checkEachItem = this.items.map((i) => this.isTouching(ballRect, i));
        // if any of the items is touching, that'll be true
        // so the every outcome will be false, which we negate
        const collision = !checkEachItem.every(x => !x);

        return collision;
    }
}  

export default Obstacles;