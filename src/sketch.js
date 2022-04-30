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

let s1, s2;
let guess_btn;
let list_done = false;
let num_names_done = 0;
let pokedex;
let pokedex_done;

async function preload() {
    gif_start = loadImage('https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/who_that_pokemon_one.gif');
    gif_loop = loadImage('https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/who_that_pokemon_two.gif');
    //gif_reveal = loadImage('res/who_that_pokemon_three.gif');
    pokedex = createImg('https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/pokedex1.svg', "Error");
    pokedex.position(0, 0);
    pokedex.size(windowWidth - (windowWidth * GIF_SPACE), windowHeight);

    pDisplayList = await fetch("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/src/python/data/pokemon-display.txt");
    pDisplayListText = await pDisplayList.text();
    pDisplayListText.split("\n").forEach(pokemon_name => {
        pokemon_list.push(pokemon_name)
        num_names_done += 1
    });

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
    gif_start.play()
    s1 = createSelect();
    s2 = createSelect();
    s1.position(0, windowHeight*0.2);
    s2.position(windowWidth - (windowWidth * GIF_SPACE) - SELECT_WIDTH , windowHeight*0.2);
    s1.size(SELECT_WIDTH, SELECT_HEIGHT);
    s2.size(SELECT_WIDTH, SELECT_HEIGHT);

    guess_btn = createButton("select guess");
    guess_btn.size(BUTTON_WIDTH, BUTTON_HEIGHT);
    guess_btn.position((windowWidth - (windowWidth * GIF_SPACE)) / 2 - BUTTON_WIDTH / 2, windowHeight * 0.6);
    guess_btn.mousePressed(process_guess);
}

function draw() {
    // once data finishes loading, load initial images
    if (num_images_done == 151 && !done_startup) {
        done_startup = true;
        randomize_img();
    }

    if (num_names_done == 151 && !list_done) {
        list_done = true;
        pokemon_list.forEach( elem => {
            s1.option(elem);
            s2.option(elem);
       })
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
            // draw image if it exists:
            if (guess_img != null) {
                let guess_image_width = (windowWidth) - (windowWidth * GIF_SPACE);
                image(guess_img, guess_image_width + (guess_image_width * 0.1), windowHeight - (windowHeight * 0.8), (windowWidth * GIF_SPACE) * 0.4, windowHeight * 0.4); 
            }
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
    image(guess_img, windowWidth - (windowWidth * GIF_SPACE) + 40, windowHeight - (windowHeight * 0.8), 400, 400);
}

function process_guess() {
    console.log("Button presssed");
    console.log(s1.value());
    console.log(s2.value());
}