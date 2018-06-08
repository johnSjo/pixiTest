import 'pixi.js';
import 'gsap';

import fpsmeter from './debug-fpsmeter.js';
import renderer from './renderer.js';
import menu from './menu.js';
import cardShuffler from './cardShuffler.js';
import mixText from './mixText.js';
import PubSub from './PubSub.js';

(function () {

    const pubsub = PubSub.create();
    
    fpsmeter.init();
    renderer.init();
    menu.init(pubsub);
    cardShuffler.init(pubsub);
    mixText.init(pubsub);

}());
