export function intToNPWP(intValue) {
  // Convert the integer to an NPWP string format
  const npwpString = String(intValue).padStart(15, "0");
  return `${npwpString.slice(0, 2)}.${npwpString.slice(2, 5)}.${npwpString.slice(5, 8)}.${npwpString.slice(8, 9)}-${npwpString.slice(9, 12)}.${npwpString.slice(12)}`;
}
