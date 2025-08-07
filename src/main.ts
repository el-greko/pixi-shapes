import {Startup} from "./view/Startup";


window.addEventListener('DOMContentLoaded', () => {
    const app = new Startup();
    app.init();
});
