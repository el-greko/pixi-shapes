import {Graphics} from 'pixi.js';

export enum ShapeKind {
    Triangle,
    Square,
    Pentagon,
    Hexagon,
    Circle,
    Ellipse,
    Random,
}

export type TypeShape = {
    id: number;
    type: ShapeKind;
    color: number;
    position: { x: number; y: number };
    size: number;
};

export type ShapeData = {
    shape: Graphics;
    area: number;
    meta: TypeShape;
    velocityY: number;
};

const sidesMap = {
    [ShapeKind.Triangle]: 3,
    [ShapeKind.Pentagon]: 5,
    [ShapeKind.Hexagon]: 6,
    [ShapeKind.Random]: 5,
};

export class ShapesFactory {
    public drawShape(shape: TypeShape): ShapeData {
        const graph = new Graphics();
        graph.beginFill(shape.color);
        graph.x = shape.position.x;
        graph.y = shape.position.y;

        const shapeSize = shape.size;
        let area;
        switch (shape.type) {
            case ShapeKind.Triangle:
                graph.drawPolygon([0, 0, shapeSize, 0, shapeSize / 2, -shapeSize]);
                area = this.calculateArea(shape);
                break;
            case ShapeKind.Square:
                graph.drawRect(-shapeSize / 2, -shapeSize / 2, shapeSize, shapeSize);
                area = this.calculateArea(shape);
                break;
            case ShapeKind.Pentagon:
                this.drawPolygonShape(graph, 5, shapeSize);
                area = this.calculateArea(shape);
                break;
            case ShapeKind.Hexagon:
                this.drawPolygonShape(graph, 6, shapeSize);
                area = this.calculateArea(shape);
                break;
            case ShapeKind.Circle:
                graph.drawCircle(0, 0, shapeSize / 2);
                area = this.calculateArea(shape);
                break;
            case ShapeKind.Ellipse:
                graph.drawEllipse(0, 0, shapeSize / 2, shapeSize / 3);
                area = this.calculateArea(shape);
                break;
            case ShapeKind.Random:

                const bumps = 3 + Math.floor(Math.random() * 5);
                const rad = shape.size
                this.drawRandomShape(graph, rad, bumps);
                area = this.approximatePolarArea(rad, bumps);
                break;
        }

        graph.endFill();
        graph.interactive = true;
        graph.buttonMode = true;


        return {
            shape: graph,
            area,
            meta: shape,
            velocityY: 0,
        };
    }

    private approximatePolarArea(radius: number, bumps: number, steps: number = 100): number {
        let area = 0;
        const angleStep = (Math.PI * 2) / steps;

        for (let i = 0; i < steps; i++) {
            const theta = i * angleStep;
            const nextTheta = (i + 1) * angleStep;

            const r1 = radius * (1 + 0.3 * Math.sin(bumps * theta));
            const r2 = radius * (1 + 0.3 * Math.sin(bumps * nextTheta));


            area += 0.5 * (r1 * r1 + r2 * r2) * angleStep;
        }

        return area / 2;
    }

    private drawPolygonShape(graph: Graphics, sides: number, radius: number) {
        const step = (Math.PI * 2) / sides;
        graph.moveTo(Math.cos(0) * radius, Math.sin(0) * radius);
        for (let i = 1; i <= sides; i++) {
            graph.lineTo(Math.cos(i * step) * radius, Math.sin(i * step) * radius);
        }
    }

    private drawRandomShape(graphics: Graphics, radius: number = 50, bumps: number = 3): void {
        const steps = 100;
        const angleStep = (Math.PI * 2) / steps;

        for (let i = 0; i <= steps; i++) {
            const theta = i * angleStep;
            const r = radius * (1 + 0.3 * Math.sin(bumps * theta));
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);

            if (i === 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }
        }

        graphics.closePath();
    }

    private calculateArea(shape: TypeShape): number {
        const s = shape.size;
        switch (shape.type) {
            case ShapeKind.Circle:
                return Math.PI * Math.pow(s / 2, 2);
            case ShapeKind.Ellipse:
                return Math.PI * (s / 2) * (s / 3);
            case ShapeKind.Square:
                return s * s;
            case ShapeKind.Triangle:
            case ShapeKind.Pentagon:
            case ShapeKind.Hexagon:
            case ShapeKind.Random:
                return this.approximateRegularPolygonArea(shape.type, s);
            default:
                return 0;
        }
    }

    private approximateRegularPolygonArea(type: ShapeKind, size: number): number {

        const sides = sidesMap[type];
        if (!sides) return 0;
        const radius = size / 2;
        return (sides * radius * radius * Math.sin((2 * Math.PI) / sides)) / 2;
    }
}
