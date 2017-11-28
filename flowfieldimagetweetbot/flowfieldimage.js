const fs = require('fs');
const Jimp = require('jimp');
const SimplexNoise = require('simplex-noise');

module.exports.generate = function () {
    console.log('About to generate image');
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
    
    // TODO: keep the data in memory instead of writing to disk and then reading from disk
    return new Promise((resolve, reject) => {
        image.write('img.png', err => {
            if (err) reject(err);
            fs.readFile('img.png', { encoding: 'base64' }, (err, data) => {
                if (err) reject(err);
                console.log('Image generated');
                resolve(data);
            });
        });
    });
}
