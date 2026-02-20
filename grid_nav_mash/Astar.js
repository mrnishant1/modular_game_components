export class Node {
  constructor(x, y, g, h, parent) {
    ((this.x = x),
      (this.y = y),
      (this.g = 0), //cost to move to this tile
      (this.h = 0), //distance from here to target
      (this.f = g + h),
      (this.parent = parent || null));
  }
}

export function Astar(startNode, target) {
  const open = [startNode];
  const closedHashes = new Set(); // Use hashes to track visited coords

  while (open.length > 0) {
    // 1. Find lowest F cost
    let currentIndex = 0;
    for (let i = 0; i < open.length; i++) {
      if (open[i].f < open[currentIndex].f) currentIndex = i;
    }

    let current = open[currentIndex];
    let currentHash = hashIndex(current.x, current.y);

    // 2. Check Target
    if (current.x === target.x && current.y === target.y) {
      return BuildPath(current);
    }

    // 3. Move from Open to Closed
    open.splice(currentIndex, 1);
    closedHashes.add(currentHash);

    // 4. Process Neighbors
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

    for (let [dx, dy] of directions) {
      let nx = current.x + dx;
      let ny = current.y + dy;
      let nHash = hashIndex(nx, ny);

      if (isBlocked({ x: nx, y: ny }) || closedHashes.has(nHash)) continue;

      let gScore = current.g + 1; // Cumulative cost
      let hScore = calculateDistance(target, { x: nx, y: ny });
      let neighbor = new Node(nx, ny, gScore, hScore, current);

      // Check if neighbor is already in open with a better path
      let existingOpen = open.find((n) => n.x === nx && n.y === ny);
      if (existingOpen && gScore >= existingOpen.g) continue;

      if (!existingOpen) open.push(neighbor);
    }
  }
  return []; // No path found
}