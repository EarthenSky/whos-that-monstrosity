const GIF_SPACE = 0.5
const GIF_STATE = {
    BEGINNING : 0,
    LOOP : 1,
    REVEAL : 2
};

let current_gif_state = GIF_STATE.BEGINNING;
let gif_start, gif_loop, gif_reveal;
let pokemon_list;

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

async function preload() {
    gif_start = loadImage('res/who_that_pokemon_one.gif');
    gif_loop = loadImage('res/who_that_pokemon_two.gif');
    //gif_reveal = loadImage('res/who_that_pokemon_three.gif');

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