import * as PIXI from 'pixi.js';

const CONTAINER_SELECTOR = '#app';
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;
const MIN_RATIO = 9 / 16;
const MAX_RATIO = 16 / 9;
const MAX_AREA = BASE_HEIGHT * BASE_WIDTH;

const LAYERS = [
    'cards',
    'texts',
    'fire',
    'mainMenu'
];

const INTERACTIVE_LAYERS = [
    'mainMenu'
];

const renderLayers = {};

const stage = new PIXI.Container();

LAYERS.forEach((name) => {

    const layer = new PIXI.Container();

    renderLayers[name] = layer;
    layer.interactiveChildren = INTERACTIVE_LAYERS.includes(name);

    stage.addChild(layer);

});

function initRenderer (stage, container) {

    const renderer = PIXI.autoDetectRenderer(800, 600, {
        transparent: true
    });

    container.appendChild(renderer.view);

    window.addEventListener('resize', () => {
        renderer.resize(container.offsetWidth, container.offsetHeight);
    });

    function render () {
        renderer.render(stage);
        requestAnimationFrame(render);
    }

    renderer.resize(container.offsetWidth, container.offsetHeight);

    render();

}

export function getRenderLayer (layer) {
    return renderLayers[layer];
}

export default {

    init () {

        const container = document.querySelector(CONTAINER_SELECTOR);

        initRenderer(stage, container);

    }

};
