// From: https://en.wikipedia.org/wiki/Discrete_Fourier_transform

function fourierT(data) {
  let N = data.length;
  let fourier = [];

  // for every frequency...
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      re += data[n] * cos((TWO_PI * k * n) / N);
      im -= data[n] * sin((TWO_PI * k * n) / N);
    }
    // Average contribution at this frequency
    re = re / N;
    im = im / N;
    fourier[k] = {
      re: re,
      im: im,
      freq: k,
      amp: sqrt(re * re + im * im),
      phase: atan2(im, re)
    };
  }
  return fourier;
}
