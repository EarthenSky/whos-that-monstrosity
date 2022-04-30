const GIF_SPACE = 0.5
const GIF_STATE = {
    BEGINNING : 0,
    LOOP : 1,
    REVEAL : 2
};

let current_gif_state = GIF_STATE.BEGINNING;
let gif_start, gif_loop, gif_reveal;
let pokemon_list;

let num_images_done = 0;
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

function randomize_img() {
    Math.random();
    Math.random();

    //console.log(pokemon_image_list)
    let itop = Math.floor(Math.random() * pokemon_image_list.length);
    let ibot = Math.floor(Math.random() * pokemon_image_list.length);
    
    console.log(itop+1)
    console.log(ibot+1)
    
    let top = pokemon_image_list[itop];
    let bot = pokemon_image_list[ibot];

    guess_img = stitch_img(top, bot);
}

let pokemon_image_list = [];
for (let i = 0; i < 151; i++) {
    pokemon_image_list.push(null);
}

async function preload() {
    gif_start = loadImage('res/who_that_pokemon_one.gif');
    gif_loop = loadImage('res/who_that_pokemon_two.gif');
    //gif_reveal = loadImage('res/who_that_pokemon_three.gif');

    plist = await fetch("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/src/python/data/pokemon.txt");
    plistText = await plist.text();
    
    // 
    let i = 0;
    plistText.split("\n").forEach(pokemon_name => {
        const i2 = i;
        pokemon_name = pokemon_name.replaceAll('%', '%25');
        getBase64FromUrl("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/images/pkmn_outline/" + pokemon_name + ".png")
            .then(b64 => loadImage(b64, img => {
                pokemon_image_list[i2] = img; 
                num_images_done += 1;
            }));
        i += 1;
    });
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    gif_start.play();
}

function draw() {
    // once data finishes loading, load initial images
    if (num_images_done == 151 && !done_startup) {
        done_startup = true;
        randomize_img();
    }

    // draw image if it exists:
    if (guess_img != null) {
        image(guess_img, 10, 10, 400, 400);
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
        case GIF_STATE.LOOP:
            image(gif_loop, windowWidth - (windowWidth * GIF_SPACE), 0, windowWidth * GIF_SPACE, windowHeight - (windowHeight*0.2));
            break;
        default:
            console.log('Weird');
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}