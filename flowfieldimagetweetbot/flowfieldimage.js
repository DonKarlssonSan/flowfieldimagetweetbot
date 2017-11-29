'use strict';

const SimplexNoise = require('simplex-noise');
const Particle = require('./particle');
const Vector = require('vectory-lib');
const { createCanvas, loadImage } = require('canvas');

let canvas;
let ctx;
let field;
let w, h;
let size;
let columns;
let rows;
let noiseZ;
let simplex;
let particles;
let config;
let colorConfig;
let hueTicker;

module.exports.generate = function (log) {
    log('About to generate image');

    setup();
    draw();
/*
    const fs = require('fs');
    const out = fs.createWriteStream('img.png');
    const stream = canvas.pngStream();
    stream.pipe(out);
    console.log('stream written to disk');
*/
    return new Promise((resolve, reject) => {
        canvas.toBuffer((err, buffer) => {
            if (err) reject(err);
            log('Image generated');
            resolve(buffer);
        });
    });
}

function setup() {
    size = 4;
    noiseZ = 0;

    config = {
        width: 700,
        height: 500,
        lineMode: true,
        angleZoom: 70,
        lengthZoom: 70,
        noiseSpeed: 70,
        particleSpeed: 4,
        numberOfParticles: 1000,
        fieldForce: 10,
        clearAlpha: 0,
        iterations: 1500,
    };

    colorConfig = {
        particleOpacity: 100,
        baseHue: 120,
        hueRange: 90,
        hueSpeed: 10,
        colorSaturation: 100,
    };

    simplex = new SimplexNoise(Math.random);
    w = config.width;
    h = config.height;
    canvas = createCanvas(w, h);
    ctx = canvas.getContext("2d");
    columns = Math.floor(w / size) + 1;
    rows = Math.floor(h / size) + 1;
    drawBackground(1);
    initParticles();
    initField();
}

function initParticles() {
    particles = [];
    for (let i = 0; i < config.numberOfParticles; i++) {
        let x = Math.random() * w;
        let y = Math.random() * h;
        let particle = new Particle(x, y, config.particleSpeed);
        particles.push(particle);
    }
}

function draw() {
    hueTicker = 0;
    drawBackground(1);
    for (let i = 0; i < config.iterations; i++) {
        calculateField();
        noiseZ += config.noiseSpeed / 10000;
        drawParticles();
    }
}

function initField() {
    field = new Array(columns);
    for (let x = 0; x < columns; x++) {
        field[x] = new Array(columns);
        for (let y = 0; y < rows; y++) {
            field[x][y] = new Vector(0, 0);
        }
    }
}

function calculateField() {
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            let angle = simplex.noise3D(x / config.angleZoom / 5, y / config.angleZoom / 5, noiseZ) * Math.PI * 2;
            let length = simplex.noise3D(x / config.lengthZoom + 40000, y / config.lengthZoom + 40000, noiseZ) * config.fieldForce / 20;
            field[x][y].setLength(length);
            field[x][y].setAngle(angle);
        }
    }
}

function drawBackground(alpha) {
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha || config.clearAlpha})`;
    ctx.fillRect(0, 0, w, h);
}

function drawParticles() {
    let pos = new Vector(0, 0);
    hueTicker += colorConfig.hueSpeed / 1000;
    let hue = Math.sin(hueTicker) * colorConfig.hueRange + colorConfig.baseHue;
    ctx.fillStyle = `hsla(${hue}, ${colorConfig.colorSaturation}%, 50%, ${colorConfig.particleOpacity / 500})`;
    ctx.strokeStyle = `hsla(${hue}, ${colorConfig.colorSaturation}%, 50%, ${colorConfig.particleOpacity / 500})`;
    particles.forEach(p => {
        if (config.lineMode) {
            p.drawLine(ctx);
        } else {
            p.draw(ctx);
        }
        pos.x = p.pos.x / size;
        pos.y = p.pos.y / size;

        let v;
        if (pos.x >= 0 && pos.x < columns && pos.y >= 0 && pos.y < rows) {
            v = field[Math.floor(pos.x)][Math.floor(pos.y)];
        }
        p.move(v);
        p.wrap();
    });
}

//module.exports.generate(console.log);