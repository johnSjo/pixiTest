import * as PIXI from 'pixi.js';
import { TimelineLite } from 'gsap';

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
        onResize(renderer, stage, container);
    });

    function render () {
        renderer.render(stage);
        requestAnimationFrame(render);
    }

    onResize(renderer, stage, container);

    render();

}

function getDimensions (ratio, windowSize) {

    const sqrt = Math.sqrt(MAX_AREA / ratio);

    const dimensions = {
        width: Math.floor(sqrt * ratio),
        height: Math.floor(sqrt),
        scaleGame: 1
    };

    // if res is higher than window res -> lower it and scale down
    if (ratio > 1) {
        // landscape
        if (dimensions.height > windowSize.height) {
            dimensions.scaleGame = windowSize.height / dimensions.height;
            dimensions.height = Math.floor(windowSize.height);
            dimensions.width = Math.floor(dimensions.height * ratio);
        }
        if (dimensions.width > windowSize.width) {
            dimensions.scaleGame = windowSize.width / dimensions.width;
            dimensions.width = Math.floor(windowSize.width);
            dimensions.height = Math.floor(dimensions.width / ratio);
        }
    } else {
        // portrait
        if (dimensions.width > windowSize.width) {
            dimensions.scaleGame = windowSize.width / dimensions.width;
            dimensions.width = Math.floor(windowSize.width);
            dimensions.height = Math.floor(dimensions.width / ratio);
        }
        if (dimensions.height > windowSize.height) {
            dimensions.scaleGame = windowSize.height / dimensions.height;
            dimensions.height = Math.floor(windowSize.height);
            dimensions.width = Math.floor(dimensions.height * ratio);
        }
    }

    return dimensions;

}

function onResize (renderer, stage, container) {

    const windowSize = {
        width: container.offsetWidth,
        height: container.offsetHeight,
        aspectRatio: container.offsetWidth / container.offsetHeight
    };

    // if window ratio is over or under min/max ratio -> use min/max ratio
    const ratio = windowSize.aspectRatio > MAX_RATIO ?
        MAX_RATIO :
        windowSize.aspectRatio < MIN_RATIO ? MIN_RATIO : windowSize.aspectRatio;

    const { scaleGame, width, height } = getDimensions(ratio, windowSize);

    // if res is lower than window res -> scale up canvas
    const scaleCanvas = (width < windowSize.width || height < windowSize.height) ?
        Math.min((windowSize.width / width), (windowSize.height / height)) : 1;

    container.style.transform = `scale(${scaleCanvas})`;

    renderer.resize(width, height);

    stage.scale.set(scaleGame);

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
