// Original code by @meiamsome

let categories;
let category;
let contraptionSet;
let dropdown;
let drawButton;
var drawingMode = false;
var maxSegments = 4096;

let drawing = [[[-200, 0, 0, 200], [-200, -100, 100, 200]]];

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return a * (b / gcd(a, b));
}

async function setup() {
  let canvas = createCanvas(800, 800);
  contraptionSet = await new ContraptionSet().load(drawing, maxSegments);
}

let drawingLines = [];
let drawingInterval = null;

async function draw() {
  frameRate(5);
  background(220);
  translate(width / 2, height / 2);
  for (const [xs, ys] of drawingLines) {
    beginShape();
    for (let i = 0; i < xs.length; i++) {
      vertex(xs[i], ys[i]);
    }
    endShape();
  }
  if (contraptionSet) {
    contraptionSet.step();
    contraptionSet.render(true);
    // if (contraptionSet.segments < 1000) {
    //   await new Promise(r => setTimeout(r, (1000 - contraptionSet.segments) / 10));
    // }
  }
}
