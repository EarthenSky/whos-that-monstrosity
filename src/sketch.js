const GIF_SPACE = 0.5
const GIF_STATE = {
    BEGINNING : 0,
    LOOP : 1,
    REVEAL : 2
};
const SELECT_WIDTH = 200;
const SELECT_HEIGHT = 30;

const BUTTON_WIDTH = 200;
const BUTTON_HEIGHT = 30;

let current_gif_state = GIF_STATE.BEGINNING;
let gif_start, gif_loop, gif_reveal;
let pokemon_list = [];

let done_startup = false;

const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
            const base64data = reader.result;   
            resolve(base64data);
        }
    });
}

let guess_img = null;

let pokemon_image_list = [];

let a = null;
let b = null;
let a2 = null;
let b2 = null;

let s1, s2;
let guess_btn;

async function preload() {
    gif_start = loadImage('res/who_that_pokemon_one.gif');
    gif_loop = loadImage('res/who_that_pokemon_two.gif');
    //gif_reveal = loadImage('res/who_that_pokemon_three.gif');

    pDisplayList = await fetch("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/src/python/data/pokemon-display.txt");
    pDisplayListText = await pDisplayList.text();
    pDisplayListText.split("\n").forEach(pokemon_name => {
        pokemon_list.push(pokemon_name)
    });

    plist = await fetch("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/src/python/data/pokemon.txt");
    plistText = await plist.text()
    console.log(plistText);
    a = await getBase64FromUrl("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/images/pkmn_outline/Pidgey.png");
    b = await getBase64FromUrl("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/images/pkmn_outline/Zapdos.png");
    plistText.split("\n").forEach(pokemon_name => {
        pokemon_image_list
    });

    loadImage(a, img => a2 = img);
    loadImage(b, img => b2 = img);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    gif_start.play()
    s1 = createSelect();
    s2 = createSelect();
    s1.position(0, windowHeight*0.2);
    s2.position(windowWidth - (windowWidth * GIF_SPACE) - SELECT_WIDTH , windowHeight*0.2);
    s1.size(SELECT_WIDTH, SELECT_HEIGHT);
    s2.size(SELECT_WIDTH, SELECT_HEIGHT);
    pokemon_list.forEach( elem => {
         s1.option(elem);
         s2.option(elem);
    })

    guess_btn = createButton("select guess");
    guess_btn.size(BUTTON_WIDTH, BUTTON_HEIGHT);
    guess_btn.position((windowWidth - (windowWidth * GIF_SPACE)) / 2 - BUTTON_WIDTH / 2, windowHeight * 0.6);
    guess_btn.mousePressed(process_guess);
}
  
function draw() {
    if (!done_startup && a2 != null & b2 != null) {
        guess_img = stitch_img(a2, b2);
        done_startup = true;
    }

    // tmp img:
    if (guess_img != null) {

        image(guess_img, 10, 10, 200, 200);
    }

    switch(current_gif_state) {
        case GIF_STATE.BEGINNING :
            image(gif_start, windowWidth - (windowWidth * GIF_SPACE), 0, windowWidth * GIF_SPACE, windowHeight);
            if (gif_start.getCurrentFrame() === gif_start.numFrames() - 1) {
                current_gif_state = GIF_STATE.LOOP;
                gif_loop.play();
                gif_start.pause();
            }
            break;
        case GIF_STATE.LOOP :
            image(gif_loop, windowWidth - (windowWidth * GIF_SPACE), 0, windowWidth * GIF_SPACE, windowHeight);
            break;
        default:
            console.log('Weird');
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    s1.position(0, (windowHeight * 0.2));
    s2.position(windowWidth - (windowWidth * GIF_SPACE) - SELECT_WIDTH , windowHeight*0.2);
    guess_btn.position((windowWidth - (windowWidth * GIF_SPACE)) / 2 - BUTTON_WIDTH / 2, windowHeight * 0.6);
}

function process_guess() {
    console.log("Button presssed");
    console.log(s1.value());
    console.log(s2.value());
}