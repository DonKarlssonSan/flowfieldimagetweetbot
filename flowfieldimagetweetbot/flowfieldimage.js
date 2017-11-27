const fs = require('fs');
const Jimp = require('jimp');


module.exports.generate = function () {
    let width = 500;
    let height = 500;
    let image = new Jimp(width, height, 0x990099FF);
    
    // TODO: keep the data in memory instead of writing to disk and then reading from disk
    return new Promise((resolve, reject) => {
        image.write('img.png', err => {
            if (err) reject(err);
            fs.readFile('img.png', { encoding: 'base64' }, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    });
}