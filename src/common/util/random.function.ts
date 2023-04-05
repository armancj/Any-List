export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}
export function getRandomArray<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}