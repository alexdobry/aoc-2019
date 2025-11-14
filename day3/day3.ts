type Direction = "U" | "D" | "L" | "R";

interface Instruction {
  direction: Direction;
  distance: number;
}

interface Point {
  x: number;
  y: number;
}

function isDirection(str: string): str is Direction {
  return str === "U" || str === "D" || str === "L" || str === "R";
}

function parseInstructions(wire: string): Instruction[] {
  return wire.split(",").map((s) => {
    const direction = s.charAt(0);
    if (isDirection(direction)) {
      const distance = parseInt(s.slice(1), 10);
      return { direction, distance };
    } else {
      throw Error("expected direction");
    }
  });
}

function move(origin: Point, instr: Instruction): Point[] {
  const points = [];
  switch (instr.direction) {
    case "U": {
      let i = 0;
      while (i < instr.distance) {
        origin.y += 1;
        points.push({ ...origin });
        i++;
      }
      break;
    }
    case "D": {
      let i = 0;
      while (i < instr.distance) {
        origin.y -= 1;
        points.push({ ...origin });
        i++;
      }
      break;
    }
    case "L": {
      let i = 0;
      while (i < instr.distance) {
        origin.x -= 1;
        points.push({ ...origin });
        i++;
      }
      break;
    }
    case "R": {
      let i = 0;
      while (i < instr.distance) {
        origin.x += 1;
        points.push({ ...origin });
        i++;
      }
      break;
    }
  }
  return points;
}

function makeKey(p: Point): number {
  return (p.x << 16) | p.y;
}

function solve1(firstWire: Instruction[], secondWire: Instruction[]): number {
  const points = new Set<number>();
  const origin: Point = { x: 0, y: 0 };
  let current: Point = { ...origin };

  for (const instr of firstWire) {
    move(current, instr).forEach((p) => points.add(makeKey(p)));
  }

  current = { ...origin };
  let minDist: number = Number.MAX_VALUE;

  for (const instr of secondWire) {
    for (const path of move(current, instr)) {
      const key = makeKey(path);
      if (points.has(key)) {
        minDist = Math.min(minDist, Math.abs(path.x) + Math.abs(path.y));
      }
    }
  }

  return minDist;
}

function solve2(firstWire: Instruction[], secondWire: Instruction[]): number {
  const points = new Map<string, number>();
  const origin: Point = { x: 0, y: 0 };
  let current: Point = { ...origin };

  let steps = 1;
  for (const instr of firstWire) {
    for (const path of move(current, instr)) {
      const key = JSON.stringify(path);
      const value = points.get(key);
      if (value === undefined) {
        points.set(key, steps);
      }
      steps++;
    }
  }

  current = { ...origin };
  steps = 1;
  let fewestSteps: number = Number.MAX_VALUE;

  for (const instr of secondWire) {
    for (const path of move(current, instr)) {
      const key = JSON.stringify(path);
      if (points.has(key)) {
        // intersection
        const minStep1 = points.get(key)!;
        const step2 = steps;
        fewestSteps = Math.min(fewestSteps, minStep1 + step2);
      }
      steps++;
    }
  }

  return fewestSteps;
}

const [first, second] = (await Deno.readTextFile("input.txt")).split("\n");
const wire1 = parseInstructions(first);
const wire2 = parseInstructions(second);
console.log(solve1(wire1, wire2));
// const sampleFirst = parseInstructions("R8,U5,L5,D3");
// const sampleSecond = parseInstructions("U7,R6,D4,L4");

// console.log(
//   solve2(
//     parseInstructions("R75,D30,R83,U83,L12,D49,R71,U7,L72"),
//     parseInstructions("U62,R66,U55,R34,D71,R55,D58,R83")
//   ) === 610
// );

// console.log(
//   solve2(
//     parseInstructions("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51"),
//     parseInstructions("U98,R91,D20,R16,D67,R40,U7,R15,U6,R7")
//   ) === 410
// );

console.log(solve2(parseInstructions(first), parseInstructions(second)));
