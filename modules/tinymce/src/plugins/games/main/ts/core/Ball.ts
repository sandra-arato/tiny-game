/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { Position } from '../api/Api';
import { console, document, HTMLElement } from '@ephox/dom-globals';


export interface BallConstructor {
    new (editor: Editor): Ball;
}

type Direction = {
    dx: number,
    dy: number,
}

type Coordinates = {
    x: number,
    y: number,
}

type Walls = {
    top: number,
    right: number,
    bottom: number,
    left: number,
};

// some hidden elements in the editor?
// couldn't figure this one out
export const secretYSauce = 65;

class Ball {
    element: HTMLElement;
    position: Position;
    width: number;
    height: number;
    radius: number;
    direction: Direction;
    coordinates: Coordinates;
    walls: Walls;

    constructor (editor: Editor) {
        const bouncingBall = document.createElement('span');
        bouncingBall.classList.add('tinymce-games-ball');
        editor.getBody().appendChild(bouncingBall),
        this.element = bouncingBall;
        // dimensions coming from the DOM element size
        
        const dimension = bouncingBall.getBoundingClientRect();
        console.log(dimension);
        this.position = {
            offsetTop: dimension.top - secretYSauce,
            offsetLeft: dimension.left,
        };
        this.coordinates = {
            x: 0,
            y: 0,
        };
        this.width = bouncingBall.offsetWidth;
        this.height = bouncingBall.offsetHeight;
        this.radius = this.width / 2;
        // this can come from options later
        this.direction = {
            dx: 2,
            dy: 1.5,
        };
        // console.log('off', this.position.offsetTop);
        this.setBoundaries(editor);
    }

    private setBoundaries (editor: Editor): Ball {
        // checking boundaries based on iframe dimensions
        const bodyHeight = editor.iframeElement.offsetHeight;
        const bodyWidth = editor.iframeElement.offsetWidth;

        this.walls = {
            top: 0,
            right: bodyWidth - this.radius,
            bottom: bodyHeight - this.height,
            left: 0,
        };

        return this;
    }
    
    public setDirection (dx: number, dy: number): Ball {
        this.direction = {
            dx, dy
        };
        return this;
    }

    public getDirection (): Direction {
        return this.direction;
    }

    public bounce (): Ball {
        const { x, y } = this.coordinates;
        const { dx, dy } = this.direction;

        // the only issue is, if the ball touches
        // 2 obstacles at once, it continues in 
        // the original direction To-do: fix later
        this.setDirection(dx, -dy);
        this.moveTo(y - dy, x + dx);
        return this;
    }

    public moveTo (top: number, left: number): HTMLElement {
        this.coordinates.y = top;
        this.coordinates.x = left;
        this.element.style.transform = `translate(${left}px, ${top}px)`;
        return this.element;
    }

    public checkCollision (): Ball {
        const { dx, dy } = this.direction;
        const { x, y } = this.coordinates;
        const { top, right, bottom, left } = this.walls;
        const d = this.element.getBoundingClientRect();
        // check if leaving top or bottom
        if (d.top - dy > bottom || d.top - dy < top) {
            this.setDirection(dx, -dy);
        }

        // check if leaving left or right
        if(d.left + dx > right || d.left + dx < left) {
            this.setDirection(-dx, dy);
        }

        this.moveTo(y - dy, x + dx);
        return this;
    }
}  

export default Ball;