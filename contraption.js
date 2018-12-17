// Original code by @meiamsome

class Contraption {
  load(points, length = points[0].length) {
    this.length = length;
    const multiplier = length / points[0].length;
    const x = Array.from(this, (_, i) =>
      lerp(
        points[0][Math.floor(i / multiplier)],
        points[0][Math.ceil(i / multiplier) % points[0].length],
        (i % multiplier) / multiplier
      )
    );
    const y = Array.from(this, (_, i) =>
      lerp(
        points[1][Math.floor(i / multiplier)],
        points[1][Math.ceil(i / multiplier) % points[1].length],
        (i % multiplier) / multiplier
      )
    );

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
        freq: (i * TWO_PI) / length,
        mag: vec.mag() / length,
        phase: vec.heading()
      });
    }
    this._circles.filter(({ mag }) => mag > 0.1);
    this._circles.sort((a, b) => b.mag - a.mag);
    this._points = [];
    return this;
  }

  render(time, show_contraption = false, time_interval = 1) {
    let x = 0;
    let y = 0;
    noFill();
    stroke(0, 50);
    for (let { freq, mag, phase } of this._circles) {
      let prevX = x;
      let prevY = y;
      let phase_out = phase + freq * time;
      x += mag * cos(phase_out);
      y += mag * sin(phase_out);
      // Ignore our DC offset
      if (freq !== 0 && show_contraption) {
        ellipse(prevX, prevY, mag * 2);
        line(prevX, prevY, x, y);
      }
    }
    this._points.push({ x, y });
    stroke(0);
    if (show_contraption) {
      fill(0);
      ellipse(x, y, 4);
      noFill();
    }
    beginShape();
    for (const point of this._points) {
      vertex(point.x, point.y);
    }
    endShape();
    while (this._points.length > this.length / time_interval) this._points.shift();
  }
}

class ContraptionSet {
  constructor() {
    this._time = 0;
    this._time_interval = 1;
    this.length = 1;
  }

  load(drawing, maxSegments = null) {
    this.length = 1;
    for (const segment of drawing) {
      const start = new p5.Vector(segment[0][0], segment[1][0]);
      const end = new p5.Vector(
        segment[0][segment[0].length - 1],
        segment[1][segment[1].length - 1]
      );
      if (start.dist(end) > 25) {
        // Go backwards at the end to prevent a jump
        segment[0].push(...segment[0].slice().reverse());
        segment[1].push(...segment[1].slice().reverse());
      }
      this.length = lcm(this.length, segment[0].length);
    }
    if (maxSegments && this.length * drawing.length > maxSegments) {
      throw new Error(`Too many segments: ${this.length * drawing.length} > ${maxSegments}`);
    }
    this._contraptions = drawing.map(drawing_part =>
      new Contraption().load(drawing_part, this.length)
    );
    this.segments = this._contraptions.reduce((acc, contraption) => acc + contraption.length, 0);
    return this;
  }

  async step() {
    this._time = (this._time + this._time_interval) % this.length;
  }

  async render(show_contraption = false) {
    for (const contraption of this._contraptions) {
      contraption.render(this._time, show_contraption, this._time_interval);
    }
  }
}
