const GIF_SPACE = 0.5
const GIF_STATE = {
    BEGINNING : 0,
    LOOP : 1,
    REVEAL : 2
};

let current_gif_state = GIF_STATE.BEGINNING;
let gif_start, gif_loop, gif_reveal;
let pokemon_list;

function preload() {
    gif_start = loadImage('res/who_that_pokemon_one.gif');
    gif_loop = loadImage('res/who_that_pokemon_two.gif');
    //gif_reveal = loadImage('res/who_that_pokemon_three.gif');
}

function setup() {
    // put setup code here
    createCanvas(windowWidth, windowHeight);
    gif_start.play()
}
  
function draw() {
    // put drawing code here
    switch(current_gif_state) {
        case GIF_STATE.BEGINNING :
            image(gif_start, windowWidth - (windowWidth * GIF_SPACE), 0, windowWidth * GIF_SPACE, windowHeight - (windowHeight*0.2));
            if (gif_start.getCurrentFrame() === gif_start.numFrames() - 1) {
                current_gif_state = GIF_STATE.LOOP;
                gif_loop.play();
                gif_start.pause();
            }
            break;
        case GIF_STATE.LOOP :
            image(gif_loop, windowWidth - (windowWidth * GIF_SPACE), 0, windowWidth * GIF_SPACE, windowHeight - (windowHeight*0.2));
            break;
        default:
            console.log('Weird');
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}