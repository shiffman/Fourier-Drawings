// let drawing = [{ x: -200, y: -200 }, { x: 0, y: -100 }, { x: 0, y: 100 }, { x: 200, y: 200 }];

// Fourier Series
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgA
// https://editor.p5js.org/codingtrain/sketches/SJ02W1OgV

let time = 0;
let wave = [];

let y = [];
let fourier;

function setup() {
  createCanvas(600, 400);

  for (let i = 0; i < 10; i++) {
    y[i] = i * 10;
  }
  console.log(y);

  slider = createSlider(1, 10, 5);
  fourier = fourierT(y);
  console.log(fourier);
}

function draw() {
  background(0);
  translate(150, 200);

  let x = 0;
  let y = 0;

  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;

    let radius = fourier[i].amp;
    let angle = fourier[i].phase + time * (fourier[i].freq + 1);
    x += radius * cos(angle);
    y += radius * sin(angle);

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);

    //fill(255);
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

  time += 0.02;

  if (wave.length > 250) {
    wave.pop();
  }
}
