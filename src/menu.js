import * as PIXI from 'pixi.js';
import { getRenderLayer } from './renderer';
import loader from './loader.js';
import { start as cardsStart, hide as cardsHide } from './cardShuffler.js';
import { start as textStart, hide as textHide } from './mixText';
import { start as fireStart, hide as fireHide } from './fire';

const MENU_ITEMS = [
    { name: 'Card Shuffler', demo: cardsStart, hide: cardsHide },
    { name: 'Text Mixer', demo: textStart, hide: textHide },
    { name: 'Fire', demo: fireStart, hide: fireHide }
];

function createBackArrow (resources, layer, toggelMenu) {
    const backArrow = new PIXI.Sprite(resources.backArrow.texture);

    backArrow.scale = new PIXI.Point(0.3, 0.3);
    backArrow.visible = false;

    backArrow.interactive = true;
    backArrow.cursor = 'pointer';

    backArrow.on('pointerup', () => {
        MENU_ITEMS.forEach((item) => {
            item.hide();
        });
        toggelMenu();
    });

    layer.addChild(backArrow);

    return backArrow;
}

function start (resources) {

    const layer = getRenderLayer('mainMenu');
    const toggelMenu = () => {
        menuItems.forEach((item) => {
            item.visible = !item.visible;
        });
        backArrow.visible = !backArrow.visible;
    };
    const backArrow = createBackArrow(resources, layer, toggelMenu);

    const menuItems = MENU_ITEMS.map((item, index) => {
        const text = new PIXI.Text(item.name, {
            fill: '#53b4c6',
            fontSize: 100,
            lineJoin: 'round',
            padding: 5,
            align: 'left',
            stroke: '#235860',
            strokeThickness: 12
        });

        text.y = 200 + index * text.height * 1.1;

        text.interactive = true;
        text.cursor = 'pointer';

        text.on('pointerup', () => {
            toggelMenu();
            item.demo();
        });

        layer.addChild(text);

        return text;

    });

}

export default {

    init () {

        const assets = [
            { name: 'backArrow', url: 'assets/arrow.png' }
        ];

        loader.loadResources(assets).then((resources) => start(resources));
    }

};
