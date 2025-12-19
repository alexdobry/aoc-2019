function runProgram(program: number[], input: number) {
  let idx = 0;
  let relativeBase = 0;
  const output: number[] = [];
  let modes = "";

  function getValue(offset: number): number {
    const mode = modes[3 - offset];
    switch (mode) {
      case "0": {
        const index = program[idx + offset];
        return program[index];
      }
      case "1":
        return program[idx + offset];
      case "2": {
        const index = program[idx + offset] + relativeBase;
        return program[index];
      }
      default:
        throw Error();
    }
  }

  function getIndex(offset: number): number {
    const mode = modes[3 - offset];
    switch (mode) {
      case "0":
        return program[idx + offset];
      case "2":
        return program[idx + offset] + relativeBase;
      default:
        throw Error();
    }
  }

  while (true) {
    const instr = program[idx];
    const opcode = instr % 100;
    modes = instr.toString().padStart(5, "0").slice(0, 3);

    switch (opcode) {
      case 99:
        return output;
      case 1: {
        const res = getValue(1) + getValue(2);
        program[getIndex(3)] = res;
        idx += 4;
        break;
      }
      case 2: {
        const res = getValue(1) * getValue(2);
        program[getIndex(3)] = res;
        idx += 4;
        break;
      }
      case 3: {
        program[getIndex(1)] = input;
        idx += 2;
        break;
      }
      case 4: {
        output.push(getValue(1));
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
          program[getIndex(3)] = 1;
        } else {
          program[getIndex(3)] = 0;
        }
        idx += 4;
        break;
      }
      case 8: {
        const firstParam = getValue(1);
        const secondParam = getValue(2);
        if (firstParam === secondParam) {
          program[getIndex(3)] = 1;
        } else {
          program[getIndex(3)] = 0;
        }
        idx += 4;
        break;
      }
      case 9: {
        relativeBase += getValue(1);
        idx += 2;
        break;
      }
    }
  }
}

const input = await Deno.readTextFile("input.txt");
const memory = new Array(100).fill(0);

const strProgram = input.split(",");
for (let i = 0; i < strProgram.length; i++) {
  memory[i] = parseInt(strProgram[i], 10);
}

console.log(runProgram(memory, 1)[0] === 3409270027);
console.log(runProgram(memory, 2)[0] === 82760);
