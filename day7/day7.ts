const input = await Deno.readTextFile("input.txt");
const program = input.split(",").map((a) => parseInt(a, 10));

function runProgram(program: number[], input: number, phase: number): number {
  let idx = 0;
  const inputs = [phase, input];
  const outputs = [];

  while (true) {
    const instr = program[idx];
    const opcode = instr % 100;
    const modes = instr.toString().padStart(5, "0").slice(0, 3);

    const getValue = (offset: number): number => {
      const mode = modes[3 - offset];
      switch (mode) {
        case "0":
          return program[program[idx + offset]];
        case "1":
          return program[idx + offset];
        default:
          throw Error();
      }
    };

    switch (opcode) {
      case 99:
        return outputs.pop()!;
      case 1: {
        const res = getValue(1) + getValue(2);
        program[program[idx + 3]] = res;
        idx += 4;
        break;
      }
      case 2: {
        const res = getValue(1) * getValue(2);
        program[program[idx + 3]] = res;
        idx += 4;
        break;
      }
      case 3: {
        program[program[idx + 1]] = inputs.shift()!;
        idx += 2;
        break;
      }
      case 4: {
        outputs.push(getValue(1));
        idx += 2;
        break;
      }
      case 5: {
        const param = getValue(1);
        if (param !== 0) {
          idx = getValue(2);
        } else {
          idx += 3;
        }
        break;
      }
      case 6: {
        const param = getValue(1);
        if (param === 0) {
          idx = getValue(2);
        } else {
          idx += 3;
        }
        break;
      }
      case 7: {
        const firstParam = getValue(1);
        const secondParam = getValue(2);
        if (firstParam < secondParam) {
          program[program[idx + 3]] = 1;
        } else {
          program[program[idx + 3]] = 0;
        }
        idx += 4;
        break;
      }
      case 8: {
        const firstParam = getValue(1);
        const secondParam = getValue(2);
        if (firstParam === secondParam) {
          program[program[idx + 3]] = 1;
        } else {
          program[program[idx + 3]] = 0;
        }
        idx += 4;
        break;
      }
    }
  }
}

function test() {
  for (let a = 0; a < 5; a++) {
    for (let b = 0; b < 5; b++) {
      if (b === a) continue;
      console.log(a, b);
    }
  }
}

function allCombinations(arr: number[]): number[][] {
  const result: number[][] = [];

  for (let a = 0; a < arr.length; a++) {
    for (let b = 0; b < arr.length; b++) {
      if (b === a) continue;
      for (let c = 0; c < arr.length; c++) {
        if (c === a || c === b) continue;
        for (let d = 0; d < arr.length; d++) {
          if (d === a || d === b || d === c) continue;
          for (let e = 0; e < arr.length; e++) {
            if (e === a || e === b || e === c || e === d) continue;
            result.push([arr[a], arr[b], arr[c], arr[d], arr[e]]);
          }
        }
      }
    }
  }

  return result;
}

function solve1(program: number[]) {
  const initialPhases = [0, 1, 2, 3, 4];
  const allPhases = allCombinations(initialPhases);
  let maxOutput = 0;

  for (const phases of allPhases) {
    let output = 0;
    for (const phase of phases) {
      output = runProgram(program.slice(), output, phase);
    }
    maxOutput = Math.max(maxOutput, output);
  }

  return maxOutput;
}

class Amp {
  program: number[];
  idx: number;
  phase: number;
  phaseUsed: boolean;
  running: boolean;
  halted: boolean;
  output: number;

  constructor(program: number[], phase: number) {
    this.program = program;
    this.idx = 0;
    this.phase = phase;
    this.phaseUsed = false;
    this.running = false;
    this.halted = false;
    this.output = 0;
  }

  run(signal: number) {
    this.running = true;

    while (this.running) {
      const instr = this.program[this.idx];
      const opcode = instr % 100;
      const modes = instr.toString().padStart(5, "0").slice(0, 3);

      const getValue = (offset: number): number => {
        const mode = modes[3 - offset];
        switch (mode) {
          case "0":
            return this.program[this.program[this.idx + offset]];
          case "1":
            return this.program[this.idx + offset];
          default:
            throw Error();
        }
      };

      switch (opcode) {
        case 99: {
          this.running = false;
          this.halted = true;
          break;
        }
        case 1: {
          const res = getValue(1) + getValue(2);
          this.program[this.program[this.idx + 3]] = res;
          this.idx += 4;
          break;
        }
        case 2: {
          const res = getValue(1) * getValue(2);
          this.program[this.program[this.idx + 3]] = res;
          this.idx += 4;
          break;
        }
        case 3: {
          const input = this.phaseUsed ? signal : this.phase;
          this.phaseUsed = true;
          this.program[this.program[this.idx + 1]] = input;
          this.idx += 2;
          break;
        }
        case 4: {
          this.output = getValue(1);
          this.idx += 2;
          this.running = false;
          break;
        }
        case 5: {
          const param = getValue(1);
          if (param !== 0) {
            this.idx = getValue(2);
          } else {
            this.idx += 3;
          }
          break;
        }
        case 6: {
          const param = getValue(1);
          if (param === 0) {
            this.idx = getValue(2);
          } else {
            this.idx += 3;
          }
          break;
        }
        case 7: {
          const firstParam = getValue(1);
          const secondParam = getValue(2);
          if (firstParam < secondParam) {
            this.program[this.program[this.idx + 3]] = 1;
          } else {
            this.program[this.program[this.idx + 3]] = 0;
          }
          this.idx += 4;
          break;
        }
        case 8: {
          const firstParam = getValue(1);
          const secondParam = getValue(2);
          if (firstParam === secondParam) {
            this.program[this.program[this.idx + 3]] = 1;
          } else {
            this.program[this.program[this.idx + 3]] = 0;
          }
          this.idx += 4;
          break;
        }
      }
    }
  }
}

function solve2(program: number[]): number {
  const initialPhases = [5, 6, 7, 8, 9];
  const allPhases = allCombinations(initialPhases);
  let maxOutput = 0;

  for (const phases of allPhases) {
    const amps = phases.map((phase) => new Amp(program.slice(), phase));
    let signal = 0;
    let lastOutput = 0;

    loop: while (true) {
      for (let i = 0; i < 5; i++) {
        amps[i].run(signal);

        if (amps[i].halted && i === 4) {
          break loop;
        }

        signal = amps[i].output;

        if (i === 4) {
          lastOutput = signal;
        }
      }
    }
    maxOutput = Math.max(maxOutput, lastOutput);
  }

  return maxOutput;
}

console.log(solve1(program) === 422858);
console.log(solve2(program) === 14897241);
