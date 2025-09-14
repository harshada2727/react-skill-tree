/**
 * Check if adding an edge from source to target
 * would create a cycle in the current edge list.
 * Depth-first search from target back to source.
 */

export function createsCycle(source, target, edgesList) {
  const visited = new Set();
  const stack = [target];
  while (stack.length) {
    const node = stack.pop();
    if (node === source) return true;
    edgesList
      .filter((e) => e.source === node)
      .forEach((e) => {
        if (!visited.has(e.target)) {
          visited.add(e.target);
          stack.push(e.target);
        }
      });
  }
  return false;
}
