const input = await Deno.readTextFile("input1.txt");

function calcFuel(mass: number) {
  const fuel = Math.floor(mass / 3) - 2;
  return fuel < 0 ? 0 : fuel;
}

function solve1(input: string): number {
  let sum = 0;
  for (const mass of input.split("\n")) {
    sum += calcFuel(parseInt(mass));
  }
  return sum;
}

function solve2(input: string): number {
  let sum = 0;
  for (const mass of input.split("\n")) {
    let local = 0;
    let fuel = calcFuel(Number(mass));
    local += fuel;

    while (calcFuel(fuel) > 0) {
      const subFuel = calcFuel(fuel);
      fuel = subFuel;
      local += subFuel;
    }
    sum += local;
  }
  return sum;
}

function solve3(input: string): number {
  function go(acc: number, mass: number): number {
    const fuel = calcFuel(mass);

    if (fuel > 0) {
      return go(acc + fuel, fuel);
    } else {
      return acc;
    }
  }
  let sum = 0;
  for (const mass of input.split("\n")) {
    sum += go(0, Number(mass));
  }
  return sum;
}

// console.log(solve3('14') === 2)
// console.log(solve3('1969') === 966)
// console.log(solve3('100756') === 50346)
console.log(solve1(input));
