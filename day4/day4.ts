function solve1(min: number, max: number): number {
  let start = min;
  let count = 0;

  loop: while (start < max) {
    const current = start.toString();
    let i = 0;
    let sameNeighbor = false;

    while (i < current.length - 1) {
      const lhs = current.charAt(i);
      const rhs = current.charAt(i + 1);

      if (parseInt(lhs, 10) > parseInt(rhs, 10)) {
        start++;
        continue loop;
      }

      sameNeighbor = lhs === rhs;
      i++;
    }

    if (sameNeighbor) {
      count++;
    }

    start++;
  }

  return count;
}

function solve2(min: number, max: number): number {
  let start = min;
  let count = 0;

  loop: while (start < max) {
    const current = start.toString();
    let i = 0;
    let duplicates = 0
    let foundTwo = false

    while (i < current.length - 1) {
      const lhs = current.charAt(i);
      const rhs = current.charAt(i + 1);
      const left = parseInt(lhs, 10);

      if (left > parseInt(rhs, 10)) {
        start++;
        continue loop;
      }

      if (lhs === rhs) {
        duplicates++
      } else {
        if (duplicates === 1) {
          foundTwo = true
        }
        duplicates = 0
      }

      i++;
    }

    if (duplicates === 1) {
      foundTwo = true
    }

    if (foundTwo) {
      count++;
    }

    start++;
  }

  return count;
}

console.log(solve1(387638, 919123));
console.log(solve2(387638, 919123));
