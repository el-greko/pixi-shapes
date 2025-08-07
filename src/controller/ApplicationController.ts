import { GameView } from '../view/GameView';
import { ShapesModel } from '../model/ShapesModel';
import { ShapesFactory} from '../view/ShapesFactory';
import {FederatedPointerEvent} from 'pixi.js';

export class ApplicationController {
    private model = new ShapesModel();
    private gravity = 1;
    private spawnRate = 1;
    private spawnTimer = 0;
    private _view: GameView;
    private _factory: ShapesFactory = new ShapesFactory();

    private countLabel = document.getElementById('shape-count');
    private areaLabel = document.getElementById('shape-area');
    private gravityLabel = document.getElementById('gravity-value');
    private rateLabel = document.getElementById('rate-value');

    constructor(view: GameView) {
        this._view = view;

        this._view.addBackground(
            this._view.width,
            this._view.height,
            this.onBackgroundClick.bind(this)
        );
        this.setControlls();
    }

    private setControlls() {

        document.getElementById('gravity-increase')?.addEventListener('click', () => {
            this.gravity+=0.1;
            this.updateLabels();
        });

        document.getElementById('gravity-decrease')?.addEventListener('click', () => {
            this.gravity = Math.max(0, this.gravity - 0.1);
            this.updateLabels();
        });

        document.getElementById('rate-increase')?.addEventListener('click', () => {
            this.spawnRate++;
            this.updateLabels();
        });

        document.getElementById('rate-decrease')?.addEventListener('click', () => {
            this.spawnRate = Math.max(0, this.spawnRate - 1);
            this.updateLabels();
        });

        this.updateLabels();
    }

    private onBackgroundClick(e: FederatedPointerEvent) {
        const x = e.global.x;
        const y = e.global.y;

        this.spawnShape(x, y);
    }


    private spawnShape(x?: number, y?: number) {
        const shapeMeta = this.model.generateRandomShape(x, y);
        const shapeData = this._factory.drawShape(shapeMeta);

        shapeData.shape.on('pointerdown', (event) => {
            event.stopPropagation();
            this.model.remove(shapeData.shape);
        });

        this.model.add(shapeData);
        this._view.addToStage(shapeData.shape);
    }

    public update(delta: number) {
        this.spawnTimer += delta;
        const interval = 60 / this.spawnRate;

        while (this.spawnTimer >= interval && this.spawnRate > 0) {
            this.spawnTimer -= interval;
            this.spawnShape();
        }

        const copiedAll = [...this.model.getAll()];
        for (let i = copiedAll.length - 1; i >= 0; i--) {
            const shapeData = copiedAll[i];

            shapeData.velocityY+= this.gravity * delta;
            shapeData.shape.y += shapeData.velocityY*delta;

            if (shapeData.shape.y > this._view.height + 100) {
                this.model.remove(shapeData.shape);
            }
        }

        if (this.countLabel) this.countLabel.textContent = this.model.getCount().toString();
        if (this.areaLabel) this.areaLabel.textContent = this.model.getTotalArea().toFixed(0);
    }

    private updateLabels() {
        if (this.gravityLabel) this.gravityLabel.textContent = this.gravity.toFixed(1)
        if (this.rateLabel) this.rateLabel.textContent = this.spawnRate.toString();
    }
}
