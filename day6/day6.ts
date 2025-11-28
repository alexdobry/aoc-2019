const input = await Deno.readTextFile("input.txt");
const orbits = input.split("\n");

function checksum(
  graph: Map<string, string[]>,
  parent: string,
  depth: number
): number {
  const children = graph.get(parent);
  if (!children) return 0;

  let acc = 0;
  for (const child of children) {
    const cur = depth + 1;
    acc += cur;
    acc += checksum(graph, child, cur);
  }

  return acc;
}

function solve1(orbits: string[]) {
  const graph = new Map<string, string[]>();

  for (const orbit of orbits) {
    const [parent, child] = orbit.split(")");
    const children = graph.get(parent);
    if (children) {
      children.push(child);
    } else {
      graph.set(parent, [child]);
    }
  }

  return checksum(graph, "COM", 0);
}

function shortestPath(
  graph: Map<string, string[]>,
  start: string,
  end: string
): number {
  const queue: { node: string; dist: number }[] = [{ node: start, dist: 0 }];
  const visited = new Set<string>();
  visited.add(start);

  while (queue.length > 0) {
    const { node, dist } = queue.shift()!;

    if (node === end) {
      return dist - 2;
    }

    const neighbors = graph.get(node);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ node: neighbor, dist: dist + 1 });
        }
      }
    }
  }

  throw Error();
}

function solve2(orbits: string[]) {
  const graph = new Map<string, string[]>();

  for (const orbit of orbits) {
    const [parent, child] = orbit.split(")");
    const parentChildren = graph.get(parent);
    if (parentChildren) {
      parentChildren.push(child);
    } else {
      graph.set(parent, [child]);
    }

    // undirected to traverse both ways
    const childChildren = graph.get(child);
    if (childChildren) {
      childChildren.push(parent);
    } else {
      graph.set(child, [parent]);
    }
  }

  return shortestPath(graph, "YOU", "SAN");
}

console.log(solve1(orbits));
console.log(solve2(orbits));
