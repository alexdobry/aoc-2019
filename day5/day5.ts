const input = await Deno.readTextFile("input.txt");
const program = input.split(",").map((a) => parseInt(a, 10));

function runProgram(program: number[], input: number) {
  let idx = 0;

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
        return;
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
        program[program[idx + 1]] = input;
        idx += 2;
        break;
      }
      case 4: {
        console.log(getValue(1));
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

function solve1(program: number[]) {
  runProgram(program, 1);
}

function solve2(program: number[]) {
  runProgram(program, 5);
}

solve1([...program]);
solve2([...program]);
