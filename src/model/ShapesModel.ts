import {Graphics} from 'pixi.js';
import {ShapeKind, TypeShape} from '../view/ShapesFactory';

export type ShapeData = {
    shape: Graphics;
    area: number;
    meta: TypeShape;
    velocityY: number;
};

let idCounter = 0;

export class ShapesModel {
    private shapes: ShapeData[] = [];

    generateRandomShape(x?: number, y?: number): TypeShape {
        const type = Math.floor(Math.random() * 7) as ShapeKind;
        const color = Math.floor(Math.random() * 0xffffff);
        const size = 30 + Math.random() * 60;

        return {
            id: idCounter++,
            type,
            color,
            size,
            position: {
                x: x ?? Math.random() * 800,
                y: y ?? -size,
            },
        };
    }

    add(shapeData: ShapeData) {
        this.shapes.push(shapeData);
    }

    remove(graphic: Graphics) {
        const index = this.shapes.findIndex(s => s.shape === graphic);
        if (index !== -1) {
            const shape = this.shapes[index].shape;

            if (shape.parent) {
                shape.parent.removeChild(shape);
            }

            this.shapes.splice(index, 1);
        }
    }

    getAll(): ShapeData[] {
        return this.shapes;
    }

    getCount(): number {
        return this.shapes.length;
    }

    getTotalArea(): number {
        return this.shapes.reduce((sum, s) => sum + s.area, 0);
    }
}