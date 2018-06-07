


export function start () {
    
}

export function hide () {
    
}

function setup (resources) {

}

export default {

    init () {

        const assets = [
            { name: 'backArrow', url: 'assets/arrow.png' }
        ];

        loader.loadResources(assets).then((resources) => setup(resources));
    }

};
