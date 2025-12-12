const input = await Deno.readTextFile("input.txt");

function parse(input: string): number[] {
  const result = [];
  let idx = 0;
  while (idx < input.length) {
    result.push(input.charCodeAt(idx++) - 48);
  }
  return result;
}

function makeLayers(input: string, width: number, height: number): number[][] {
  const digits = parse(input)
  const layers: number[][] = [];
  let idx = 0;

  for (const d of digits) {
    if (idx % (width * height) === 0) {
      layers.push([]);
    }
    layers[layers.length - 1].push(d);
    idx++;
  }
  return layers;
}

function solve1(layers: number[][]): number {
  let smallestLayerIndex = 0;
  let smallestZeros = Number.MAX_VALUE;

  for (let index = 0; index < layers.length; index++) {
    const layer = layers[index];
    let zeros = 0;
    for (const d of layer) {
      if (d === 0) {
        zeros++;
      }
    }
    if (zeros < smallestZeros) {
      smallestZeros = zeros;
      smallestLayerIndex = index;
    }
  }

  let ones = 0;
  let twos = 0;
  for (const d of layers[smallestLayerIndex]) {
    if (d === 1) {
      ones++;
    } else if (d === 2) {
      twos++;
    }
  }
  return ones * twos;
}

function solve2(layers: number[][], width: number, height: number): string {
  const result: number[] = new Array(width * height).fill(2);

  for (let i = 0; i < width * height; i++) {
    for (let j = 0; j < layers.length; j++) {
      const pixel = layers[j][i];
      if (pixel !== 2) {
        result[i] = pixel;
        break;
      }
    }
  }

  let row = "";
  for (let i = 0; i < result.length; i++) {
    if (i !== 0 && i % width === 0) {
      row += "\n";
    }
    const value = result[i];
    row += value === 1 ? "\u2588" : " ";
  }

  return row;
}

performance.mark("run");

const layers = makeLayers(input, 25, 6);
console.log(solve1(layers));

// const layers = makeLayers("0222112222120000", 2, 2);
// console.log(layers);
// console.log(solve2(layers, 2, 2));

console.log(solve2(layers, 25, 6));

const time = performance.measure("time", "run");
console.log(time.duration.toFixed(2));