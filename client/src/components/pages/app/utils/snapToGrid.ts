export function snapToGrid(x: number, y: number, gridSize: number = 20): [number, number] {
  const snappedX = Math.round(x / gridSize) * gridSize;
  const snappedY = Math.round(y / gridSize) * gridSize;
  return [snappedX, snappedY];
}
