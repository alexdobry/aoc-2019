function runProgram(program: number[]) {
  let opcodeIdx = 0;

  while (true) {
    const opcode = program[opcodeIdx];

    if (opcode == 99) {
      return;
    }

    if (opcode == 1 || opcode == 2) {
      const posA = program[opcodeIdx + 1];
      const posB = program[opcodeIdx + 2];
      const posRes = program[opcodeIdx + 3];
      const lhs = program[posA];
      const rhs = program[posB];
      program[posRes] = opcode == 1 ? lhs + rhs : lhs * rhs;
      opcodeIdx += 4;
    }
  }
}

function solve1(program: number[]): number {
  program[1] = 12;
  program[2] = 2;
  runProgram(program);
  return program[0];
}

function resetToOrigin(program: number[], origin: number[]) {
  let i = 0;
  while (i < origin.length - 1) {
    program[i] = origin[i];
    i++;
  }
}

function solve2(program: number[], origin: number[]): number {
  const output = 19690720;
  let noun = 0;
  let verb = 0;

  while (noun <= 99) {
    while (verb <= 99) {
      resetToOrigin(program, origin);
      program[1] = noun;
      program[2] = verb;
      runProgram(program);
      const res = program[0];
      if (res === output) {
        return 100 * noun + verb;
      } else {
        verb += 1;
      }
    }
    verb = 0;
    noun += 1;
  }

  return NaN;
}

const input = await Deno.readTextFile("input.txt");
const origin = input.split(",").map((a) => parseInt(a, 10));
const program = origin.slice();

console.log(solve1(program));
console.log(solve2(program, origin));
