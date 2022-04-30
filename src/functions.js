// this file has functions

function stitch_img(pkmn1, pkmn2) {
    
    let img1 = createImage(pkmn1.width, pkmn1.height);
    let img2 = createImage(pkmn2.width, pkmn2.height);
    img1.copy(pkmn1, 0, 0, pkmn1.width, pkmn1.height, 0, 0, pkmn1.width, pkmn1.height);
    img2.copy(pkmn2, 0, 0, pkmn2.width, pkmn2.height, 0, 0, pkmn2.width, pkmn2.height);

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

    // copy the respective halves of each input image to the target
    let guess_img = createImage(width, height);
    guess_img.loadPixels();

    // compute sizes
    let halfImage = 4 * (guess_img.width) * (Math.ceil(guess_img.height / 2));

    // top line:
    let longest_run_len = 0;
    let longest_start_run = -1;
    let longest_end_run = -1;

    let current_run_len = 0;
    let current_start_run = -1;
    let current_end_run = -1;
    let i;
    for (i = halfImage - width * 4; i < halfImage; i += 4) {
        let a = img1.pixels[i+3]; // alpha value
        if (a > 95) {
            if (current_run_len == 0) {
                current_start_run = i - (halfImage - width * 4);
            }
            current_run_len += 1;
        } else {
            if (current_run_len != 0) {
                current_end_run = i - (halfImage - width * 4);
                if (current_run_len > longest_run_len) {
                    longest_run_len = current_run_len;
                    longest_start_run = current_start_run;
                    longest_end_run = current_end_run;
                }
            }
            current_run_len = 0;
        }
    }

    if (current_run_len != 0) {
        current_end_run = i;
        if (current_run_len > longest_run_len) {
            longest_run_len = current_run_len;
            longest_start_run = current_start_run;
            longest_end_run = current_end_run;
        }
    }
    
    // bot:
    let longest_run_len_2 = 0;
    let longest_start_run_2 = -1;
    let longest_end_run_2 = -1;

    let current_run_len_2 = 0;
    let current_start_run_2 = -1;
    let current_end_run_2 = -1;
    for (i = 0; i < width*4; i += 4) {
        let a = img2.pixels[i+halfImage+3];
        if (a > 95) {
            if (current_run_len_2 == 0) {
                current_start_run_2 = i;
            }
            current_run_len_2 += 1;
        } else {
            if (current_run_len_2 != 0) {
                current_end_run_2 = i;
                if (current_run_len_2 > longest_run_len_2) {
                    longest_run_len_2 = current_run_len_2;
                    longest_start_run_2 = current_start_run_2;
                    longest_end_run_2 = current_end_run_2;
                }
            }
            current_run_len_2 = 0;
        }
    }

    if (current_run_len_2 != 0) {
        current_end_run_2 = i;
        if (current_run_len_2 > longest_run_len_2) {
            longest_run_len_2 = current_run_len_2;
            longest_start_run_2 = current_start_run_2;
            longest_end_run_2 = current_end_run_2;
        }
    }

    // combine images
    if (longest_run_len > longest_run_len_2) {
        let shrink_coef = longest_run_len_2 / longest_run_len;
        console.log(shrink_coef)
        img1.resize(Math.floor(width * shrink_coef), Math.floor(height * shrink_coef));

        let hdist = Math.floor(longest_start_run_2/4 - (longest_start_run/4) * shrink_coef);
        console.log(hdist)

        let triangle = Math.ceil((img2.height - img1.height) /2);
        for (let y = triangle; y < Math.ceil(img1.height/2) + triangle; y += 1) {
            for (let x = 0; x < img1.width; x += 1) {
                let full = 4 * (guess_img.width) * (guess_img.height);
                if (x+hdist >= guess_img.width || x+hdist < 0)
                    continue;

                if ((x+hdist) * 4 + y*img2.width * 4 < full && (x+hdist) * 4 + y*img2.width * 4 > 0) {
                    guess_img.pixels[(x+hdist) * 4 + y*img2.width * 4] = img1.pixels[x * 4 + (y-triangle)*img1.width * 4];
                    guess_img.pixels[(x+hdist) * 4 + y*img2.width * 4 + 1] = img1.pixels[x * 4 + (y-triangle)*img1.width * 4 + 1];
                    guess_img.pixels[(x+hdist) * 4 + y*img2.width * 4 + 2] = img1.pixels[x * 4 + (y-triangle)*img1.width * 4 + 2];
                    guess_img.pixels[(x+hdist) * 4 + y*img2.width * 4 + 3] = img1.pixels[x * 4 + (y-triangle)*img1.width * 4 + 3];
                }   
            }
        }

        for (let i = 0; i < halfImage; i += 1) {
            guess_img.pixels[i+halfImage] = img2.pixels[i+halfImage];
        }
    } else { 
        for (let i = 0; i < halfImage; i += 1) {
            guess_img.pixels[i] = img1.pixels[i];
        }

        let shrink_coef = longest_run_len / longest_run_len_2;
        img2.resize(Math.floor(width * shrink_coef), Math.floor(height * shrink_coef));
        console.log(shrink_coef)

        let hdist = Math.floor(longest_start_run/4 - (longest_start_run_2/4) * shrink_coef);
        console.log(hdist)

        for (let y = 0; y < Math.ceil(img2.height/2); y += 1) {
            for (let x = 0; x < img2.width; x += 1) {
                let full = 4 * (guess_img.width) * (guess_img.height);
                
                if (x+hdist >= guess_img.width || x+hdist < 0)
                    continue;

                if ((x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 < full && (x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 > 0) {
                    guess_img.pixels[(x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4] = img2.pixels[x * 4 + (y+Math.ceil(img2.height/2))*img2.width * 4];
                    guess_img.pixels[(x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 + 1] = img2.pixels[x * 4 + (y+Math.ceil(img2.height/2))*img2.width * 4 + 1];
                    guess_img.pixels[(x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 + 2] = img2.pixels[x * 4 + (y+Math.ceil(img2.height/2))*img2.width * 4 + 2];
                    guess_img.pixels[(x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 + 3] = img2.pixels[x * 4 + (y+Math.ceil(img2.height/2))*img2.width * 4 + 3];
                }
            }
        }
    }
    
    guess_img.updatePixels();

    img1.updatePixels();
    img2.updatePixels();

    return guess_img;
}


function stitch_color(pkmn1, pkmn2, pkmncol1, pkmncol2) {
    
    let img1 = createImage(pkmn1.width, pkmn1.height);
    let img2 = createImage(pkmn2.width, pkmn2.height);
    img1.copy(pkmn1, 0, 0, pkmn1.width, pkmn1.height, 0, 0, pkmn1.width, pkmn1.height);
    img2.copy(pkmn2, 0, 0, pkmn2.width, pkmn2.height, 0, 0, pkmn2.width, pkmn2.height);

    console.log(pkmncol1);

    let img1col = createImage(pkmncol1.width, pkmncol1.height);
    let img2col = createImage(pkmncol2.width, pkmncol2.height);
    img1col.copy(pkmncol1, 0, 0, pkmncol1.width, pkmncol1.height, 0, 0, pkmncol1.width, pkmncol1.height);
    img2col.copy(pkmncol2, 0, 0, pkmncol2.width, pkmncol2.height, 0, 0, pkmncol2.width, pkmncol2.height);

    // this creates a dom element
    img1.loadPixels();
    img2.loadPixels();
    img1col.loadPixels();
    img2col.loadPixels();

    // get biggest size of the two
    let width, height;
    if (img1.width > img2.width) {
        width = img1.width;
        height = img1.height;
        img2.resize(width, height);
        img2col.resize(width, height);
    } else {
        width = img2.width;
        height = img2.height;
        img1.resize(width, height);
        img1col.resize(width, height);
    }

    // copy the respective halves of each input image to the target
    let guess_img = createImage(width, height);
    guess_img.loadPixels();

    // compute sizes
    let halfImage = 4 * (guess_img.width) * (Math.ceil(guess_img.height / 2));

    // top line:
    let longest_run_len = 0;
    let longest_start_run = -1;
    let longest_end_run = -1;

    let current_run_len = 0;
    let current_start_run = -1;
    let current_end_run = -1;
    let i;
    for (i = halfImage - width * 4; i < halfImage; i += 4) {
        let a = img1.pixels[i+3]; // alpha value
        if (a > 95) {
            if (current_run_len == 0) {
                current_start_run = i - (halfImage - width * 4);
            }
            current_run_len += 1;
        } else {
            if (current_run_len != 0) {
                current_end_run = i - (halfImage - width * 4);
                if (current_run_len > longest_run_len) {
                    longest_run_len = current_run_len;
                    longest_start_run = current_start_run;
                    longest_end_run = current_end_run;
                }
            }
            current_run_len = 0;
        }
    }

    if (current_run_len != 0) {
        current_end_run = i;
        if (current_run_len > longest_run_len) {
            longest_run_len = current_run_len;
            longest_start_run = current_start_run;
            longest_end_run = current_end_run;
        }
    }
    
    // bot:
    let longest_run_len_2 = 0;
    let longest_start_run_2 = -1;
    let longest_end_run_2 = -1;

    let current_run_len_2 = 0;
    let current_start_run_2 = -1;
    let current_end_run_2 = -1;
    for (i = 0; i < width*4; i += 4) {
        let a = img2.pixels[i+halfImage+3];
        if (a > 95) {
            if (current_run_len_2 == 0) {
                current_start_run_2 = i;
            }
            current_run_len_2 += 1;
        } else {
            if (current_run_len_2 != 0) {
                current_end_run_2 = i;
                if (current_run_len_2 > longest_run_len_2) {
                    longest_run_len_2 = current_run_len_2;
                    longest_start_run_2 = current_start_run_2;
                    longest_end_run_2 = current_end_run_2;
                }
            }
            current_run_len_2 = 0;
        }
    }

    if (current_run_len_2 != 0) {
        current_end_run_2 = i;
        if (current_run_len_2 > longest_run_len_2) {
            longest_run_len_2 = current_run_len_2;
            longest_start_run_2 = current_start_run_2;
            longest_end_run_2 = current_end_run_2;
        }
    }

    // combine images
    if (longest_run_len > longest_run_len_2) {
        console.log("top")
        let shrink_coef = longest_run_len_2 / longest_run_len;
        console.log(shrink_coef)
        img1.resize(Math.floor(width * shrink_coef), Math.floor(height * shrink_coef));
        img1col.resize(Math.floor(width * shrink_coef), Math.floor(height * shrink_coef));

        let hdist = Math.floor(longest_start_run_2/4 - (longest_start_run/4) * shrink_coef);
        console.log(hdist)

        let triangle = Math.ceil((img2.height - img1.height) /2);
        for (let y = triangle; y < Math.ceil(img1.height/2) + triangle; y += 1) {
            for (let x = 0; x < img1.width; x += 1) {
                let full = 4 * (guess_img.width) * (guess_img.height);
                if (x+hdist >= guess_img.width || x+hdist < 0)
                    continue;

                if ((x+hdist) * 4 + y*img2.width * 4 < full && (x+hdist) * 4 + y*img2.width * 4 > 0) {
                    guess_img.pixels[(x+hdist) * 4 + y*img2.width * 4] = img1col.pixels[x * 4 + (y-triangle)*img1.width * 4];
                    guess_img.pixels[(x+hdist) * 4 + y*img2.width * 4 + 1] = img1col.pixels[x * 4 + (y-triangle)*img1.width * 4 + 1];
                    guess_img.pixels[(x+hdist) * 4 + y*img2.width * 4 + 2] = img1col.pixels[x * 4 + (y-triangle)*img1.width * 4 + 2];
                    guess_img.pixels[(x+hdist) * 4 + y*img2.width * 4 + 3] = img1col.pixels[x * 4 + (y-triangle)*img1.width * 4 + 3];
                }   
            }
        }

        for (let i = 0; i < halfImage; i += 1) {
            guess_img.pixels[i+halfImage] = img2col.pixels[i+halfImage];
        }
    } else { 
        for (let i = 0; i < halfImage; i += 1) {
            guess_img.pixels[i] = img1col.pixels[i];
        }

        let shrink_coef = longest_run_len / longest_run_len_2;
        img2.resize(Math.floor(width * shrink_coef), Math.floor(height * shrink_coef));
        img2col.resize(Math.floor(width * shrink_coef), Math.floor(height * shrink_coef));

        let hdist = Math.floor(longest_start_run/4 - (longest_start_run_2/4) * shrink_coef);
        console.log(hdist)

        for (let y = 0; y < Math.ceil(img2.height/2); y += 1) {
            for (let x = 0; x < img2.width; x += 1) {
                let full = 4 * (guess_img.width) * (guess_img.height);
                
                if (x+hdist >= guess_img.width || x+hdist < 0)
                    continue;

                if ((x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 < full && (x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 > 0) {
                    guess_img.pixels[(x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4] = img2col.pixels[x * 4 + (y+Math.ceil(img2.height/2))*img2.width * 4];
                    guess_img.pixels[(x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 + 1] = img2col.pixels[x * 4 + (y+Math.ceil(img2.height/2))*img2.width * 4 + 1];
                    guess_img.pixels[(x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 + 2] = img2col.pixels[x * 4 + (y+Math.ceil(img2.height/2))*img2.width * 4 + 2];
                    guess_img.pixels[(x+hdist) * 4 + (y+Math.ceil(img1.height/2))*img1.width * 4 + 3] = img2col.pixels[x * 4 + (y+Math.ceil(img2.height/2))*img2.width * 4 + 3];
                }
            }
        }
    }
    
    guess_img.updatePixels();

    img1.updatePixels();
    img2.updatePixels();
    img1col.updatePixels();
    img2col.updatePixels();

    return guess_img;
}