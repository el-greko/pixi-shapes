import {GameView} from '../view/GameView';
import {ApplicationController} from '../controller/ApplicationController';
import {Application} from "pixi.js";

export class Startup {
    private pixiApp!: Application;
    private gameView!: GameView;
    private gameController!: ApplicationController;

    init() {
        this.pixiApp = new Application({
            width: 800,
            height: 600,
            backgroundColor: 0xeeeeee,
        });

        document.body.appendChild(this.pixiApp.view as HTMLCanvasElement);

        this.gameView = new GameView(this.pixiApp);
        this.gameController = new ApplicationController(this.gameView);

        this.pixiApp.ticker.add((delta) => this.gameController.update(delta));
    }
}
