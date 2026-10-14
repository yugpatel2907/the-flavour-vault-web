// Repeatable visual samples keep particle placement stable across renders,
// including server rendering and client hydration.
export function particleRandom(index: number, channel: number): number {
  let value = Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(channel + 1, 0x85ebca6b);
  value = Math.imul(value ^ (value >>> 16), 0x85ebca6b);
  value = Math.imul(value ^ (value >>> 13), 0xc2b2ae35);
  return ((value ^ (value >>> 16)) >>> 0) / 0x100000000;
}
