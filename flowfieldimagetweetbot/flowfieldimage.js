const fs = require('fs');
const Jimp = require('jimp');
const SimplexNoise = require('simplex-noise');

module.exports.generate = function (log) {
    log('About to generate image');
    let simplex = new SimplexNoise(Math.random);
    let width = 500;
    let height = 500;
    let image = new Jimp(width, height, 0x000000FF);

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            let n = (simplex.noise2D(x / 100, y / 100) + 1) / 2 * 255;
            let color = Jimp.rgbaToInt(n, 0, n, 255);
            image.setPixelColor(color, x, y);
        }
    }
    
    return new Promise((resolve, reject) => {
        image.getBase64(Jimp.MIME_PNG, (err, buffer) => {
            if (err) reject(err);
            log('Image generated');
            resolve(buffer);
        });
    });
}
