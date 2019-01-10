// let drawing = [{ x: -200, y: -200 }, { x: 0, y: -100 }, { x: 0, y: 100 }, { x: 200, y: 200 }];

let time = 0;
let wave = [];

let x = [];
let y = [];
let fourierX;
let fourierY;

function setup() {
  createCanvas(600, 400);

  for (let i = 0; i < 500; i++) {
    y[i] = 250 * noise(i / 50) - 125;
  }
  for (let i = 0; i < 500; i++) {
    x[i] = 250 * noise((i + 500) / 50) - 125;
  }
  fourierX = fourierT(x);
  fourierY = fourierT(y);
}

function draw() {
  background(0);
  translate(150, 200);

  let x = 0;
  let y = 0;

  for (let i = 0; i < fourierY.length; i++) {
    let prevx = x;
    let prevy = y;

    let radius = fourierY[i].amp;
    let angle = fourierY[i].phase + time * fourierY[i].freq + HALF_PI;
    x += radius * cos(angle);
    y += radius * sin(angle);

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);

    stroke(255);
    line(prevx, prevy, x, y);
    //ellipse(x, y, 8);
  }
  wave.unshift(y);

  translate(200, 0);
  line(x - 200, y, 0, wave[0]);
  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();

  time += TWO_PI / fourierY.length;

  if (wave.length > 250) {
    wave.pop();
  }
}
