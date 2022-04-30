// this file has functions

function stitch_img(pkmn1, pkmn2) {
    img1 = pkmn1;
    img2 = pkmn2;

    // this creates a dom element
    img1.loadPixels();
    img2.loadPixels();

    // get biggest size of the two
    let width, height;
    if (img1.width > img2.width) {
        width = img1.width;
        height = img1.height;
        img2.resize(width, height);
    } else {
        width = img2.width;
        height = img2.height;
        img1.resize(width, height);
    }

    console.log(width);
    console.log(height);

    // copy the respective halves of each input image to the target
    let guess_img = createImage(width, height);
    guess_img.loadPixels();

    let d = pixelDensity();
    let halfImage = 4 * (guess_img.width * d) * (guess_img.height / 2 * d);
    for (let i = 0; i < halfImage; i += 1) {
        guess_img.pixels[i] = img1.pixels[i];
    }
    for (let i = 0; i < halfImage; i += 1) {
        guess_img.pixels[i+halfImage] = img2.pixels[i+halfImage];
    }
    guess_img.updatePixels();

    img1.updatePixels();
    img2.updatePixels();
    console.log(guess_img);

    return guess_img;
}