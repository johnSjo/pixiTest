import 'pixi.js';
import 'gsap';
// import 'gsap/PixiPlugin';

import fpsmeter from './debug-fpsmeter.js';
import renderer from './renderer.js';
import menu from './menu.js';
import cardShuffler from './cardShuffler.js';

(function () {
    
    fpsmeter.init();
    renderer.init();
    menu.init();
    cardShuffler.init();

}());
