import * as PIXI from 'pixi.js';
import { getRenderLayer } from './renderer';
import loader from './loader.js';
import { TimelineMax, TweenMax } from 'gsap';

const WORDS = [
    'Donec', 'porttitor', 'nisi', 'vel', 'dui', 'facilisis', 'at',
    'facilisis', 'eros', 'ultrices', 'Proin', 'quis', 'feugiat', 'dui',
    'Ut', 'hendrerit', 'velit', 'ac', 'est', 'ultricies', 'eget', 'tempus',
    'dolor', 'sollicitudin', 'In', 'at', 'elit', 'et', 'nibh', 'interdum',
    'dictum', 'Aenean', 'tellus', 'nulla'
];

const emojis = [
    { name: 'confused', icon: ':/' },
    { name: 'omg', icon: 'D:' },
    { name: 'smiling', icon: ':)' },
    { name: 'happy', icon: ':D' },
    { name: 'surprised', icon: ':O' },
    { name: 'tongueOut', icon: ';)' },
];

function start () {
    const layer = getRenderLayer('texts');
    
    layer.visible = true;

    layer.interval = setInterval(() => {
        const randomString = createRandomString();
        const fontSize = Math.random() * 100 + 50;

        layer.removeChildren();
    
        printString(deconstructString(randomString), { x: 100, y: 300 + fontSize * 1.2 }, {
            fill: '#53b4c6',
            fontSize,
            lineJoin: 'round',
            padding: 5,
            align: 'left',
            stroke: '#235860',
            strokeThickness: 12
        });
    }, 2000);

}

function hide () {
    const layer = getRenderLayer('texts');
    
    layer.visible = false;
    clearInterval(layer.interval);
}

function createRandomString () {
    let text;

    for (let i = 0; i < 3; i++) {
        text = i === 0 ? '' : `${text} `;

        if (Math.random() > 0.5) {
            text += WORDS[Math.floor(Math.random() * WORDS.length)];
        } else {
            text += emojis[Math.floor(Math.random() * emojis.length)].icon;
        }
    }

    return text;
}

function deconstructString (string) {

    const testString = (string, emoji) => {
        const splittedString = string.split(emoji.icon);
        let numberOfEmojis = splittedString.length - 1;

        while (numberOfEmojis > 0) {

            splittedString.splice(splittedString.length - numberOfEmojis, 0, emoji.texture);
            numberOfEmojis--;
        }

        return splittedString.length === 0 ? splittedString[0] : splittedString;
    };

    const deconstructedText = emojis.reduce((acc, value) => {
        const result = acc.map((item) => {
            if (typeof item === 'string') {
                return testString(item, value);
            } else {
                return item;
            }
        });

        return result.reduce((acc, value) => acc.concat(value), []);

    }, [string]);

    return deconstructedText;
}

function printString (items, position, style) {
    const layer = getRenderLayer('texts');
    const fontHeight = new PIXI.Text('Test', style).height;
    let currentXPos = position.x;

    items.forEach((item) => {
        let sprite;

        if (typeof item === 'string') {
            sprite = new PIXI.Text(item, style);

        } else {
            sprite = new PIXI.Sprite(item);
            const scale = fontHeight / sprite.height;
            
            sprite.scale = new PIXI.Point(scale, scale);
        }

        sprite.x = currentXPos;
        sprite.y = position.y;
        currentXPos += sprite.width;
        layer.addChild(sprite);
    });

}

function reset (resources, layer) {
    const testString = 'Hello there :). Where did that come from :/? Never mind ;)';

    printString(deconstructString(testString), { x: 100, y: 300 }, {
        fill: '#53b4c6',
        fontSize: 50,
        lineJoin: 'round',
        padding: 5,
        align: 'left',
        stroke: '#235860',
        strokeThickness: 12
    });
}

function setup (pubsub, resources) {
    const layer = getRenderLayer('texts');
    
    layer.visible = false;

    emojis.forEach((emoji) => {
        emoji.texture = resources[emoji.name].texture;
    });

    pubsub.subscribe('menuText', () => {
        reset(resources, layer);
        start();
    });

    pubsub.subscribe('menuBack', hide);

}

export default {

    init (pubsub) {

        const assets = [
            { name: 'confused', url: 'assets/emoji/Confused_Face_Emoji.png' },
            { name: 'omg', url: 'assets/emoji/OMG_Face_Emoji.png' },
            { name: 'smiling', url: 'assets/emoji/Slightly_Smiling_Face_Emoji.png' },
            { name: 'happy', url: 'assets/emoji/Smiling_Emoji_with_Eyes_Opened.png' },
            { name: 'surprised', url: 'assets/emoji/Surprised_Face_Emoji.png' },
            { name: 'tongueOut', url: 'assets/emoji/Tongue_Out_Emoji_with_Winking_Eye.png' }
        ];

        loader.loadResources(assets).then((resources) => setup(pubsub, resources));
    }

};
