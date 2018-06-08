import * as PIXI from 'pixi.js';
import { getRenderLayer } from './renderer';
import loader from './loader.js';
import { TimelineMax, TweenLite } from 'gsap';

const STACK_AMPLIFIER = 3;

function start () {
    const layer = getRenderLayer('cards');
    const cards = layer.children.slice().reverse();

    layer.visible = true;

    cards.forEach((card, index) => {
        const timeLine = new TimelineMax();

        card.timeLine = timeLine.delay(index).
            to(card, 2, {
                bezier: {
                    type: 'soft',
                    values: [
                        { x: card.x, y: card.y},
                        { x: card.x + 400, y: card.y - 500 - index * STACK_AMPLIFIER },
                        { x: card.x + 800, y: card.y + (cards.length * STACK_AMPLIFIER - index * STACK_AMPLIFIER * 2) },
                    ]
                }
            });

        card.tween = TweenLite.delayedCall(index + 1, () => {
            layer.addChildAt(layer.removeChild(card), index);
        });
    });
}

function hide () {
    const layer = getRenderLayer('cards');

    layer.visible = false;
    layer.children.forEach((card) => {
        card.timeLine.kill();
        card.tween.kill();
    });
    layer.removeChildren();
}

function resetCards (resources, layer) {
    Object.entries(resources).forEach(([name, resource], index) => {
        const card = new PIXI.Sprite(resource.texture);

        card.anchor = new PIXI.Point(0.5, 0.5);

        card.x = Math.random() * 30 - 15;
        card.y = Math.random() * 30 - 15 - index * STACK_AMPLIFIER;
        card.scale = new PIXI.Point(5, 5);
        card.rotation = (Math.random() * 16 - 8) * Math.PI / 180;

        layer.addChild(card);

        return card;
    });
}

function setup (pubsub, resources) {
    const layer = getRenderLayer('cards');

    layer.x = 600;
    layer.y = 900;
    layer.visible = false;

    pubsub.subscribe('menuCard', () => {
        resetCards(resources, layer);
        start();
    });

    pubsub.subscribe('menuBack', hide);

}

export default {

    init (pubsub) {

        const assets = [
            'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AN', 'AO', 'AQ',
            'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD',
            'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO',
            'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF',
            'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU',
            'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO',
            'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'EU', 'FI',
            'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GG',
            'GH', 'GI', 'GL', 'GM', 'GN', 'GQ', 'GR', 'GS', 'GT', 'GU',
            'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'IC', 'ID', 'IE',
            'IL', 'IM', 'IN', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO',
            'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW',
            'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT',
            'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH',
            'MK', 'ML', 'MM', 'MN'
        ].
            map((name) => {
                return `assets/flags/${name}.png`;
            });

        loader.loadResources(assets).then((resources) => setup(pubsub, resources));
    }

};
