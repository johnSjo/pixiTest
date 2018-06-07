import Stats from 'stats.js';

function init () {

    let stats = null;

    function start () {

        if (!stats) {
            stats = new Stats();
            stats.dom.style.left = 'auto';
            stats.dom.style.right = '0';
        }

        document.body.appendChild(stats.dom);

        requestAnimationFrame(function loop () {

            stats.update();

            requestAnimationFrame(loop);

        });

    }
    
    start();

}

export default {
    init
};
