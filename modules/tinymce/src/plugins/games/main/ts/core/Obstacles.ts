/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import Delay from 'tinymce/core/api/util/Delay';
import Rect, { GeomRect } from 'tinymce/core/api/geom/Rect';
import { GamesApi, Object } from '../api/Api';
import Collision from './Collision';
import Events from '../api/Events';
import { HTMLElement,  document, Node } from '@ephox/dom-globals';

export type Obstacle = {
    element: HTMLElement,
    score: null | number,
    rect: GeomRect,
    onCollision?: () => void,
    active: boolean,
};

export type  ObstaclesConstructor = new (editor: Editor, api: GamesApi) => Obstacles;

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
};

class Obstacles {
    public editor: Editor;
    public api: GamesApi;
    public options: Options;
    public items: Array<Obstacle>;
    public collisions: Set<Collision>;

    constructor (editor: Editor, api: GamesApi, options?: Options) {
        this.editor = editor;
        this.api = api;
        this.options = options || defaultOptions;
        this.collisions = new Set();
        this.items = [];
        this.init();
        /*
            To-do: To make things faster for the rendering, I'd possibly
            move this into to a web worker.
            Which is a little trickier than I thought in TS/webpack...
        */
    }

    // removing styles by default
    public init () {
        const obstacles = [];
        // taking only the first paragraph for POC
        const paragraph = <HTMLElement> this.editor.dom.select('p')[0];

        if (paragraph) {
            const blocks = paragraph.innerText.split(' ') || [];
            const localObstacles = [];
            let newContent = '';

            // breaking up the paragraph to words as obstacles
            for (let i = 0; i < blocks.length; i++) {
                // value could be set based on an api passed in score funtion
                const score = blocks[i].length * randomScalingNumber - randomBaseNumber;
                newContent = newContent + `<span data-score=${score}>${blocks[i]} </span>`;
                localObstacles.push({
                    score,
                });
            }
            this.editor.setContent(newContent);

            // need to run the obstacle setup once all DOM
            // elements have been rendered in the editor
            Delay.setEditorTimeout(this.editor, () => {
                const paragraph = <HTMLElement> this.editor.getBody().firstChild;
                for (let j = 0; j < blocks.length; j++) {
                    const element = <HTMLElement> paragraph.children[j];
                    const rect = Rect.fromClientRect(element.getBoundingClientRect());
                    obstacles.push({
                        element,
                        score: localObstacles[j].score,
                        rect,
                        active: true,
                    });
                }
            }, 0);
        }
        this.items = obstacles;
        return this;
    }

    // keeping the styles
    // this is NOT STABLE atm
    public init2() {
        const content = <HTMLElement[]> this.editor.dom.select('body > *');

        for (let i = 0; i < content.length; i++) {
            const block = content[i];

            if (block.childElementCount) {
                let j = 0;
                do {
                    const current = block.childNodes[j];
                    if (current.nodeName === '#text') {
                        this.breakLineToBricks(current);
                    } else if (current.childNodes.length > 0 ) {
                        this.addScoreToDomElement(current);
                    }
                    j++;
                } while (block.childNodes[j]);
            } else {
                // even if there are no children,
                // we need to break up long lines
                if (block.nodeName !== '#text') {
                    this.addScoreToDomElement(block);
                }
            }
        }
    }

    public checkCollision (ball: Object): boolean {
        const ballRect = Rect.fromClientRect(ball.element.getBoundingClientRect());
        // running a collision check on each of the obstacles
        const checkEachItem = this.items.map((i) => this.isTouching(ballRect, i));
        // if any of the items is touching, that'll return true
        // so the every outcome will be false, which we negate
        const collision = !checkEachItem.every((x) => !x);
        // if any item returns true, collision will be true
        return collision;
    }

    private breakLineToBricks (element: Node): Obstacles {
        // blocks represent a text node containing words
        const blocks = element.textContent.trim().split(' ') || [];
        // this is where we'll store the 'bricks'
        const obstacles = this.items;
        const newElement = document.createElement('span');
        this.editor.dom.replace(newElement, element);
        // breaking up the paragraph to words as obstacles
        for (let i = 0; i < blocks.length; i++) {
            // value could be set based on an api passed in score funtion
            const score = blocks[i].length * randomScalingNumber - randomBaseNumber;
            // element is the new 'brick' to break out
            const element = document.createElement('span');
            element.innerHTML = `${blocks[i]} `;
            element.setAttribute('data-score', `${score}`);
            newElement.appendChild(element);
            const rect = Rect.fromClientRect(element.getBoundingClientRect());
            // these are the items we are watching during the game
            obstacles.push({
                element,
                score,
                rect,
                active: true,
            });
        }

        this.editor.dom.remove(newElement, true);
        return this;
    }

    private addScoreToDomElement(element): Obstacles {
        if (element.innerText.includes(' ')) {
            return this.breakLineToBricks(element);
        }

        const rect = Rect.fromClientRect(element.getBoundingClientRect());
        const obstacles = this.items;
        const score = Math.floor(rect.w) * randomScalingNumber - randomBaseNumber;
        element.setAttribute('data-score', `${score}`);
        // these are the items we are watching during the game
        obstacles.push({
            element,
            score,
            rect,
            active: true,
        });
        return this;
    }

    private isTouching (ballRect, item): boolean {
        // don't want to do anything if it's already inactive / hidden
        if (!item.active) {
            return false;
        }
        const isTouching = Rect.intersect(ballRect, item.rect);

        if (isTouching) {
            const collision = new Collision(this.api.ball, item);
            this.collisions.add(collision);
            // to-do: make this through a setter
            this.api.score = this.api.score + item.score;
            Events.fireGamesCollision(this.editor, this.api);
            return true;
        }

        return false;
    }

}

export default Obstacles;