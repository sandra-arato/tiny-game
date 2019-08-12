/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import Rect, { GeomRect } from 'tinymce/core/api/geom/Rect';
import { Object, GamesApi } from '../api/Api';
import Events from '../api/Events';
import { document, HTMLElement, ClientRect } from '@ephox/dom-globals';

export type PaddleConstructor = new (editor: Editor) => Paddle;

class Paddle {
    public api: GamesApi;
    public editor: Editor;
    public element: HTMLElement;
    public isTouching: boolean;
    public step: number;
    public dimensions: ClientRect;
    public position: number;
    public rect: GeomRect | null;

    constructor (editor: Editor, api: GamesApi) {
        this.api = api;
        this.editor = editor;
        const paddle = document.createElement('span');
        paddle.classList.add('tinymce-games-paddle');
        editor.getBody().appendChild(paddle),
        this.element = paddle;
        // dimensions coming from the DOM element size
        this.dimensions = paddle.getBoundingClientRect();
        this.position = 0;
        this.isTouching = false;
        // the larger it is, the faster the paddle is
        this.step = 35;
    }

    public moveLeft (): HTMLElement {
        this.position = this.position - this.step;
        this.element.style.transform = `translateX(${this.position}px)`;
        return this.element;
    }

    public moveRight (): HTMLElement {
        this.position = this.position + this.step;
        this.element.style.transform = `translateX(${this.position}px)`;
        return this.element;
    }

    public checkCollision (ball: Object): boolean {
        const paddleRect = Rect.fromClientRect(this.element.getBoundingClientRect());
        const ballRect = Rect.fromClientRect(ball.element.getBoundingClientRect());
        const isTouching = Rect.intersect(ballRect, paddleRect);

        // ball is below paddle, it's game over
        if (paddleRect.y + paddleRect.h < ballRect.y) {
            if (this.api.isRunning) {
                Events.fireGameOver(this.editor, this.api, 'You lost the ball');
            }
        }

        // only bounce once when rect is not set yet
        if (!this.rect && isTouching) {
            this.rect = isTouching;
            ball.bounce();
            return true;
        }

        // this resets this.rect to null for
        // when the ball is above the paddle
        this.rect = isTouching;
        return !!isTouching;
    }
}

export default Paddle;