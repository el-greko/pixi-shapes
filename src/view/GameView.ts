import {Application, Container, DisplayObject, FederatedPointerEvent, Graphics} from "pixi.js";


export class GameView {
    public stage: Container;
    public width: number;
    public height: number;

    constructor(public app: Application) {
        this.stage = app.stage;
        this.width = app.view.width;
        this.height = app.view.height;
    }

    addToStage(obj: DisplayObject) {
        this.stage.addChild(obj);
    }

    addBackground(width: number, height: number, onClick: (e: FederatedPointerEvent) => void) {
        const graphicsBg = new Graphics();
        graphicsBg.beginFill(0xffffff, 1);
        graphicsBg.drawRect(0, 0, width, height);
        graphicsBg.endFill();

        graphicsBg.eventMode = 'static';
        graphicsBg.zIndex = 0;
        graphicsBg.on('pointerdown', onClick);

        this.stage.addChildAt(graphicsBg, 0);
    }


}