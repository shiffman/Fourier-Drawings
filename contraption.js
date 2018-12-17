// Original code by @meiamsome

class Contraption {
  constructor() {
    this.time = 0;
    this.time_interval = 1;
    this.length = 150;
  }

  load(points) {
    const multiplier = this.length / points.length;

    const x = Array.from(this, (_, i) => {
      const j = Math.floor(i / multiplier);
      const k = Math.ceil(i / multiplier) % points.length;
      return lerp(points[j].x, points[k].x, (i % multiplier) / multiplier);
    });
    const y = Array.from(this, (_, i) => {
      const j = Math.floor(i / multiplier);
      const k = Math.ceil(i / multiplier) % points.length;
      return lerp(points[j].y, points[k].y, (i % multiplier) / multiplier);
    });

    const { fftReal, fftImag } = tf.tidy(() => {
      const tx = tf.tensor1d(x);
      const ty = tf.tensor1d(y);
      const t = tf.complex(tx, ty);
      const fft = tf.spectral.fft(t);
      const fftReal = tf.real(fft);
      const fftImag = tf.imag(fft);
      return { fftReal, fftImag };
    });

    const data = [fftReal.dataSync(), fftImag.dataSync()];
    fftReal.dispose();
    fftImag.dispose();
    this._circles = [];
    for (let i = 0; i < data[0].length; i++) {
      let vec = new p5.Vector(data[0][i], data[1][i]);
      this._circles.push({
        freq: (i * TWO_PI) / this.length,
        mag: vec.mag() / this.length,
        phase: vec.heading()
      });
    }
    this._circles.filter(({ mag }) => mag > 0.1);
    this._circles.sort((a, b) => b.mag - a.mag);
    this._points = [];
    return this;
  }

  step() {
    this.time = (this.time + this.time_interval) % this.length;
  }

  render() {
    let x = 0;
    let y = 0;
    noFill();
    stroke(0, 150);
    for (let { freq, mag, phase } of this._circles) {
      let prevX = x;
      let prevY = y;
      let phase_out = phase + freq * this.time;
      x += mag * cos(phase_out);
      y += mag * sin(phase_out);
      // Ignore our DC offset
      if (freq !== 0) {
        ellipse(prevX, prevY, mag * 2);
        line(prevX, prevY, x, y);
      }
    }
    this._points.push({ x, y });
    stroke(0);
    fill(0);
    ellipse(x, y, 4);
    noFill();
    beginShape();
    for (const point of this._points) {
      vertex(point.x, point.y);
    }
    endShape();
    while (this._points.length > this.length / this.time_interval)
      this._points.shift();
  }
}
