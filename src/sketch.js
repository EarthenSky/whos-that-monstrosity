const GIF_SPACE = 0.7
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
let pokemon_list_searchable = [];

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

let answerTop = -1;
let answerBot = -1;

function randomize_img() {
    guess_img = null; // clear img

    betterrandnextFloat();

    let itop = Math.floor(betterrandnextFloat() * pokemon_image_list.length);
    let ibot = Math.floor(betterrandnextFloat() * pokemon_image_list.length);
    
    answerTop = (itop);
    answerBot = (ibot);
    
    let top = pokemon_image_list[itop];
    let bot = pokemon_image_list[ibot];

    guess_img = stitch_img(top, bot);
}

let pokemon_image_list = [];
let pokemon_color_image_list = [];
for (let i = 0; i < 151; i++) {
    pokemon_image_list.push(null);
    pokemon_color_image_list.push(null);
}

let s1, s2;
let combinedName = "";
let guess_btn;
let list_done = false;
let num_names_done = 0;
let pokedex;
let screen;
let answer;
let container;
let screen_container;
let answer_container;
let score = 0;
let score_board;

let loadColourImages = function() {
    const at = answerTop;
    const ab = answerBot;

    if (num_images_done != 151) {
        return;
    }

    if (pokemon_color_image_list[at] == null) {
        pokemon_color_image_list[at] = "empty";
        getBase64FromUrl("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/images/pkmn_min/" + pokemon_list_searchable[at] + "-min.png")
        .then(b64 => loadImage(b64, img => {
            pokemon_color_image_list[at] = img; 
        }));
    }

    if (pokemon_color_image_list[ab] == null) {
        pokemon_color_image_list[ab] = "empty";
        getBase64FromUrl("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/images/pkmn_min/" + pokemon_list_searchable[ab] + "-min.png")
        .then(b64 => loadImage(b64, img => {
            pokemon_color_image_list[ab] = img; 
        }));
    }
}

let onRelease = function() {
    combinedName = s1.value().slice(0, s1.value().length/2) + s2.value().slice(s2.value().length/2, s2.value().length)
    loadColourImages();
}

async function preload() {
    betterrandinit();

    gif_start = loadImage('https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/who_that_pokemon_one.gif');
    gif_loop = loadImage('https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/who_that_pokemon_two.gif');
    //gif_reveal = loadImage('res/who_that_pokemon_three.gif');
    pokedex = createImg('https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/pokedex v5.svg', "Error");
    pokedex.position(0, 0);
    pokedex.size(windowWidth - (windowWidth * GIF_SPACE), windowHeight);

    pDisplayList = await fetch("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/src/python/data/pokemon-display.txt");
    pDisplayListText = await pDisplayList.text();
    pDisplayListText.split("\n").forEach(pokemon_name => {
        pokemon_list.push(pokemon_name);
        num_names_done += 1;
    });

    plist = await fetch("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/src/python/data/pokemon.txt");
    plistText = await plist.text();
    
    // 
    let i = 0;
    plistText.split("\n").forEach(pokemon_name => {
        const i2 = i;
        pokemon_name = pokemon_name.replaceAll('%', '%25');
        pokemon_list_searchable.push(pokemon_name);
        getBase64FromUrl("https://raw.githubusercontent.com/EarthenSky/whos-that-monstrosity/main/res/images/pkmn_outline_min/" + pokemon_name + "-min.png")
            .then(b64 => loadImage(b64, img => {
                pokemon_image_list[i2] = img; 
                num_images_done += 1;
            }));
        i += 1;
    });
}

function setup() {
    betterrandinit();

    createCanvas(windowWidth, windowHeight);
    gif_start.play()
    s1 = createSelect();
    s2 = createSelect();
    
    s1.mouseReleased(onRelease);
    s2.mouseReleased(onRelease);
    let select_width = windowWidth - (windowWidth * GIF_SPACE);

    container = createDiv();
    container.position(0, windowHeight * 0.5);
    container.size((windowWidth - (windowWidth * GIF_SPACE)), windowHeight * 0.05);
    container.style('display', 'flex');
    container.style('justify-content', 'center');

    screen_container = createDiv();
    screen_container.html('Your guess:');
    screen_container.style('text-align', 'center');
    screen_container.style('font-family', 'monospace');
    screen_container.style('font-size', '15pt');
    screen_container.position(0, windowHeight * 0.35);
    screen_container.size(windowWidth - (windowWidth * GIF_SPACE), windowHeight * 0.1);

    
    answer_container = createDiv();
    answer_container.position(0, windowHeight * 0.6);
    answer_container.style('text-align', 'center')
    answer_container.style('font-family', 'monospace')
    answer_container.style('font-size', '15pt');
    answer_container.size(windowWidth - (windowWidth * GIF_SPACE), windowHeight * 0.1);
    answer_container.html('Correct guess:');

    s1.style('background-color', '#A9A9A9');
    s1.style('border-radius', '10px');
    s1.style('border-color', 'black');
    s2.style('background-color', '#A9A9A9');
    s2.style('border-radius', '10px');
    s2.style('border-color', 'black');

    guess_btn = createButton("select guess");
    //guess_btn.size(select_width * 0.2, windowHeight * 0.05);
    //guess_btn.position((windowWidth - (windowWidth * GIF_SPACE)) / 2 - BUTTON_WIDTH / 2, windowHeight * 0.6);
    guess_btn.mousePressed(process_guess);

    guess_btn.mouseOver(loadColourImages);

    guess_btn.style('background-color', '#A9A9A9');
    guess_btn.style('border-radius', '10px');
    guess_btn.style('border-color', 'black');

    container.child(s1);
    container.child(guess_btn);
    container.child(s2);
   
    screen = createElement('div', 'Greetings');
    screen.style('background-color', 'green');
    screen.style('border-radius', '10px');
    screen.style('font-family', 'monospace');
    screen.style('text-align', 'center');
    screen.style('font-size', '25px');
    screen.style('width', '60%');
    screen.style('padding', '30px');
    screen.parent(screen_container);
    screen.center('horizontal');

    answer = createElement('div', 'Welcome to the Monsterdex');
    answer.style('background-color', 'green');
    answer.style('border-radius', '10px');
    answer.style('font-family', 'monospace');
    answer.style('text-align', 'center');
    answer.style('font-size', '25px');
    answer.style('width', '60%');
    answer.style('padding', '30px');
    answer.parent(answer_container);
    answer.center('horizontal');
    onRelease();

    score_board = createDiv('Score: ' + 0);
    score_board.position(0, 0);
    score_board.style('font-family', 'monospace');
    score_board.style('font-size', '20pt');
}

function draw() {
    background("#5cadf3");
    betterrandnextFloat();

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
                tint(0, 95, 170); 
                image(guess_img, guess_image_width + (guess_image_width * 0.1) - 5, windowHeight - (windowHeight * 0.8), (windowWidth * GIF_SPACE) * 0.4, windowHeight * 0.4); 
                tint(255, 255, 255); 
                image(guess_img, guess_image_width + (guess_image_width * 0.1), windowHeight - (windowHeight * 0.8), (windowWidth * GIF_SPACE) * 0.4, windowHeight * 0.4); 
                
            }
            break;
        default:
            console.log('Weird');
    }

    screen.html(combinedName);

    score_board.html('Score: ' + score);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // guess_btn.position((windowWidth - (windowWidth * GIF_SPACE)) / 2 - BUTTON_WIDTH / 2, windowHeight * 0.6);
    image(guess_img, windowWidth - (windowWidth * GIF_SPACE) + 40, windowHeight - (windowHeight * 0.8), 400, 400);
    screen_container.size(windowWidth - (windowWidth * GIF_SPACE), windowHeight * 0.1);
    answer_container.size(windowWidth - (windowWidth * GIF_SPACE), windowHeight * 0.1);
    screen.style('width', '60%');
    answer.style('width', '60%');
    pokedex.size(windowWidth - (windowWidth * GIF_SPACE), windowHeight);
    container.size((windowWidth - (windowWidth * GIF_SPACE)), windowHeight * 0.05);
}

function process_guess() {
    console.log(s1.value());
    console.log(s2.value());

    console.log(pokemon_list[answerTop]);
    console.log(pokemon_list[answerBot]);

    answer_name = pokemon_list[answerTop].slice(0, s1.value().length/2) + pokemon_list[answerBot].slice(s2.value().length/2, s2.value().length);
    if (screen.html() === answer_name) {
        console.log("CORRECT!!");
        answer.style('background-color', 'green');
        score += 1
    }
    else {
        answer.style('background-color', 'red');
        console.log("INCORRECT!!");
    }

    answer.html(answer_name);

    wait_loop();
}

function wait_loop() {
    if (pokemon_color_image_list[answerTop] == "empty" || pokemon_color_image_list[answerBot] == "empty" || pokemon_color_image_list[answerTop] == null || pokemon_color_image_list[answerBot] == null) {
        setTimeout(wait_loop, 100);
        loadColourImages();
    } else {
        guess_img = stitch_color(pokemon_image_list[answerTop], pokemon_image_list[answerBot], pokemon_color_image_list[answerTop], pokemon_color_image_list[answerBot]);
        console.log("showing result");
        setTimeout(randomize_img, 1750);
    }
}