/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import Rect, { GeomRect } from 'tinymce/core/api/geom/Rect';
import { Position, Object } from '../api/Api';
import { console, document, HTMLElement, ClientRect } from '@ephox/dom-globals';
import { secretYSauce } from './Ball';


export interface PaddleConstructor {
    new (editor: Editor): Paddle;
}

class Paddle {
    element: HTMLElement;
    position: Position;
    width: number;
    height: number;
    isTouching: boolean;
    step: number;
    dimensions: ClientRect;
    rect: GeomRect | null;

    constructor (editor: Editor) {
        const paddle = document.createElement('span');
        paddle.classList.add('tinymce-games-paddle');
        editor.getBody().appendChild(paddle),
        this.element = paddle;
        // dimensions coming from the DOM element size
        this.dimensions = paddle.getBoundingClientRect();
        this.position = {
            offsetTop: paddle.offsetTop - secretYSauce,
            offsetLeft: paddle.offsetLeft,
        };
        this.width = paddle.offsetWidth;
        this.height = paddle.offsetHeight;
        this.isTouching = false;
        // the larger it is, the faster the paddle is
        this.step = 35;
    }

    private shouldBounce(): boolean {
        return !this.isTouching;
    }

    public moveTo (top: number, left: number): HTMLElement {
        this.position.offsetTop = top;
        this.position.offsetLeft = left;
        this.element.setAttribute("style", `top: ${top}px; left: ${left}px;`);
        return this.element;
    }

    public moveLeft (): HTMLElement {
        const { offsetLeft } = this.position;
        this.position.offsetLeft = offsetLeft - this.step;
        this.element.style.transform= `translateX(${this.position.offsetLeft}px)`;
        return this.element;
    }

    public moveRight (): HTMLElement {
        const { offsetLeft } = this.position;
        this.position.offsetLeft = offsetLeft + this.step;
        this.element.style.transform = `translateX(${this.position.offsetLeft}px)`;
        return this.element;
    }

    public checkCollision2 (ball: Object): boolean {
        const paddleRect = Rect.fromClientRect(this.element.getBoundingClientRect());
        const ballRect = Rect.fromClientRect(ball.element.getBoundingClientRect());
        const isTouching = Rect.intersect(ballRect, paddleRect);

        if (!this.rect && isTouching) {
            console.log('first time toucjing',  isTouching);
            this.rect = isTouching;
            ball.bounce();
            return true;
        }

        if (isTouching && this.rect.y !== isTouching.y) {

            console.log('isTouching',  isTouching);
            ball.bounce();

            return true;
        }

        this.rect = isTouching;
        
        return !!isTouching;
    }

    public checkCollision (ball: Object): boolean {
        // trying to debounce. 
        const b = {
            top: ball.position.offsetTop,
            right: ball.position.offsetLeft + ball.width,
            bottom: ball.position.offsetTop + ball.height,
            left: ball.position.offsetLeft,
        }
        // console.log('paddle', ball);
        const {offsetTop, offsetLeft} = this.position;
        
        let isTouching = false;

        const betweenSides = b.left > offsetLeft && b.right < offsetLeft + this.width;

        const touchTopToBottom = b.bottom > offsetTop && b.top < offsetTop;

        // it should be game over if it touches bottom
        const touchBottomUp = b.top > offsetTop && b.top < (offsetTop + this.height);
        // console.log('top', touchTop, 'bottom', touchBottom, b.top, b.bottom, offsetTop, offsetTop + this.height);
        
        // ball touches rectangle vertically
        if ( betweenSides && (touchTopToBottom || touchBottomUp) ){
            isTouching = true;
            console.log('isTouching?', touchTopToBottom, touchBottomUp);
        }
        this.isTouching = isTouching;

        if (isTouching) {
            console.log('isTouching',  isTouching && this.shouldBounce());
            ball.bounce();
        }
        
        // this.moveTo(y - dy, x + dx);

        return isTouching;
    }
}  

export default Paddle;