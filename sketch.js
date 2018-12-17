// Original code by @meiamsome

let categories;
let category;
let contraption;
let dropdown;
let drawButton;
var drawingMode = false;

let drawing = [
  { x: -200, y: -200 },
  { x: 0, y: -100 },
  { x: 0, y: 100 },
  { x: 200, y: 200 }
];

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return a * (b / gcd(a, b));
}

function setup() {
  let canvas = createCanvas(800, 800);
  contraption = new Contraption().load(drawing);
}

let drawingLines = [];
let drawingInterval = null;

function draw() {
  background(220);
  translate(width / 2, height / 2);
  for (const [xs, ys] of drawingLines) {
    beginShape();
    for (let i = 0; i < xs.length; i++) {
      vertex(xs[i], ys[i]);
    }
    endShape();
  }
  contraption.step();
  contraption.render();
}
